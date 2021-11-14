import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { produce } from 'immer'

import { en } from './resources/en'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources: Resource = {
  en: {
    translation: en,
  },
}

// Used to check for missing keys in dev consolse
;(window as any).missingTranslations = {}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    saveMissing: true,
    missingKeyHandler: (lngs,
      ns,
      key,
      fallbackValue) => {
      (window as any).missingTranslations = produce<{}, any>((window as any).missingTranslations, (draftState) => {
        draftState[`${key}`] = fallbackValue

      })
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    appendNamespaceToMissingKey: true,
  })

export { i18n }
