/**
 * Главный компонент приложения Avito Master PRO
 */

import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { ProductList } from './components/Product/ProductList';
import { ProductEditor } from './components/Product/ProductEditor';
import { Product } from './types';

type View = 'list' | 'editor' | 'create';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('editor');
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setCurrentView('create');
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        title={currentView === 'list' ? 'Avito Master PRO' : selectedProduct?.name || 'Новый товар'}
        subtitle={currentView === 'list' ? 'Система управления объявлениями на Avito' : undefined}
        showBack={currentView !== 'list'}
        onBack={currentView !== 'list' ? handleBack : undefined}
      />

      {/* Main Content */}
      <main>
        {currentView === 'list' && (
          <ProductList
            onSelectProduct={handleSelectProduct}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {(currentView === 'editor' || currentView === 'create') && (
          <ProductEditor
            product={selectedProduct}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            Avito Master PRO v1.0 | Создано для профессиональной работы с объявлениями
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
