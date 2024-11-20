import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Download, Copy, Trash2, Settings, Loader } from 'lucide-react';
import { ImageDropzone } from './ImageDropzone';
import { ConversionOptions } from './ConversionOptions';
import { ImagePreview } from './ImagePreview';
import { formatFileSize } from '../utils/formatFileSize';
import toast from 'react-hot-toast';

interface ImageFile {
  id: string;
  original: File;
  preview: string;
  converted?: string;
  converting: boolean;
}

interface ConversionSettings {
  format: string;
  quality: number;
  maxWidth: number;
  maxHeight: number;
}

export function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'image/jpeg',
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080
  });

  const handleImageDrop = useCallback(async (files: File[]) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      original: file,
      preview: URL.createObjectURL(file),
      converting: false
    }));
    
    setImages(prev => [...prev, ...newImages]);
    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0].id);
    }
  }, [selectedImage]);

  const convertImage = async (image: ImageFile, options: ConversionSettings) => {
    try {
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, converting: true } : img
      ));
      
      const compressedFile = await imageCompression(image.original, {
        maxSizeMB: 1,
        maxWidthOrHeight: Math.max(options.maxWidth, options.maxHeight),
        useWebWorker: true,
        fileType: options.format,
        quality: options.quality / 100
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => prev.map(img => 
          img.id === image.id ? {
            ...img,
            converted: reader.result as string,
            converting: false
          } : img
        ));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error converting image:', error);
      toast.error(`Failed to convert image: ${image.original.name}`);
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, converting: false } : img
      ));
    }
  };

  const handleSettingsChange = async (newSettings: Partial<ConversionSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Convert all images with new settings
    for (const image of images) {
      await convertImage(image, updatedSettings);
    }
  };

  const handleDownloadAll = () => {
    images.forEach(image => {
      if (image.converted) {
        const link = document.createElement('a');
        link.href = image.converted;
        link.download = `converted-${image.original.name.split('.')[0]}.${settings.format.split('/')[1]}`;
        link.click();
      }
    });
    toast.success('All images downloaded!');
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage === id) {
      setSelectedImage(images.find(img => img.id !== id)?.id || null);
    }
  };

  const selectedImageData = images.find(img => img.id === selectedImage);

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <ImageDropzone onImageDrop={handleImageDrop} />
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Images ({images.length})</h2>
            <div className="space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadAll}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Download All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {images.map(image => (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden ${
                      selectedImage === image.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedImage(image.id)}
                  >
                    <img
                      src={image.preview}
                      alt={image.original.name}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(image.id);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {image.converting && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {showSettings && (
                <ConversionOptions
                  settings={settings}
                  onChange={handleSettingsChange}
                />
              )}
            </div>

            <div className="space-y-4">
              {selectedImageData && (
                <>
                  <h3 className="text-lg font-medium">Preview</h3>
                  <div className="space-y-4">
                    <ImagePreview
                      imageUrl={selectedImageData.converted || selectedImageData.preview}
                      fileSize={selectedImageData.original.size}
                    />
                    {selectedImageData.converted && (
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedImageData.converted!;
                            link.download = `converted-${selectedImageData.original.name}`;
                            link.click();
                          }}
                          className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}