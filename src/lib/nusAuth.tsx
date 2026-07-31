"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Google sign in, restricted to NUS accounts.
 *
 * This runs entirely in the browser using Google Identity Services, because the
 * site is a static export with no server (see src/lib/moduleReviews.ts).
 *
 * IMPORTANT, and worth reading before trusting this for anything sensitive:
 * a client side check is a user interface gate, not a security boundary. The ID
 * token is decoded here without verifying Google's signature, and a determined
 * person can put whatever they like into their own browser storage. That is an
 * acceptable trade for gating a review form on a static site, where there is no
 * server and nothing secret to protect. The moment reviews are persisted to a
 * real backend, that backend must verify the ID token server side against
 * Google's public keys and re-check the email domain. Do not skip that step.
 */

/** Domains accepted as proof of being an NUS student or staff member. */
export const NUS_EMAIL_DOMAINS = ["u.nus.edu", "nus.edu.sg"];

const STORAGE_KEY = "descholars.nusSession.v1";
const GSI_SRC = "https://accounts.google.com/gsi/client";

export interface NusUser {
  email: string;
  name: string;
  picture: string;
  /** Seconds since epoch, from the token's `exp` claim. */
  expiresAt: number;
}

export type AuthStatus =
  | "loading"
  | "unconfigured"
  | "signed-out"
  | "signed-in"
  | "rejected-domain";

interface AuthContextValue {
  status: AuthStatus;
  user: NusUser | null;
  /** Set when a non NUS account was used, so the UI can explain the rejection. */
  rejectedEmail: string | null;
  signOut: () => void;
  /** Attach the official Google button to a container element. */
  renderSignInButton: (el: HTMLElement | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
        auto_select?: boolean;
        hd?: string;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: Record<string, string | number>,
      ) => void;
      disableAutoSelect: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

interface GoogleIdTokenPayload {
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
  exp?: number;
}

/** Decode a JWT payload. Does not verify the signature, see the note above. */
function decodeIdToken(token: string): GoogleIdTokenPayload | null {
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
    return JSON.parse(json) as GoogleIdTokenPayload;
  } catch {
    return null;
  }
}

export function isNusEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return NUS_EMAIL_DOMAINS.some((domain) => lower.endsWith("@" + domain));
}

function readStoredUser(): NusUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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

export const NusAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const [user, setUser] = useState<NusUser | null>(null);
  const [rejectedEmail, setRejectedEmail] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const initialised = useRef(false);

  const handleCredential = useCallback((response: GoogleCredentialResponse) => {
    const payload = response.credential
      ? decodeIdToken(response.credential)
      : null;
    const email = payload?.email ?? "";
    const verified =
      payload?.email_verified === true || payload?.email_verified === "true";

    if (!email || !verified || !isNusEmail(email)) {
      setRejectedEmail(email || "unknown account");
      setUser(null);
      return;
    }

    const next: NusUser = {
      email,
      name: payload?.name ?? email.split("@")[0],
      picture: payload?.picture ?? "",
      expiresAt: payload?.exp ?? Math.floor(Date.now() / 1000) + 3600,
    };
    setRejectedEmail(null);
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Non fatal, the session just will not survive a reload.
    }
  }, []);

  // Restore any existing session before deciding what to render.
  useEffect(() => {
    setUser(readStoredUser());
    setHydrated(true);
  }, []);

  // Load the Google Identity Services script once, and only if configured.
  useEffect(() => {
    if (clientId === "" || typeof window === "undefined") {
      return;
    }
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GSI_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => setScriptReady(true));
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!scriptReady || initialised.current || clientId === "") {
      return;
    }
    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      auto_select: false,
      // A hint for the account chooser only. The real check is in handleCredential.
      hd: NUS_EMAIL_DOMAINS[0],
    });
    initialised.current = true;
  }, [scriptReady, clientId, handleCredential]);

  const renderSignInButton = useCallback(
    (el: HTMLElement | null) => {
      if (!el || !scriptReady || !initialised.current) {
        return;
      }
      el.replaceChildren();
      window.google?.accounts.id.renderButton(el, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
      });
    },
    [scriptReady],
  );

  const signOut = useCallback(() => {
    window.google?.accounts.id.disableAutoSelect();
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore, clearing state below is what matters.
    }
    setUser(null);
    setRejectedEmail(null);
  }, []);

  const status: AuthStatus = useMemo(() => {
    if (clientId === "") {
      return "unconfigured";
    }
    if (!hydrated) {
      return "loading";
    }
    if (user) {
      return "signed-in";
    }
    if (rejectedEmail) {
      return "rejected-domain";
    }
    return "signed-out";
  }, [clientId, hydrated, user, rejectedEmail]);

  const value = useMemo(
    () => ({ status, user, rejectedEmail, signOut, renderSignInButton }),
    [status, user, rejectedEmail, signOut, renderSignInButton],
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
