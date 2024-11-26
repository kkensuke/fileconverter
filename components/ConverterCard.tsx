import React from 'react';
import { FileConverter } from '@/types/converter';

interface ConverterCardProps {
  converter: FileConverter;
  onSelect: () => void;
  isSelected: boolean;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  converter,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onSelect}
    >
      <h3 className="mb-2 font-semibold text-gray-900">{converter.name}</h3>
      <p className="mb-2 text-sm text-gray-700">{converter.description}</p>
      <p className="text-sm text-gray-600">
        Accepts: {converter.acceptedTypes.join(', ')}
      </p>
    </div>
  );
};