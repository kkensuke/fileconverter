import React, { useState, useRef } from 'react';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  acceptedTypes,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFileTypeAccepted = (file: File): boolean => {
    if (acceptedTypes.length === 0) return true;
    
    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const hasAcceptedExtension = acceptedTypes.some(type => 
      type.startsWith('.') && type.toLowerCase() === fileExtension
    );
    
    // Check MIME type
    const hasAcceptedMimeType = acceptedTypes.some(type => 
      !type.startsWith('.') && file.type === type
    );
    
    return hasAcceptedExtension || hasAcceptedMimeType;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file => isFileTypeAccepted(file));

    if (validFile) {
      onFileSelect(validFile);
    } else {
      alert('Please upload a file with one of these extensions: ' + 
        acceptedTypes.filter(t => t.startsWith('.')).join(', '));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validFile = Array.from(files).find(file => isFileTypeAccepted(file));
      if (validFile) {
        onFileSelect(validFile);
      } else {
        alert('Please upload a file with one of these extensions: ' + 
          acceptedTypes.filter(t => t.startsWith('.')).join(', '));
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Format accepted types for display
  const displayAcceptedTypes = () => {
    const extensions = acceptedTypes
      .filter(type => type.startsWith('.'))
      .join(', ');
    return extensions || 'All files';
  };

  // Format accepted types for input element
  const getAcceptAttribute = () => {
    return acceptedTypes.join(',');
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInput}
        accept={getAcceptAttribute()}
      />
      {isDragging ? (
        <p className="font-medium text-blue-700">Drop here</p>
      ) : (
        <div>
          <p className="mb-2 font-medium text-gray-900">Drag & Drop file here</p>
          <p className="text-sm text-gray-700">or click to select a file</p>
          {acceptedTypes.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Accepts: {displayAcceptedTypes()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};