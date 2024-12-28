import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        auth: {
          login: 'Sign in',
          email: 'Email',
          password: 'Password',
          submit: 'Sign in',
          submitting: 'Signing in...',
          invalidCredentials: 'Invalid email or password'
        }
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n; 