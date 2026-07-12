'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './createEmotionCache';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [emotionCache] = React.useState(() => createEmotionCache());
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}