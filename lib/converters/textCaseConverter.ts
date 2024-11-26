import { FileConverter } from '@/types/converter';

export const textCaseConverter: FileConverter = {
  id: 'text-case',
  name: 'Text Case Converter',
  description: 'Converts text file content to uppercase',
  acceptedTypes: ['.txt'],
  convert: async (file: File) => {
    const text = await file.text();
    const upperText = text.toUpperCase();
    return new File([upperText], file.name.replace('.txt', '_upper.txt'), {
      type: 'text/plain',
    });
  },
};