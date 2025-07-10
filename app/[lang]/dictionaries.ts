import 'server-only'
 
const dictionaries = {
  en: () => import('@/locales/messages/dictionnaries/en.json').then((module) => module.default),
  fr: () => import('@/locales/messages/dictionnaries/fr.json').then((module) => module.default),
}
 
export const getDictionary = async (locale: 'en' | 'fr') =>
  dictionaries[locale]()