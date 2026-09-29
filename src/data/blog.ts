/**
 * Blog posts from the current site. Bodies are not migrated yet —
 * `legacyUrl` points to the original article. TODO: migrate content → /[lang]/blog/[slug].
 */
export const POSTS = [
  { slug: 'customer-lifetime-value', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/kak-uvelichit-sovokupnuyu-cennost-klienta' },
  { slug: 'prototypes', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/10-sposobov-sdelat-vashi-prototipi-bolee-poleznymi' },
  { slug: 'captcha-alternatives', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/captcha-alternativyi-dlya-uluchsheniya-konversii' },
  { slug: 'whitespace', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/pochemu-dizajn-sajta-dolzhen-dyshat' },
  { slug: 'online-trust', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/na-kakuyu-gruppu-tovarov-ozhidaetsya-povyishennyij-spros-v-blizhajshem-budushhem' },
  { slug: 'website-planning', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/chto-takoe-proektirovanie-sajta-i-pochemu-ego-nuzhno-delat' },
  { slug: 'ecommerce-cms', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/dvizhok-internet-magazina' },
  { slug: 'online-business', date: '2021-02-06', legacyUrl: 'https://click-it.com.ua/biznes-v-internete' },
  { slug: 'mobile-version', date: '2018-09-02', legacyUrl: 'https://click-it.com.ua/mobilnaya-versiya-sajta-dlya-google-i-yandex/' },
  { slug: 'cs-cart-mobile', date: '2018-07-22', legacyUrl: 'https://click-it.com.ua/sozdanie-mobilnoj-versii-sajta-na-cs-cart/' },
] as const;
