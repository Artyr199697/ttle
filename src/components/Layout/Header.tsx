/**
 * Компонент шапки приложения
 */

import React from 'react';
import { Target, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../Common/Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Avito Master PRO',
  subtitle,
  showBack = false,
  onBack,
  onSettings,
}) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Левая часть */}
          <div className="flex items-center gap-4">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Target size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-white/80">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Правая часть */}
          {onSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              icon={<Settings size={20} />}
              className="text-white hover:bg-white/10"
            >
              Настройки
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
