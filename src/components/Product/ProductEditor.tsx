/**
 * Редактор товара с табами
 */

import React, { useState, useEffect } from 'react';
import { FileText, FileSignature, Rocket, Save, Sparkles } from 'lucide-react';
import { Product, DescriptionBlock, GeneratedAd } from '../../types';
import { useProductStore } from '../../store/useProductStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { TabNavigation } from '../Layout/TabNavigation';
import { Button } from '../Common/Button';
import { Input, TextArea } from '../Common/Input';
import { CopyButton } from '../Common/CopyButton';
import { Modal, ModalFooter } from '../Common/Modal';
import { PROMPTS, fillPrompt } from '../../data/prompts';
import { getAllCombinations, countCombinations, generateUniqueCombinations } from '../../utils/spintax';
import { generateUniqueArticle } from '../../utils/articleGenerator';
import { generateUniqueName } from '../../utils/nameGenerator';
import { downloadAsTxt, downloadAsCsv } from '../../utils/export';

interface ProductEditorProps {
  product: Product | null;
  onBack: () => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState('title');
  const [editedProduct, setEditedProduct] = useState<Product | null>(product);
  const [titlePreview, setTitlePreview] = useState<string[]>([]);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(50);

  const updateProduct = useProductStore((state) => state.updateProduct);
  const addProduct = useProductStore((state) => state.addProduct);
  const getUsedTitlesSet = useHistoryStore((state) => state.getUsedTitlesSet);
  const addUsedTitles = useHistoryStore((state) => state.addUsedTitles);

  useEffect(() => {
    if (editedProduct?.titleSpintax) {
      const combinations = getAllCombinations(editedProduct.titleSpintax);
      setTitlePreview(combinations.slice(0, 5));
    }
  }, [editedProduct?.titleSpintax]);

  const handleSave = () => {
    if (!editedProduct) return;

    if (product) {
      updateProduct(product.id, editedProduct);
    } else {
      const newProduct: Product = {
        ...editedProduct,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProduct(newProduct);
    }
    onBack();
  };

  const handleGenerate = () => {
    if (!editedProduct || !editedProduct.titleSpintax) return;

    const usedTitles = getUsedTitlesSet(editedProduct.id);
    const titles = generateUniqueCombinations(editedProduct.titleSpintax, generationCount, usedTitles);

    const usedArticles = new Set<string>();
    const usedNames = new Set<string>();

    const ads: GeneratedAd[] = titles.map((title) => {
      // Генерация описания из блоков
      const description = editedProduct.descriptionBlocks
        .filter((block) => block.enabled)
        .sort((a, b) => a.order - b.order)
        .map((block) => {
          if (block.type === 'spintax') {
            const combinations = getAllCombinations(block.content);
            return combinations[Math.floor(Math.random() * combinations.length)];
          }
          return block.content;
        })
        .join('\n\n');

      return {
        id: Date.now().toString() + Math.random(),
        productId: editedProduct.id,
        title,
        description,
        article: generateUniqueArticle(usedArticles),
        manager: generateUniqueName(usedNames),
        price: editedProduct.price,
        generatedAt: new Date().toISOString(),
        used: false,
      };
    });

    setGeneratedAds(ads);
    addUsedTitles(editedProduct.id, titles);
    setShowExportModal(true);
  };

  const tabs = [
    { id: 'title', label: 'Заголовок', icon: <FileText size={18} /> },
    { id: 'description', label: 'Описание', icon: <FileSignature size={18} /> },
    { id: 'generation', label: 'Генерация', icon: <Rocket size={18} /> },
  ];

  if (!editedProduct) {
    const newProduct: Product = {
      id: '',
      name: '',
      category: '',
      titleSpintax: '',
      descriptionBlocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditedProduct(newProduct);
    return null;
  }

  const titlePrompt = fillPrompt(PROMPTS.title, { PRODUCT_NAME: editedProduct.name });
  const totalCombinations = editedProduct.titleSpintax ? countCombinations(editedProduct.titleSpintax) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Основная информация */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Название товара"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                placeholder="ChatGPT Plus"
                fullWidth
              />
              <Input
                label="Категория"
                value={editedProduct.category}
                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                placeholder="Цифровые товары"
                fullWidth
              />
            </div>
          </div>

          {/* Табы */}
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Контент табов */}
          <div className="p-6">
            {/* TAB: Заголовок */}
            {activeTab === 'title' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Готовый промт для Claude:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{titlePrompt}</pre>
                  </div>
                  <div className="mt-2">
                    <CopyButton text={titlePrompt} label="Скопировать промт" />
                  </div>
                </div>

                <TextArea
                  label="Вставь спинтакс от Claude:"
                  value={editedProduct.titleSpintax}
                  onChange={(e) => setEditedProduct({ ...editedProduct, titleSpintax: e.target.value })}
                  placeholder="{ChatGPT|GPT} {Plus|+} {месяц|30 дней}"
                  rows={4}
                  fullWidth
                />

                {titlePreview.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Предпросмотр (5 примеров):</h4>
                    <ul className="space-y-1">
                      {titlePreview.map((title, i) => (
                        <li key={i} className="text-sm text-gray-700">• {title}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm font-medium text-primary">
                      Всего комбинаций: {totalCombinations.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Описание */}
            {activeTab === 'description' && (
              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Sparkles size={16} />}
                  onClick={() => {
                    const newBlock: DescriptionBlock = {
                      id: Date.now().toString(),
                      name: 'Новый блок',
                      type: 'spintax',
                      content: '',
                      enabled: true,
                      order: editedProduct.descriptionBlocks.length,
                    };
                    setEditedProduct({
                      ...editedProduct,
                      descriptionBlocks: [...editedProduct.descriptionBlocks, newBlock],
                    });
                  }}
                >
                  Добавить блок
                </Button>

                {editedProduct.descriptionBlocks.map((block, index) => (
                  <div key={block.id} className="border rounded-lg p-4">
                    <Input
                      label="Название блока"
                      value={block.name}
                      onChange={(e) => {
                        const blocks = [...editedProduct.descriptionBlocks];
                        blocks[index] = { ...block, name: e.target.value };
                        setEditedProduct({ ...editedProduct, descriptionBlocks: blocks });
                      }}
                      fullWidth
                    />
                    <TextArea
                      label="Содержимое (спинтакс)"
                      value={block.content}
                      onChange={(e) => {
                        const blocks = [...editedProduct.descriptionBlocks];
                        blocks[index] = { ...block, content: e.target.value };
                        setEditedProduct({ ...editedProduct, descriptionBlocks: blocks });
                      }}
                      rows={3}
                      fullWidth
                      className="mt-2"
                    />
                    <div className="mt-2 flex justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={block.enabled}
                          onChange={(e) => {
                            const blocks = [...editedProduct.descriptionBlocks];
                            blocks[index] = { ...block, enabled: e.target.checked };
                            setEditedProduct({ ...editedProduct, descriptionBlocks: blocks });
                          }}
                        />
                        <span className="text-sm">Включен</span>
                      </label>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const blocks = editedProduct.descriptionBlocks.filter((_, i) => i !== index);
                          setEditedProduct({ ...editedProduct, descriptionBlocks: blocks });
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: Генерация */}
            {activeTab === 'generation' && (
              <div className="space-y-6">
                <Input
                  label="Количество объявлений:"
                  type="number"
                  value={generationCount}
                  onChange={(e) => setGenerationCount(Number(e.target.value))}
                  min={1}
                  max={1000}
                />

                <Button
                  variant="primary"
                  icon={<Rocket size={20} />}
                  onClick={handleGenerate}
                  disabled={!editedProduct.titleSpintax}
                  fullWidth
                >
                  Генерировать
                </Button>
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-6 border-t flex justify-between">
            <Button variant="secondary" onClick={onBack}>
              Назад
            </Button>
            <Button variant="primary" icon={<Save size={20} />} onClick={handleSave}>
              Сохранить
            </Button>
          </div>
        </div>
      </div>

      {/* Модал экспорта */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="Экспорт объявлений" size="lg">
        <div className="space-y-4">
          <p className="text-lg">Сгенерировано объявлений: <strong>{generatedAds.length}</strong></p>

          <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
            {generatedAds.slice(0, 3).map((ad, i) => (
              <div key={i} className="mb-4 pb-4 border-b last:border-0">
                <h4 className="font-semibold">{ad.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{ad.description.substring(0, 150)}...</p>
                <p className="text-xs text-gray-500 mt-1">Артикул: {ad.article} | Менеджер: {ad.manager}</p>
              </div>
            ))}
          </div>

          <ModalFooter>
            <Button variant="secondary" onClick={() => downloadAsTxt(generatedAds)}>
              Скачать TXT
            </Button>
            <Button variant="primary" onClick={() => downloadAsCsv(generatedAds)}>
              Скачать CSV
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
};
