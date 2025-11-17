/**
 * Генератор уникальных ФИО
 */

import { firstNames } from '../data/firstnames';
import { patronymics } from '../data/patronymics';
import { lastNames } from '../data/lastnames';

/**
 * Генерирует уникальное ФИО
 *
 * @param usedNames - Set уже использованных имён
 * @returns Уникальное ФИО в формате "Имя Отчество Фамилия"
 * @throws Error если превышен лимит попыток генерации
 */
export function generateUniqueName(usedNames: Set<string>): string {
  let fullName: string;
  let attempts = 0;
  const maxAttempts = 100000;

  do {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const patronymic = patronymics[Math.floor(Math.random() * patronymics.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    fullName = `${firstName} ${patronymic} ${lastName}`;

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Превышен лимит генерации ФИО. Возможно, все комбинации исчерпаны.');
    }
  } while (usedNames.has(fullName));

  usedNames.add(fullName);
  return fullName;
}

/**
 * Генерирует массив уникальных ФИО
 *
 * @param count - Количество имён
 * @param existingNames - Уже существующие имена (опционально)
 * @returns Массив уникальных ФИО
 */
export function generateMultipleNames(
  count: number,
  existingNames: string[] = []
): string[] {
  const usedNames = new Set<string>(existingNames);
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    names.push(generateUniqueName(usedNames));
  }

  return names;
}

/**
 * Подсчитывает максимально возможное количество уникальных комбинаций ФИО
 *
 * @returns Максимальное количество комбинаций
 */
export function getMaxPossibleNames(): number {
  return firstNames.length * patronymics.length * lastNames.length;
}
