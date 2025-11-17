/**
 * Список товаров на главной странице
 */

import React from 'react';
import { Plus, Package, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { countCombinations } from '../../utils/spintax';
import { Button } from '../Common/Button';
import { Product } from '../../types';

interface ProductListProps {
  onSelectProduct: (product: Product) => void;
  onCreateProduct: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  onSelectProduct,
  onCreateProduct,
}) => {
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const getUsedTitlesCount = useHistoryStore((state) => state.getUsedTitlesCount);

  const handleDelete = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (confirm('Удалить этот товар?')) {
      deleteProduct(productId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Заголовок */}
      <div className="mb-6">
        <Button
          variant="primary"
          icon={<Plus size={20} />}
          onClick={onCreateProduct}
        >
          Добавить товар
        </Button>
      </div>

      {/* Список товаров */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет товаров
          </h3>
          <p className="text-gray-600 mb-4">
            Создайте первый товар для начала работы
          </p>
          <Button variant="primary" onClick={onCreateProduct}>
            Создать товар
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => {
            const totalCombinations = product.titleSpintax
              ? countCombinations(product.titleSpintax)
              : 0;
            const usedCount = getUsedTitlesCount(product.id);
            const availableCount = totalCombinations - usedCount;

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-primary transition-all cursor-pointer p-6"
                onClick={() => onSelectProduct(product)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-2 rounded-lg">
                      <Package size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, product.id)}
                      className="p-2 text-gray-600 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {totalCombinations.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Всего</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {usedCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Использовано</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {availableCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Доступно</div>
                  </div>
                </div>

                {/* Кнопка генерации */}
                <div className="mt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={<TrendingUp size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                  >
                    Генерировать объявления
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
