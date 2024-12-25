import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Audio Transcription Manager'
      },
      auth: {
        login: 'Login',
        logout: 'Logout',
        email: 'Email',
        password: 'Password',
        submit: 'Sign In',
        submitting: 'Signing in...',
        invalidCredentials: 'Invalid email or password'
      },
      transcriptions: {
        title: 'Transcriptions',
        original: 'Original Transcription',
        api: 'API Transcription',
        user: 'User Transcription',
        noData: 'No transcriptions found'
      },
      actions: {
        save: 'Save',
        saving: 'Saving...',
        delete: 'Delete',
        deleting: 'Deleting...',
        retry: 'Retry'
      },
      pagination: {
        previous: 'Previous',
        next: 'Next'
      },
      errors: {
        loading: 'Failed to load transcriptions',
        saving: 'Failed to save changes',
        deleting: 'Failed to delete transcription',
        unexpected: 'An unexpected error occurred'
      },
      dialogs: {
        deleteTitle: 'Confirm Delete',
        deleteMessage: 'Are you sure you want to delete this transcription?',
        cancel: 'Cancel',
        confirm: 'Delete'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n; 