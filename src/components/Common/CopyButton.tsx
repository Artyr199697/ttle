/**
 * Компонент кнопки копирования в буфер обмена
 */

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';
import { copyToClipboard } from '../../utils/export';

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Скопировать',
  variant = 'secondary',
  size = 'md',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={copied ? 'success' : variant}
      size={size}
      onClick={handleCopy}
      icon={copied ? <Check size={18} /> : <Copy size={18} />}
      className={className}
    >
      {copied ? 'Скопировано!' : label}
    </Button>
  );
};
