export interface FileConverter {
  id: string;
  name: string;
  description: string;
  acceptedTypes: string[];
  convert: (file: File) => Promise<File>;
}