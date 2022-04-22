/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import i18next, { StringMap, TOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { isDev } from './utils'

export const languages = {
  en: 'English',
  pl: 'Polski',
} as const

interface Namespaces {
  //@ts-ignore
  global: typeof import('../public/locales/en/global.json')
  //@ts-ignore
  common: typeof import('../public/locales/en/common.json')
  //@ts-ignore
  error: typeof import('../public/locales/en/error.json')
  //@ts-ignore
  map: typeof import('../public/locales/en/map.json')
  //@ts-ignore
  menu: typeof import('../public/locales/en/menu.json')
}

const nsMap: { [key in keyof Namespaces]: boolean } = {
  global: true,
  common: true,
  error: true,
  map: true,
  menu: true,
}

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`

type DeepKeyOf<T> = (
  [T] extends [never]
    ? ''
    : T extends object
    ? {
        [K in Exclude<keyof T, symbol>]: `${K}${undefined extends T[K]
          ? '?'
          : ''}${DotPrefix<DeepKeyOf<T[K]>>}`
      }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string | number>
  : never

type GetValues<T> = T extends Record<string, infer V> ? V : never

export type TranslationKey =
  | GetValues<{
      [key in keyof Namespaces]: `${key}:${DeepKeyOf<Namespaces[key]>}`
    }>
  | DeepKeyOf<Namespaces['global']>

declare module 'react-i18next' {
  function i18nTranslation(
    key: TranslationKey,
    options?: string | TOptions<StringMap> | undefined,
  ): string

  export function useTranslation<
    N extends Namespace<string> = 'global',
    TKPrefix extends KeyPrefix<N> = undefined,
  >(
    ns?: N | Readonly<N> | undefined,
    options?: UseTranslationOptions<TKPrefix> | undefined,
  ): [typeof i18nTranslation, typeof i18next, boolean]
}

const i18n = i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: isDev(),
    defaultNS: 'global',
    ns: Object.keys(nsMap),
    supportedLngs: Object.keys(languages),
    detection: {
      lookupQuerystring: 'lang', //eg.: http://localhost:3000/?lang=pl-PL
    },
  })

export default i18n
