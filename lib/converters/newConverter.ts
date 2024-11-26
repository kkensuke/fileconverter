import { FileConverter } from '@/types/converter';

export const newConverter: FileConverter = {
  id: 'newConverter',
  name: 'Converter Name',
  description: 'Description of the converter',
  acceptedTypes: ['.txt'],
  convert: async (file: File) => {
    const text = await file.text();
    const ConvertedData = text.toUpperCase();
    return new File([ConvertedData], file.name.replace('.txt', '_converted.txt'), {
      type: 'text/plain',
    });
  },
};