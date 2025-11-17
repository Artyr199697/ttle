/**
 * Основные типы данных приложения Avito Master PRO
 */

/**
 * Блок описания товара
 */
export interface DescriptionBlock {
  id: string;
  name: string;                    // Название блока: "Вступление", "Основные фичи"
  type: 'spintax' | 'static';      // Тип: спинтакс или статичный текст
  content: string;                 // Содержимое блока
  enabled: boolean;                // Включен ли блок в генерацию
  order: number;                   // Порядок в финальном описании
}

/**
 * Товар
 */
export interface Product {
  id: string;
  name: string;                    // Название товара
  category: string;                // Категория товара

  // TITLE спинтакс
  titleSpintax: string;            // Спинтакс для заголовка

  // DESCRIPTION блоки с спинтаксом
  descriptionBlocks: DescriptionBlock[];

  // Метаданные
  createdAt: string;               // ISO дата создания
  updatedAt: string;               // ISO дата обновления

  // Опционально
  price?: number;                  // Цена товара
  priceVariation?: boolean;        // Варьировать цену или нет
  tags?: string[];                 // Теги для фильтрации
}

/**
 * Использованный заголовок
 */
export interface UsedTitle {
  title: string;                   // Текст заголовка
  usedAt: string;                  // ISO дата использования
  generationId?: string;           // ID генерации (опционально)
}

/**
 * История использования заголовков
 */
export interface TitleHistory {
  productId: string;
  usedTitles: UsedTitle[];
}

/**
 * Сгенерированное объявление
 */
export interface GeneratedAd {
  id: string;
  productId: string;
  title: string;                   // Финальный заголовок
  description: string;             // Финальное описание
  article: string;                 // Уникальный артикул
  manager: string;                 // Уникальное ФИО менеджера
  price?: number;                  // Цена (опционально)
  generatedAt: string;             // ISO дата генерации
  used: boolean;                   // Опубликовано или нет
}

/**
 * История генераций
 */
export interface GenerationHistory {
  id: string;
  productId: string;
  generatedAt: string;
  count: number;                   // Количество сгенерированных объявлений
  titlesUsed: string[];           // Использованные заголовки
}

/**
 * Статистика товара
 */
export interface ProductStats {
  totalTitleCombinations: number;      // Всего возможных заголовков
  usedTitles: number;                  // Использовано заголовков
  availableTitles: number;             // Доступно заголовков
  totalDescriptionCombinations: number; // Всего возможных описаний
  lastGenerated: string | null;        // Дата последней генерации
  totalGenerated: number;              // Всего сгенерировано объявлений
}

/**
 * Настройки приложения
 */
export interface AppSettings {
  defaultTitleLength: { min: number; max: number };  // Длина заголовка по умолчанию
  descriptionSeparator: string;                       // Разделитель описаний
  autoMarkAsUsed: boolean;                           // Автоматически отмечать как использованные
  confirmBeforeDelete: boolean;                      // Подтверждение перед удалением
  theme: 'light' | 'dark';                           // Тема оформления
}

/**
 * Режим работы с генератором
 */
export type GenerationMode = 'title' | 'description' | 'mass';

/**
 * Настройки массовой генерации
 */
export interface MassGenerationSettings {
  productId: string;
  count: number;                   // Количество объявлений
  markAsUsed: boolean;            // Отметить заголовки как использованные
  generateArticles: boolean;      // Генерировать артикулы
  generateManagers: boolean;      // Генерировать ФИО
  varyPrice: boolean;             // Варьировать цену
}
