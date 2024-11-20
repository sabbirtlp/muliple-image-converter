import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

export function NeumorphicGenerator() {
  const [size, setSize] = useState(20);
  const [blur, setBlur] = useState(30);
  const [distance, setDistance] = useState(10);
  const [intensity, setIntensity] = useState(5);
  const [isInset, setIsInset] = useState(false);

  const generateNeumorphicStyle = () => {
    const lightShadow = `rgba(255, 255, 255, ${intensity / 10})`;
    const darkShadow = `rgba(0, 0, 0, ${intensity / 20})`;
    const offset = distance / 2;
    
    return {
      width: `${size * 5}px`,
      height: `${size * 5}px`,
      backgroundColor: '#e0e0e0',
      borderRadius: '16px',
      boxShadow: isInset
        ? `inset ${offset}px ${offset}px ${blur}px ${darkShadow}, 
           inset -${offset}px -${offset}px ${blur}px ${lightShadow}`
        : `${offset}px ${offset}px ${blur}px ${darkShadow}, 
           -${offset}px -${offset}px ${blur}px ${lightShadow}`
    };
  };

  const style = generateNeumorphicStyle();
  const cssCode = `.neumorphic {
  width: ${style.width};
  height: ${style.height};
  background-color: ${style.backgroundColor};
  border-radius: ${style.borderRadius};
  box-shadow: ${style.boxShadow};
}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size: {size * 5}px
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blur: {blur}px
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={blur}
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance: {distance}px
            </label>
            <input
              type="range"
              min="5"
              max="30"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intensity: {intensity / 10}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inset"
              checked={isInset}
              onChange={(e) => setIsInset(e.target.checked)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="inset" className="ml-2 text-sm text-gray-700">
              Inset Shadow
            </label>
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#e0e0e0] rounded-xl p-8">
          <div style={style}></div>
        </div>
      </div>

      <CodeBlock code={cssCode} />
    </div>
  );
}