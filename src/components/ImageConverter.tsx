import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Download, Archive, Trash2, Settings, Loader } from 'lucide-react';
import { ImageDropzone } from './ImageDropzone';
import { ConversionOptions } from './ConversionOptions';
import { ImagePreview } from './ImagePreview';
import { ProgressBar } from './ProgressBar';
import { formatFileSize } from '../utils/formatFileSize';
import toast from 'react-hot-toast';
import JSZip from 'jszip';

interface ImageFile {
  id: string;
  original: File;
  preview: string;
  converted?: string;
  converting: boolean;
  progress: number;
}

interface ConversionSettings {
  format: string;
  quality: number;
  maxWidth: number;
  maxHeight: number;
}

const compressionOptions = {
  'image/jpeg': { lossy: true, quality: 0.8 },
  'image/png': { lossy: false },
  'image/webp': { lossy: true, quality: 0.8 },
  'image/avif': { lossy: true, quality: 0.8 }
};

export function ImageConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
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
      converting: false,
      progress: 0
    }));
    
    setImages(prev => [...prev, ...newImages]);
    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0].id);
    }

    // Start converting new images
    newImages.forEach(image => convertImage(image, settings));
  }, [selectedImage, settings]);

  const convertImage = async (image: ImageFile, options: ConversionSettings) => {
    try {
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, converting: true, progress: 0 } : img
      ));

      const format = options.format as keyof typeof compressionOptions;
      const compressionOpts = {
        maxSizeMB: 10,
        maxWidthOrHeight: Math.max(options.maxWidth, options.maxHeight),
        useWebWorker: true,
        fileType: format,
        initialQuality: options.quality / 100,
        alwaysKeepResolution: true,
        ...compressionOptions[format],
        onProgress: (progress: number) => {
          setImages(prev => prev.map(img =>
            img.id === image.id ? { ...img, progress } : img
          ));
        }
      };
      
      const compressedFile = await imageCompression(image.original, compressionOpts);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImages(prev => prev.map(img => 
          img.id === image.id ? {
            ...img,
            converted: reader.result as string,
            converting: false,
            progress: 100
          } : img
        ));
      };
      
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error converting image:', error);
      toast.error(`Failed to convert ${image.original.name}`);
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, converting: false, progress: 0 } : img
      ));
    }
  };

  const handleSettingsChange = async (newSettings: Partial<ConversionSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Convert all images with new settings
    images.forEach(image => convertImage(image, updatedSettings));
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      setZipProgress(0);
      const zip = new JSZip();
      
      const folder = zip.folder("converted-images");
      if (!folder) throw new Error("Failed to create zip folder");

      const convertedImages = images.filter(img => img.converted);
      const total = convertedImages.length;

      for (let i = 0; i < total; i++) {
        const image = convertedImages[i];
        if (image.converted) {
          const base64Data = image.converted.split(',')[1];
          const extension = settings.format.split('/')[1];
          const fileName = `${image.original.name.split('.')[0]}.${extension}`;
          folder.file(fileName, base64Data, { base64: true });
          setZipProgress(((i + 1) / total) * 100);
        }
      }

      const content = await zip.generateAsync({ 
        type: "blob",
        onUpdate: (metadata) => {
          if (metadata.percent) {
            setZipProgress(metadata.percent);
          }
        }
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "converted-images.zip";
      link.click();
      URL.revokeObjectURL(link.href);
      
      toast.success('All images downloaded as ZIP!');
    } catch (error) {
      console.error('Error creating ZIP:', error);
      toast.error('Failed to create ZIP file');
    } finally {
      setIsDownloadingZip(false);
      setZipProgress(0);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage === id) {
      setSelectedImage(images.find(img => img.id !== id)?.id || null);
    }
  };

  const selectedImageData = images.find(img => img.id === selectedImage);
  const convertingCount = images.filter(img => img.converting).length;
  const totalProgress = images.reduce((acc, img) => acc + img.progress, 0) / images.length;

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <ImageDropzone onImageDrop={handleImageDrop} />
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Images ({images.length})</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadZip}
                disabled={isDownloadingZip || images.length === 0}
                className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloadingZip ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Archive className="w-5 h-5 mr-2" />
                )}
                Download All as ZIP
              </button>
            </div>
          </div>

          {(convertingCount > 0 || isDownloadingZip) && (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm">
              {convertingCount > 0 && (
                <ProgressBar
                  progress={totalProgress}
                  total={100}
                  label={`Converting ${convertingCount} ${convertingCount === 1 ? 'image' : 'images'}...`}
                />
              )}
              {isDownloadingZip && (
                <ProgressBar
                  progress={zipProgress}
                  total={100}
                  label="Creating ZIP file..."
                />
              )}
            </div>
          )}

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
                        <div className="w-full px-2">
                          <ProgressBar progress={image.progress} total={100} />
                        </div>
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
                            link.download = `converted-${selectedImageData.original.name.split('.')[0]}.${settings.format.split('/')[1]}`;
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