import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './i18n/en.json';  // Adjust these paths if necessary
import fr from './i18n/fr.json';
import es from './i18n/es.json';
import de from './i18n/de.json';
import nl from './i18n/nl.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
      nl: { translation: nl }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
