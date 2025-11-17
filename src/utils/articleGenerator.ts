/**
 * Генератор уникальных артикулов в формате РXX####-РX-####
 */

/**
 * Генерирует случайные буквы (A-Z)
 */
function randLetters(count: number): string {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }
  return result;
}

/**
 * Генерирует случайное число из N цифр
 */
function rand1(): string {
  return String(Math.floor(Math.random() * 10));
}

function rand2(): string {
  return String(Math.floor(10 + Math.random() * 90));
}

function rand3(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

function rand4(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function rand6(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Генерирует уникальный артикул
 *
 * Поддерживает 10 различных форматов:
 * - РXX####-РX-####
 * - РX####-РX-####
 * - РXX####-РXXXX
 * - РXX##-РXX##-####
 * - Р######-Р####
 * - РX#X#X#-РX###
 * - РXX-####-XX-####
 * - Р###X###-Р##X##
 * - РXX####XX-####
 * - Р#X#X#X-Р####
 *
 * @param usedArticles - Set уже использованных артикулов
 * @returns Уникальный артикул
 * @throws Error если превышен лимит попыток генерации
 */
export function generateUniqueArticle(usedArticles: Set<string>): string {
  let article: string;
  let attempts = 0;
  const maxAttempts = 100000;

  do {
    // Выбираем случайный формат из 10 вариантов
    const format = Math.floor(Math.random() * 10);

    switch (format) {
      case 0: // РXX####-РX-####
        article = `Р${randLetters(2)}${rand4()}-Р${randLetters(1)}-${rand4()}`;
        break;
      case 1: // РX####-РX-####
        article = `Р${randLetters(1)}${rand4()}-Р${randLetters(1)}-${rand4()}`;
        break;
      case 2: // РXX####-РXXXX
        article = `Р${randLetters(2)}${rand4()}-Р${randLetters(4)}`;
        break;
      case 3: // РXX##-РXX##-####
        article = `Р${randLetters(2)}${rand2()}-Р${randLetters(2)}${rand2()}-${rand4()}`;
        break;
      case 4: // Р######-Р####
        article = `Р${rand6()}-Р${rand4()}`;
        break;
      case 5: // РX#X#X#-РX###
        article = `Р${randLetters(1)}${rand1()}${randLetters(1)}${rand1()}${randLetters(1)}${rand1()}-Р${randLetters(1)}${rand3()}`;
        break;
      case 6: // РXX-####-XX-####
        article = `Р${randLetters(2)}-${rand4()}-${randLetters(2)}-${rand4()}`;
        break;
      case 7: // Р###X###-Р##X##
        article = `Р${rand3()}${randLetters(1)}${rand3()}-Р${rand2()}${randLetters(1)}${rand2()}`;
        break;
      case 8: // РXX####XX-####
        article = `Р${randLetters(2)}${rand4()}${randLetters(2)}-${rand4()}`;
        break;
      case 9: // Р#X#X#X-Р####
        article = `Р${rand1()}${randLetters(1)}${rand1()}${randLetters(1)}${rand1()}${randLetters(1)}-Р${rand4()}`;
        break;
      default:
        article = `Р${randLetters(2)}${rand4()}-Р${randLetters(1)}-${rand4()}`;
    }

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Превышен лимит генерации артикулов. Возможно, все комбинации исчерпаны.');
    }
  } while (usedArticles.has(article));

  usedArticles.add(article);
  return article;
}

/**
 * Генерирует массив уникальных артикулов
 *
 * @param count - Количество артикулов
 * @param existingArticles - Уже существующие артикулы (опционально)
 * @returns Массив уникальных артикулов
 */
export function generateMultipleArticles(
  count: number,
  existingArticles: string[] = []
): string[] {
  const usedArticles = new Set<string>(existingArticles);
  const articles: string[] = [];

  for (let i = 0; i < count; i++) {
    articles.push(generateUniqueArticle(usedArticles));
  }

  return articles;
}
