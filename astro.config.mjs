// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  // SSR-режим нужен для админки Keystatic (/keystatic + /api/keystatic).
  // Контентные страницы помечены `export const prerender = true` и отдаются статикой.
  output: 'server',
  adapter: vercel(),
  integrations: [react(), keystatic()],
});
