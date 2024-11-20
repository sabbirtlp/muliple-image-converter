import React from 'react';

interface ConversionSettings {
  format: string;
  quality: number;
  maxWidth: number;
  maxHeight: number;
}

interface ConversionOptionsProps {
  settings: ConversionSettings;
  onChange: (settings: Partial<ConversionSettings>) => void;
}

export function ConversionOptions({ settings, onChange }: ConversionOptionsProps) {
  const formats = [
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/webp', label: 'WebP' },
    { value: 'image/avif', label: 'AVIF' }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-medium mb-4">Conversion Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Output Format</label>
          <select
            value={settings.format}
            onChange={(e) => onChange({ format: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            {formats.map((format) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Quality: {settings.quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.quality}
            onChange={(e) => onChange({ quality: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max Width: {settings.maxWidth}px
          </label>
          <input
            type="range"
            min="100"
            max="3840"
            step="100"
            value={settings.maxWidth}
            onChange={(e) => onChange({ maxWidth: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Max Height: {settings.maxHeight}px
          </label>
          <input
            type="range"
            min="100"
            max="2160"
            step="100"
            value={settings.maxHeight}
            onChange={(e) => onChange({ maxHeight: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}