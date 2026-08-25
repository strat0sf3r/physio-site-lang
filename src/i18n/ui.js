// Static interface strings — navigation, footer, generic labels. Page
// content itself (headlines, body copy) lives in src/data/*.json instead.
export const locales = ['cs', 'en'];
export const defaultLocale = 'cs';

export const ui = {
  cs: {
    nav: {
      home: 'Domů',
      about: 'O nás',
      services: 'Služby',
      faq: 'Časté dotazy',
      contact: 'Kontakt',
    },
    menu: 'Menu',
    call: 'Zavolat',
    footer: {
      contact: 'Kontakt',
      hours: 'Otevírací doba',
      rights: 'Všechna práva vyhrazena.',
    },
    langSwitch: 'EN',
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      faq: 'FAQ',
      contact: 'Contact',
    },
    menu: 'Menu',
    call: 'Call',
    footer: {
      contact: 'Contact',
      hours: 'Hours',
      rights: 'All rights reserved.',
    },
    langSwitch: 'CS',
  },
};

/** @typedef {'cs' | 'en'} Locale */

/** @param {Locale} lang */
export function t(lang) {
  return ui[lang];
}
