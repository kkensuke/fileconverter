import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  acceptedTypes,
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">ファイルをドロップしてください</p>
      ) : (
        <div>
          <p className="mb-2">ファイルをドラッグ&ドロップ</p>
          <p className="text-sm text-gray-500">または クリックしてファイルを選択</p>
        </div>
      )}
    </div>
  );
};