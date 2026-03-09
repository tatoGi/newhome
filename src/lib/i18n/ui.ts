import en from './en.json';
import ka from './ka.json';

const dictionaries: Record<string, Record<string, string>> = {
  en,
  ka,
};

export const getUiText = (locale: string | null | undefined, key: string): string => {
  const normalizedLocale = String(locale || 'ka').toLowerCase();
  const dictionary = dictionaries[normalizedLocale] ?? dictionaries.ka;

  return dictionary[key] ?? dictionaries.en[key] ?? key;
};
