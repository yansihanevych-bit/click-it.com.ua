import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import '@fontsource-variable/manrope/wght.css';
import './styles/global.css';
import App from './App';
import { createI18n, loadLocale } from './i18n';
import { DEFAULT_LANG, getLanguage, isLang } from './config/languages';

const i18n = createI18n();
const seg = window.location.pathname.split('/')[1];
const lang = isLang(seg) ? seg : DEFAULT_LANG;

loadLocale(i18n, getLanguage(lang).locale).then(() => {
  const root = document.getElementById('root')!;
  const app = (
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </StrictMode>
  );
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
});
