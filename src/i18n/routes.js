// Maps a route key to its path (locale-independent — Astro's i18n routing
// prefixes /en/ automatically via getRelativeLocaleUrl). Same slugs are
// used for both languages to keep this mapping — and the file layout —
// simple: src/pages/about.astro (cs) and src/pages/en/about.astro (en).
export const routes = {
  home: '/',
  about: '/about/',
  services: '/services/',
  faq: '/faq/',
  contact: '/contact/',
};
