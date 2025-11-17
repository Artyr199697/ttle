/**
 * Утилиты для работы со спинтаксом
 */

/**
 * Генерирует все возможные комбинации из спинтакса
 *
 * @param spintax - Строка в формате {вариант1|вариант2|вариант3}
 * @returns Массив всех возможных комбинаций
 *
 * @example
 * getAllCombinations("{Hello|Hi} {world|there}")
 * // => ["Hello world", "Hello there", "Hi world", "Hi there"]
 */
export function getAllCombinations(spintax: string): string[] {
  // Нормализация: добавляем пробелы между блоками
  const normalized = spintax.replace(/\}\{/g, '} {');

  // Извлекаем группы {вариант1|вариант2|...}
  const groups: string[][] = [];
  const regex = /\{([^{}]+)\}/g;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    const variants = match[1]
      .split('|')
      .map(v => v.trim())
      .filter(v => v.length > 0);
    if (variants.length > 0) {
      groups.push(variants);
    }
  }

  // Если нет групп спинтакса, возвращаем исходную строку
  if (groups.length === 0) {
    return [spintax];
  }

  // Извлекаем статичные части
  const parts = normalized.split(/\{[^{}]+\}/);

  /**
   * Рекурсивная генерация всех комбинаций
   */
  function generate(groupIndex: number, current: string[]): string[] {
    if (groupIndex === groups.length) {
      let result = '';
      for (let i = 0; i < parts.length; i++) {
        result += parts[i];
        if (i < current.length) {
          result += current[i];
        }
      }
      return [result.replace(/\s+/g, ' ').trim()];
    }

    const results: string[] = [];
    for (const variant of groups[groupIndex]) {
      const combinations = generate(groupIndex + 1, [...current, variant]);
      results.push(...combinations);
    }
    return results;
  }

  return generate(0, []);
}

/**
 * Генерирует одну случайную комбинацию из спинтакса
 *
 * @param spintax - Строка в формате {вариант1|вариант2|вариант3}
 * @returns Случайная комбинация
 */
export function getRandomCombination(spintax: string): string {
  const normalized = spintax.replace(/\}\{/g, '} {');

  let result = normalized;
  const regex = /\{([^{}]+)\}/g;

  result = result.replace(regex, (_match, group) => {
    const variants = group
      .split('|')
      .map((v: string) => v.trim())
      .filter((v: string) => v.length > 0);

    if (variants.length === 0) return '';

    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  });

  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Фильтрует комбинации по длине
 *
 * @param combinations - Массив комбинаций
 * @param minLength - Минимальная длина
 * @param maxLength - Максимальная длина
 * @returns Отфильтрованный массив
 */
export function filterByLength(
  combinations: string[],
  minLength: number = 20,
  maxLength: number = 50
): string[] {
  return combinations.filter(c =>
    c.length >= minLength && c.length <= maxLength
  );
}

/**
 * Удаляет дубликаты из массива комбинаций
 *
 * @param combinations - Массив комбинаций
 * @returns Массив без дубликатов
 */
export function removeDuplicates(combinations: string[]): string[] {
  return [...new Set(combinations)];
}

/**
 * Подсчитывает количество возможных комбинаций в спинтаксе
 *
 * @param spintax - Строка в формате {вариант1|вариант2|вариант3}
 * @returns Количество возможных комбинаций
 */
export function countCombinations(spintax: string): number {
  const normalized = spintax.replace(/\}\{/g, '} {');
  const regex = /\{([^{}]+)\}/g;
  let match;
  let count = 1;

  while ((match = regex.exec(normalized)) !== null) {
    const variants = match[1]
      .split('|')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    if (variants.length > 0) {
      count *= variants.length;
    }
  }

  return count;
}

/**
 * Проверяет, является ли строка валидным спинтаксом
 *
 * @param spintax - Строка для проверки
 * @returns true если валидный спинтакс
 */
export function isValidSpintax(spintax: string): boolean {
  // Проверяем парность скобок
  let openBraces = 0;
  for (const char of spintax) {
    if (char === '{') openBraces++;
    if (char === '}') openBraces--;
    if (openBraces < 0) return false;
  }

  return openBraces === 0;
}

/**
 * Генерирует N случайных уникальных комбинаций
 *
 * @param spintax - Строка в формате {вариант1|вариант2|вариант3}
 * @param count - Количество комбинаций
 * @param usedTitles - Уже использованные заголовки (исключаются)
 * @returns Массив уникальных комбинаций
 */
export function generateUniqueCombinations(
  spintax: string,
  count: number,
  usedTitles: Set<string> = new Set()
): string[] {
  const allCombinations = getAllCombinations(spintax);
  const availableCombinations = allCombinations.filter(c => !usedTitles.has(c));

  // Перемешиваем массив
  const shuffled = availableCombinations.sort(() => Math.random() - 0.5);

  // Берем первые N элементов
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
