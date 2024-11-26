"use client";

import { useState } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { ConverterCard } from '@/components/ConverterCard';
import { ConversionProgress } from '@/components/ConversionProgress';
import { FileConverter } from '@/types/converter';
import { textCaseConverter } from '@/lib/converters/textCaseConverter';
import { newConverter } from '@/lib/converters/newConverter';
import { markdownConverter } from '@/lib/converters/markdownConverter';

const availableConverters: FileConverter[] = [
  textCaseConverter,
  markdownConverter,
  newConverter,
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedConverter, setSelectedConverter] = useState<FileConverter | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'converting' | 'success' | 'error'>('converting');
  const [error, setError] = useState<string | undefined>();
  const [converting, setConverting] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setProgress(0);
    setError(undefined);
  };

  const handleConverterSelect = (converter: FileConverter) => {
    setSelectedConverter(converter);
    setError(undefined);
  };

  const handleConvert = async () => {
    if (!selectedFile || !selectedConverter) return;

    try {
      setConverting(true);
      setStatus('converting');
      setProgress(10);

      // Conversion process
      const convertedFile = await selectedConverter.convert(selectedFile);
      setProgress(90);

      // Download process
      const url = URL.createObjectURL(convertedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = convertedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('success');
      setTimeout(() => {
        setProgress(0);
        setConverting(false);
        setSelectedFile(null);
        setSelectedConverter(null);
        setError(undefined);
        setStatus('converting');
      }, 1000);
    } catch (error) {
      console.error('Conversion failed:', error);
      setStatus('error');
      setError('Conversion failed. Please check your file and try again.');
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          File Conversion Tool
        </h1>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">1. Select Conversion Method</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableConverters.map((converter) => (
              <ConverterCard
                key={converter.id}
                converter={converter}
                onSelect={() => handleConverterSelect(converter)}
                isSelected={selectedConverter?.id === converter.id}
              />
            ))}
          </div>
        </div>

        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">2. Upload File</h2>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            acceptedTypes={selectedConverter?.acceptedTypes || []}
          />
          {selectedFile && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700">
                Selected file: <span className="font-semibold text-blue-700">{selectedFile.name}</span>
              </div>
              {!selectedConverter && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Please select a conversion method
                </p>
              )}
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">3. Convert</h2>
            {converting ? (
              <ConversionProgress
                progress={progress}
                fileName={selectedFile.name}
                status={status}
                error={error}
              />
            ) : (
              <button
                onClick={handleConvert}
                disabled={!selectedConverter}
                className={`w-full py-3 rounded-lg font-semibold
                  ${
                    selectedConverter
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  }`}
              >
                Start Conversion
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}