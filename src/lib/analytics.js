// src/lib/analytics.js
//
// Wrapper fino sobre o PostHog. Fica em no-op silencioso se
// VITE_POSTHOG_KEY não estiver configurada (ex.: ambiente local sem conta
// criada ainda), para nunca quebrar build/dev por falta da chave.
//
// posthog-js é carregado via import() dinâmico (não no bundle principal):
// é uma lib de ~230kB que não faz parte do caminho crítico de renderização.
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let posthogPromise = null;

function getPosthog() {
  if (!POSTHOG_KEY) return null;
  if (!posthogPromise) {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // rastreamos manualmente por rota (SPA)
        capture_pageleave: true,
        person_profiles: 'identified_only',
      });
      return posthog;
    });
  }
  return posthogPromise;
}

export function initAnalytics() {
  getPosthog();
}

export function trackPageview(pathname) {
  getPosthog()?.then((posthog) =>
    posthog.capture('$pageview', { $current_url: window.location.origin + pathname }),
  );
}

export function trackEvent(eventName, properties) {
  getPosthog()?.then((posthog) => posthog.capture(eventName, properties));
}

export function identifyUser(userId, traits) {
  if (!userId) return;
  getPosthog()?.then((posthog) => posthog.identify(userId, traits));
}

export function resetAnalytics() {
  getPosthog()?.then((posthog) => posthog.reset());
}
