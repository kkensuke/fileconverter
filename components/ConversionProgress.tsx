import React from 'react';

interface ConversionProgressProps {
  progress: number;
  fileName: string;
  status: 'converting' | 'success' | 'error';
  error?: string;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
  progress,
  fileName,
  status,
  error,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'converting':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between">
        <span className="max-w-[80%] truncate text-sm font-medium text-gray-900">{fileName}</span>
        <span className="text-sm font-medium text-gray-900">{progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`${getStatusColor()} rounded-full h-2 transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};
