/**
 * Store для управления товарами
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;

  // CRUD операции
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  setCurrentProduct: (product: Product | null) => void;

  // Утилиты
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

/**
 * Основной store для работы с товарами
 */
export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      currentProduct: null,

      // Добавить новый товар
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
        }));
      },

      // Обновить товар
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          ),
          currentProduct:
            state.currentProduct?.id === id
              ? { ...state.currentProduct, ...updates, updatedAt: new Date().toISOString() }
              : state.currentProduct,
        }));
      },

      // Удалить товар
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        }));
      },

      // Получить товар по ID
      getProduct: (id) => {
        return get().products.find((product) => product.id === id);
      },

      // Установить текущий товар
      setCurrentProduct: (product) => {
        set({ currentProduct: product });
      },

      // Получить товары по категории
      getProductsByCategory: (category) => {
        return get().products.filter((product) => product.category === category);
      },

      // Поиск товаров
      searchProducts: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery) ||
            product.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: 'avito-master-products',
    }
  )
);
