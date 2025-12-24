import { getRequestConfig } from 'next-intl/server'
import { routing } from '../navigation'
import en from './messages/en.json'
import zh from './messages/zh.json'

const messages = {
  en,
  zh,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messages[locale as keyof typeof messages] || messages.en,
  }
})
