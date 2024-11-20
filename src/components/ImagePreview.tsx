import React from 'react';
import { formatFileSize } from '../utils/formatFileSize';

interface ImagePreviewProps {
  imageUrl: string;
  fileSize: number;
}

export function ImagePreview({ imageUrl, fileSize }: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Size: {formatFileSize(fileSize)}
      </p>
    </div>
  );
}