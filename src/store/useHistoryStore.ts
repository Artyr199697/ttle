/**
 * Store для управления историей использования заголовков
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TitleHistory, UsedTitle } from '../types';

interface HistoryStore {
  titleHistories: TitleHistory[];

  // Методы для работы с историей
  addUsedTitle: (productId: string, title: string, generationId?: string) => void;
  addUsedTitles: (productId: string, titles: string[], generationId?: string) => void;
  getUsedTitles: (productId: string) => string[];
  getUsedTitlesSet: (productId: string) => Set<string>;
  clearHistory: (productId: string) => void;
  getUsedTitlesCount: (productId: string) => number;
}

/**
 * Store для отслеживания использованных заголовков
 */
export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      titleHistories: [],

      // Добавить один использованный заголовок
      addUsedTitle: (productId, title, generationId) => {
        set((state) => {
          const existingHistory = state.titleHistories.find(
            (h) => h.productId === productId
          );

          const usedTitle: UsedTitle = {
            title,
            usedAt: new Date().toISOString(),
            generationId,
          };

          if (existingHistory) {
            // Обновляем существующую историю
            return {
              titleHistories: state.titleHistories.map((h) =>
                h.productId === productId
                  ? { ...h, usedTitles: [...h.usedTitles, usedTitle] }
                  : h
              ),
            };
          } else {
            // Создаем новую историю
            return {
              titleHistories: [
                ...state.titleHistories,
                {
                  productId,
                  usedTitles: [usedTitle],
                },
              ],
            };
          }
        });
      },

      // Добавить несколько использованных заголовков
      addUsedTitles: (productId, titles, generationId) => {
        set((state) => {
          const existingHistory = state.titleHistories.find(
            (h) => h.productId === productId
          );

          const usedTitles: UsedTitle[] = titles.map((title) => ({
            title,
            usedAt: new Date().toISOString(),
            generationId,
          }));

          if (existingHistory) {
            // Обновляем существующую историю
            return {
              titleHistories: state.titleHistories.map((h) =>
                h.productId === productId
                  ? { ...h, usedTitles: [...h.usedTitles, ...usedTitles] }
                  : h
              ),
            };
          } else {
            // Создаем новую историю
            return {
              titleHistories: [
                ...state.titleHistories,
                {
                  productId,
                  usedTitles,
                },
              ],
            };
          }
        });
      },

      // Получить список использованных заголовков
      getUsedTitles: (productId) => {
        const history = get().titleHistories.find((h) => h.productId === productId);
        return history ? history.usedTitles.map((ut) => ut.title) : [];
      },

      // Получить Set использованных заголовков (для быстрой проверки)
      getUsedTitlesSet: (productId) => {
        const history = get().titleHistories.find((h) => h.productId === productId);
        return history
          ? new Set(history.usedTitles.map((ut) => ut.title))
          : new Set();
      },

      // Очистить историю для товара
      clearHistory: (productId) => {
        set((state) => ({
          titleHistories: state.titleHistories.filter(
            (h) => h.productId !== productId
          ),
        }));
      },

      // Получить количество использованных заголовков
      getUsedTitlesCount: (productId) => {
        const history = get().titleHistories.find((h) => h.productId === productId);
        return history ? history.usedTitles.length : 0;
      },
    }),
    {
      name: 'avito-master-history',
    }
  )
);
