/*
 * Перевод панели администратора (русская сборка).
 *
 * Панель администратора написана с английскими текстами прямо в разметке и лежит вне
 * маршрута с языком, поэтому для неё нет next-intl. Здесь перевод выполняется точным
 * совпадением строк по словарю ru.json и по правилам со вставкой значений.
 * Язык берётся из атрибута lang корневого элемента (его задаёт общий механизм языков).
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ru from './ru.json';
import { ADMIN_PATTERNS_RU } from './patterns.ru';

const DICTIONARY: Readonly<Record<string, string>> = ru;

export function normalizeAdminText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Возвращает перевод строки или null, если подходящего нет. */
export function translateAdminText(text: string): string | null {
  const key = normalizeAdminText(text);
  if (!key) return null;
  const direct = DICTIONARY[key];
  if (direct !== undefined) return direct;
  for (const [pattern, replacement] of ADMIN_PATTERNS_RU) {
    if (pattern.test(key)) return key.replace(pattern, replacement);
  }
  return null;
}

/** Переводит строку, сохраняя пробелы по краям; без перевода возвращает исходную. */
export function translateAdminTextPreserving(text: string): string {
  const translated = translateAdminText(text);
  if (translated === null) return text;
  const leading = /^\s*/.exec(text)?.[0] ?? '';
  const trailing = /\s*$/.exec(text)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

export function isAdminRussian(): boolean {
  if (typeof document === 'undefined') return false;
  return (document.documentElement.lang || '').toLowerCase().startsWith('ru');
}
