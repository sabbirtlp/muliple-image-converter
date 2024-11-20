import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

export function GradientBorderGenerator() {
  const [width, setWidth] = useState(4);
  const [radius, setRadius] = useState(16);
  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(3);
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#00ff00');
  const [color3, setColor3] = useState('#0000ff');

  const generateGradientStyle = () => {
    const gradientBg = `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3}, ${color1})`;
    
    return {
      width: '200px',
      height: '200px',
      position: 'relative',
      borderRadius: `${radius}px`,
      padding: `${width}px`,
      background: '#1a1a1a',
      isolation: 'isolate',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: `-${width}px`,
        background: gradientBg,
        borderRadius: `${radius}px`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        animation: `rotate ${speed}s linear infinite`,
        backgroundSize: '200% 200%',
        zIndex: -1
      }
    };
  };

  const previewStyle = {
    width: '200px',
    height: '200px',
    position: 'relative',
    borderRadius: `${radius}px`,
    padding: `${width}px`,
    background: '#1a1a1a',
    isolation: 'isolate'
  };

  const previewBorderStyle = {
    content: '""',
    position: 'absolute',
    inset: `-${width}px`,
    background: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3}, ${color1})`,
    borderRadius: `${radius}px`,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    animation: `rotate ${speed}s linear infinite`,
    backgroundSize: '200% 200%',
    zIndex: -1
  };

  const cssCode = `@keyframes rotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-border {
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: ${radius}px;
  padding: ${width}px;
  background: #1a1a1a;
  isolation: isolate;
}

.gradient-border::before {
  content: "";
  position: absolute;
  inset: -${width}px;
  background: linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3}, ${color1});
  border-radius: ${radius}px;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: rotate ${speed}s linear infinite;
  background-size: 200% 200%;
  z-index: -1;
}`;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Width: {width}px
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius: {radius}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gradient Angle: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animation Speed: {speed}s
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color 1
              </label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color 2
              </label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color 3
              </label>
              <input
                type="color"
                value={color3}
                onChange={(e) => setColor3(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-gray-900 rounded-xl p-8">
          <div style={previewStyle}>
            <div style={previewBorderStyle}></div>
          </div>
        </div>
      </div>

      <CodeBlock code={cssCode} />
    </div>
  );
}