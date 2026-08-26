"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createBrowserStore } from "./browserStore";

/**
 * Microsoft Entra ID sign in, restricted to NUS accounts.
 *
 * NUS runs on Microsoft 365, so "sign in with your NUS account" means Entra,
 * not Google. This runs entirely in the browser using the OAuth 2.0
 * authorization code flow with PKCE, because the site is a static export with
 * no server (see src/lib/moduleReviews.ts). PKCE is what makes that safe
 * without a client secret, and it is the only flow Entra allows for an app
 * registered with the Single-page application platform.
 *
 * The shape of the round trip:
 *
 *   1. `signIn` mints a code verifier, stashes it in sessionStorage, and sends
 *      the browser to Entra with the matching SHA-256 challenge.
 *   2. Entra sends the browser back here with `?code=`.
 *   3. `exchangeCode` POSTs the code plus the original verifier to the token
 *      endpoint and gets an ID token back. Entra allows this cross-origin for
 *      SPA redirect URIs.
 *   4. The email in the token is checked against NUS_EMAIL_DOMAINS.
 *
 * IMPORTANT, and worth reading before trusting this for anything sensitive: a
 * client side check is a user interface gate, not a security boundary. The ID
 * token arrives straight from Entra over TLS so it is trustworthy at that
 * moment, but it is then decoded without verifying the signature and cached in
 * localStorage, and a determined person can put whatever they like into their
 * own browser storage. That is an acceptable trade for gating a review form on
 * a static site, where there is no server and nothing secret to protect. The
 * moment reviews are persisted to a real backend, that backend must verify the
 * token server side against Microsoft's public keys and re-check both the
 * tenant and the email domain. Do not skip that step.
 *
 * Setting it up, once, in the Azure portal:
 *
 *   - Register an application, platform "Single-page application".
 *   - Add every origin the site runs on as a redirect URI, including the path,
 *     for example https://nusdescholars.com/study-hub and
 *     http://localhost:3000/study-hub. Add the trailing slash variants too, the
 *     match is exact.
 *   - Set NEXT_PUBLIC_ENTRA_CLIENT_ID to the Application (client) ID, and
 *     NEXT_PUBLIC_ENTRA_TENANT if the app does not live in the NUS tenant.
 *     Both have working defaults below, so neither is required.
 *
 * The registration this ships with was created from the CLI, because NUS blocks
 * the Entra admin center for non-admins:
 *
 *   az login --allow-no-subscriptions
 *   az ad app create --display-name "..." --sign-in-audience AzureADMyOrg
 *   az rest --method PATCH --uri ".../applications/<object id>" \
 *     --body '{"spa":{"redirectUris":[...]}}'
 *
 * Redirect URIs must be registered as SPA, not Web. Web requires a client
 * secret and blocks the cross-origin token exchange PKCE depends on.
 *
 * With CLIENT_ID emptied the whole thing reports "unconfigured" and the site
 * still builds and runs, so nothing here blocks a deploy.
 */

/** Domains accepted as proof of being an NUS student or staff member. */
export const NUS_EMAIL_DOMAINS = ["u.nus.edu", "nus.edu.sg"];

const SESSION_KEY = "descholars.nusSession.v2";
const PKCE_KEY = "descholars.nusSignIn.v2";

/**
 * The Entra app registration this site signs people in with.
 *
 * A client ID is a public identifier rather than a secret, and it ships in the
 * browser bundle either way, so it lives here as a default instead of being one
 * more thing a new committee member has to set in two repos and Vercel. Set the
 * environment variable to point at a different registration without editing
 * this file.
 */
const CLIENT_ID =
  process.env.NEXT_PUBLIC_ENTRA_CLIENT_ID ??
  "cf772315-ba17-438c-9261-dba50653a07a";
/** The NUS tenant. The GUID is exact, a verified domain also works. */
const TENANT =
  process.env.NEXT_PUBLIC_ENTRA_TENANT ??
  "5ba5ef5e-3109-4e77-85bd-cfeb0d347e82";
const SCOPES = "openid profile email";

const AUTHORITY = `https://login.microsoftonline.com/${TENANT}`;
const AUTHORIZE_URL = `${AUTHORITY}/oauth2/v2.0/authorize`;
const TOKEN_URL = `${AUTHORITY}/oauth2/v2.0/token`;

export interface NusUser {
  email: string;
  name: string;
  /** Seconds since epoch, from the token's `exp` claim. */
  expiresAt: number;
}

export type AuthStatus =
  | "unconfigured"
  | "loading"
  | "signed-out"
  | "signed-in"
  | "rejected-domain"
  | "error";

interface AuthSnapshot {
  status: AuthStatus;
  user: NusUser | null;
  /** Set when a non NUS account was used, so the UI can explain the rejection. */
  rejectedEmail: string | null;
  /** Set when the round trip to Entra failed, for the same reason. */
  error: string | null;
}

interface AuthContextValue extends AuthSnapshot {
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* Tokens                                                                      */
/* -------------------------------------------------------------------------- */

interface IdTokenClaims {
  email?: string;
  preferred_username?: string;
  upn?: string;
  name?: string;
  nonce?: string;
  exp?: number;
}

/** Decode a JWT payload. Does not verify the signature, see the note above. */
function decodeIdToken(token: string): IdTokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as IdTokenClaims;
  } catch {
    return null;
  }
}

export function isNusEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return NUS_EMAIL_DOMAINS.some((domain) => lower.endsWith("@" + domain));
}

/* -------------------------------------------------------------------------- */
/* PKCE                                                                        */
/* -------------------------------------------------------------------------- */

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function challengeFor(verifier: string): Promise<string> {
  const digest = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return base64Url(new Uint8Array(digest));
}

interface PendingSignIn {
  verifier: string;
  state: string;
  nonce: string;
  redirectUri: string;
  /** Path the person was on when they started, restored after the round trip. */
  returnTo: string;
}

function writePending(pending: PendingSignIn): void {
  try {
    window.sessionStorage.setItem(PKCE_KEY, JSON.stringify(pending));
  } catch {
    // Nothing to do. The mismatch is caught when the redirect comes back.
  }
}

function takePending(): PendingSignIn | null {
  try {
    const raw = window.sessionStorage.getItem(PKCE_KEY);
    window.sessionStorage.removeItem(PKCE_KEY);
    return raw ? (JSON.parse(raw) as PendingSignIn) : null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Session                                                                     */
/* -------------------------------------------------------------------------- */

function readStoredUser(): NusUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const user = JSON.parse(raw) as NusUser;
    const stillValid =
      user.expiresAt * 1000 > Date.now() && isNusEmail(user.email);
    return stillValid ? user : null;
  } catch {
    return null;
  }
}

function storeUser(user: NusUser): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // Non fatal, the session just will not survive a reload.
  }
}

function forgetUser(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore, the snapshot below is what the UI reads.
  }
}

/* -------------------------------------------------------------------------- */
/* The store                                                                   */
/* -------------------------------------------------------------------------- */

const LOADING: AuthSnapshot = {
  status: "loading",
  user: null,
  rejectedEmail: null,
  error: null,
};

// Held outside React because the sign in round trip spans a full page load, so
// there is no component alive to own it. Components read it through
// useSyncExternalStore, which keeps the first render server safe. See
// src/lib/browserStore.ts.
let snapshot: AuthSnapshot = LOADING;

const authStore = createBrowserStore<AuthSnapshot>(() => snapshot, LOADING);

function setSnapshot(next: AuthSnapshot): void {
  snapshot = next;
  authStore.invalidate();
}

function failed(message: string): AuthSnapshot {
  return {
    status: "error",
    user: null,
    rejectedEmail: null,
    error: message,
  };
}

/* -------------------------------------------------------------------------- */
/* The flow                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Every sign in returns to this one path, never to the page it started from.
 *
 * Entra matches redirect URIs exactly, so deriving one from the current
 * pathname would mean registering every course page, and every course added
 * later would silently break sign in. Pinning it to a single path keeps the
 * registered list to the origins the site is served from. Where the person was
 * is carried in `returnTo` and restored once the token is in.
 */
const REDIRECT_PATH = "/study-hub";

function redirectUri(): string {
  return window.location.origin + REDIRECT_PATH;
}

/** Drop the OAuth parameters so a reload does not replay a spent code. */
function cleanUrl(): void {
  window.history.replaceState(
    {},
    "",
    window.location.origin + window.location.pathname + window.location.hash,
  );
}

function adopt(idToken: string, nonce: string): void {
  const claims = decodeIdToken(idToken);
  if (!claims || (claims.nonce && claims.nonce !== nonce)) {
    setSnapshot(
      failed("That sign in could not be verified. Please try again."),
    );
    return;
  }

  const email = (
    claims.email ??
    claims.preferred_username ??
    claims.upn ??
    ""
  ).toLowerCase();

  if (!isNusEmail(email)) {
    forgetUser();
    setSnapshot({
      status: "rejected-domain",
      user: null,
      rejectedEmail: email || "that account",
      error: null,
    });
    return;
  }

  const user: NusUser = {
    email,
    name: claims.name ?? email.split("@")[0],
    expiresAt: claims.exp ?? Math.floor(Date.now() / 1000) + 3600,
  };
  storeUser(user);
  setSnapshot({
    status: "signed-in",
    user,
    rejectedEmail: null,
    error: null,
  });
}

async function exchangeCode(code: string, state: string): Promise<void> {
  const pending = takePending();
  cleanUrl();

  if (!pending || pending.state !== state) {
    setSnapshot(
      failed(
        "That sign in did not match the one this tab started. Please try again.",
      ),
    );
    return;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: pending.redirectUri,
        code_verifier: pending.verifier,
        scope: SCOPES,
      }).toString(),
    });
    const payload = (await response.json()) as {
      id_token?: string;
      error_description?: string;
    };

    if (!response.ok || !payload.id_token) {
      setSnapshot(
        failed(
          payload.error_description ??
            "Microsoft turned down that sign in. Please try again.",
        ),
      );
      return;
    }
    adopt(payload.id_token, pending.nonce);

    // Entra always returns to REDIRECT_PATH, so put the person back on the page
    // they were reading when they signed in. This is a real navigation rather
    // than a history rewrite, because the course page has to actually render;
    // the session survives it because adopt() has already written it to
    // localStorage.
    if (pending.returnTo && pending.returnTo !== window.location.pathname) {
      window.location.replace(pending.returnTo);
    }
  } catch {
    setSnapshot(
      failed(
        "Could not reach Microsoft to finish signing in. Check your connection and try again.",
      ),
    );
  }
}

let started = false;

/** Runs once per page load, before anything reads the snapshot as final. */
async function initAuth(): Promise<void> {
  if (started) {
    return;
  }
  started = true;

  if (CLIENT_ID === "") {
    setSnapshot({
      status: "unconfigured",
      user: null,
      rejectedEmail: null,
      error: null,
    });
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error) {
    cleanUrl();
    setSnapshot(failed(params.get("error_description") ?? error));
    return;
  }

  const code = params.get("code");
  const state = params.get("state");
  if (code && state) {
    await exchangeCode(code, state);
    return;
  }

  const stored = readStoredUser();
  setSnapshot(
    stored
      ? { status: "signed-in", user: stored, rejectedEmail: null, error: null }
      : { status: "signed-out", user: null, rejectedEmail: null, error: null },
  );
}

async function beginSignIn(): Promise<void> {
  if (CLIENT_ID === "") {
    return;
  }
  const verifier = randomString(48);
  const pending: PendingSignIn = {
    verifier,
    state: randomString(16),
    nonce: randomString(16),
    redirectUri: redirectUri(),
    returnTo: window.location.pathname,
  };
  writePending(pending);

  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: pending.redirectUri,
    response_mode: "query",
    scope: SCOPES,
    state: pending.state,
    nonce: pending.nonce,
    code_challenge: await challengeFor(verifier),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();

  window.location.assign(url.toString());
}

/* -------------------------------------------------------------------------- */
/* React                                                                       */
/* -------------------------------------------------------------------------- */

export const NusAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const current = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );

  // Only ever kicks off the flow. Everything it learns is published by
  // invalidating the store, never by setting state from inside this effect.
  useEffect(() => {
    void initAuth();
  }, []);

  const signIn = useCallback(() => {
    void beginSignIn();
  }, []);

  const signOut = useCallback(() => {
    forgetUser();
    setSnapshot({
      status: "signed-out",
      user: null,
      rejectedEmail: null,
      error: null,
    });
  }, []);

  const value = useMemo(
    () => ({ ...current, signIn, signOut }),
    [current, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useNusAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useNusAuth must be used inside a NusAuthProvider");
  }
  return ctx;
}
