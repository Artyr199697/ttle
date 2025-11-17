/**
 * Store для управления генерацией объявлений
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeneratedAd, GenerationHistory } from '../types';

interface GenerationStore {
  generatedAds: GeneratedAd[];
  generationHistories: GenerationHistory[];
  currentGeneration: GeneratedAd[] | null;

  // Методы для работы с генерацией
  addGeneratedAds: (ads: GeneratedAd[]) => void;
  clearGeneratedAds: () => void;
  setCurrentGeneration: (ads: GeneratedAd[] | null) => void;
  markAdAsUsed: (id: string) => void;

  // История генераций
  addGenerationHistory: (history: GenerationHistory) => void;
  getProductGenerations: (productId: string) => GenerationHistory[];
  getLastGeneration: (productId: string) => GenerationHistory | null;
  getTotalGenerated: (productId: string) => number;

  // Получение объявлений
  getAdsByProduct: (productId: string) => GeneratedAd[];
  getUnusedAds: (productId: string) => GeneratedAd[];
}

/**
 * Store для работы с генерацией объявлений
 */
export const useGenerationStore = create<GenerationStore>()(
  persist(
    (set, get) => ({
      generatedAds: [],
      generationHistories: [],
      currentGeneration: null,

      // Добавить сгенерированные объявления
      addGeneratedAds: (ads) => {
        set((state) => ({
          generatedAds: [...state.generatedAds, ...ads],
        }));
      },

      // Очистить сгенерированные объявления
      clearGeneratedAds: () => {
        set({ generatedAds: [], currentGeneration: null });
      },

      // Установить текущую генерацию
      setCurrentGeneration: (ads) => {
        set({ currentGeneration: ads });
      },

      // Отметить объявление как использованное
      markAdAsUsed: (id) => {
        set((state) => ({
          generatedAds: state.generatedAds.map((ad) =>
            ad.id === id ? { ...ad, used: true } : ad
          ),
          currentGeneration: state.currentGeneration
            ? state.currentGeneration.map((ad) =>
                ad.id === id ? { ...ad, used: true } : ad
              )
            : null,
        }));
      },

      // Добавить запись в историю генераций
      addGenerationHistory: (history) => {
        set((state) => ({
          generationHistories: [...state.generationHistories, history],
        }));
      },

      // Получить все генерации для товара
      getProductGenerations: (productId) => {
        return get()
          .generationHistories.filter((h) => h.productId === productId)
          .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
      },

      // Получить последнюю генерацию для товара
      getLastGeneration: (productId) => {
        const generations = get().getProductGenerations(productId);
        return generations.length > 0 ? generations[0] : null;
      },

      // Получить общее количество сгенерированных объявлений для товара
      getTotalGenerated: (productId) => {
        return get()
          .generationHistories.filter((h) => h.productId === productId)
          .reduce((sum, h) => sum + h.count, 0);
      },

      // Получить объявления по ID товара
      getAdsByProduct: (productId) => {
        return get().generatedAds.filter((ad) => ad.productId === productId);
      },

      // Получить неиспользованные объявления
      getUnusedAds: (productId) => {
        return get()
          .generatedAds.filter((ad) => ad.productId === productId && !ad.used);
      },
    }),
    {
      name: 'avito-master-generation',
    }
  )
);
