import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

export function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(20);
  const [saturation, setSaturation] = useState(180);
  const [border, setBorder] = useState(1);

  const generateGlassStyle = () => {
    return {
      width: '200px',
      height: '200px',
      background: `rgba(255, 255, 255, ${opacity / 100})`,
      backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
      borderRadius: '16px',
      border: `${border}px solid rgba(255, 255, 255, 0.3)`
    };
  };

  const style = generateGlassStyle();
  const cssCode = `.glassmorphism {
  background: rgba(255, 255, 255, ${opacity / 100});
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border-radius: 16px;
  border: ${border}px solid rgba(255, 255, 255, 0.3);
}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blur: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacity: {opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saturation: {saturation}%
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border: {border}px
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={border}
              onChange={(e) => setBorder(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div 
          className="rounded-xl p-8 relative overflow-hidden"
          style={{
            background: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809) center/cover'
          }}
        >
          <div style={style}></div>
        </div>
      </div>

      <CodeBlock code={cssCode} />
    </div>
  );
}