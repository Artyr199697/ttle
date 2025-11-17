/**
 * Утилиты для экспорта данных
 */

import { GeneratedAd } from '../types';

/**
 * ВАЖНО: Разделитель для описаний - 3 пустые строки
 */
const DESCRIPTION_SEPARATOR = '\n\n\n\n';

/**
 * Экспортирует объявления в формат TXT
 *
 * Формат:
 * Заголовок
 * [пустая строка]
 * Описание
 * [3 пустые строки]
 * Заголовок
 * ...
 *
 * @param ads - Массив объявлений
 * @returns Строка в формате TXT
 */
export function exportToTxt(ads: GeneratedAd[]): string {
  const blocks = ads.map(ad => {
    return `${ad.title}

${ad.description}`;
  });

  // Соединяем через 3 пустые строки
  return blocks.join(DESCRIPTION_SEPARATOR);
}

/**
 * Экспортирует объявления в формат CSV
 *
 * Формат:
 * Title,Description,Article,Manager,Price
 * "...","...","...","...",123
 *
 * @param ads - Массив объявлений
 * @returns Строка в формате CSV
 */
export function exportToCsv(ads: GeneratedAd[]): string {
  const headers = 'Title,Description,Article,Manager,Price\n';

  const rows = ads.map(ad => {
    // Экранируем кавычки и переносы строк
    const title = `"${ad.title.replace(/"/g, '""')}"`;
    const description = `"${ad.description.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    const article = `"${ad.article}"`;
    const manager = `"${ad.manager}"`;
    const price = ad.price || '';

    return `${title},${description},${article},${manager},${price}`;
  }).join('\n');

  return headers + rows;
}

/**
 * Экспортирует объявления в формат JSON
 *
 * @param ads - Массив объявлений
 * @returns Строка в формате JSON
 */
export function exportToJson(ads: GeneratedAd[]): string {
  return JSON.stringify(ads, null, 2);
}

/**
 * Скачивает файл в браузере
 *
 * @param content - Содержимое файла
 * @param filename - Имя файла
 * @param mimeType - MIME тип файла
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Экспортирует объявления в TXT и скачивает файл
 *
 * @param ads - Массив объявлений
 * @param filename - Имя файла (по умолчанию: ads-YYYY-MM-DD.txt)
 */
export function downloadAsTxt(ads: GeneratedAd[], filename?: string): void {
  const content = exportToTxt(ads);
  const date = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `ads-${date}.txt`;
  downloadFile(content, finalFilename, 'text/plain');
}

/**
 * Экспортирует объявления в CSV и скачивает файл
 *
 * @param ads - Массив объявлений
 * @param filename - Имя файла (по умолчанию: ads-YYYY-MM-DD.csv)
 */
export function downloadAsCsv(ads: GeneratedAd[], filename?: string): void {
  const content = exportToCsv(ads);
  const date = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `ads-${date}.csv`;
  downloadFile(content, finalFilename, 'text/csv');
}

/**
 * Экспортирует объявления в JSON и скачивает файл
 *
 * @param ads - Массив объявлений
 * @param filename - Имя файла (по умолчанию: ads-YYYY-MM-DD.json)
 */
export function downloadAsJson(ads: GeneratedAd[], filename?: string): void {
  const content = exportToJson(ads);
  const date = new Date().toISOString().split('T')[0];
  const finalFilename = filename || `ads-${date}.json`;
  downloadFile(content, finalFilename, 'application/json');
}

/**
 * Копирует текст в буфер обмена
 *
 * @param text - Текст для копирования
 * @returns Promise<boolean> - true если успешно
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
