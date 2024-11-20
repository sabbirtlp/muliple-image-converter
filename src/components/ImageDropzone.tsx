import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface ImageDropzoneProps {
  onImageDrop: (files: File[]) => void;
  multiple?: boolean;
}

export function ImageDropzone({ onImageDrop, multiple = true }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif']
    },
    multiple,
    onDrop: files => onImageDrop(files)
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-xl transition-colors duration-200 cursor-pointer',
        'p-8 flex flex-col items-center justify-center min-h-[300px]',
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400">
        {isDragActive ? (
          <>
            <Upload className="w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium text-blue-500">Drop your images here</p>
          </>
        ) : (
          <>
            <ImageIcon className="w-12 h-12" />
            <div className="text-center">
              <p className="text-lg font-medium">Drag & drop your images here</p>
              <p className="text-sm mt-2">
                Supports JPEG, PNG, WebP, and AVIF formats
              </p>
              {multiple && (
                <p className="text-sm mt-1 text-blue-500">
                  You can select multiple files
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}