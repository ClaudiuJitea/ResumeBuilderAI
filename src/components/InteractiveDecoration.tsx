import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Decoration } from '../types/resume';

interface InteractiveDecorationProps {
  decoration: Decoration;
}

const InteractiveDecoration: React.FC<InteractiveDecorationProps> = ({ decoration }) => {
  const { dispatch } = useResume();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const decorationRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Focus the decoration for keyboard navigation
    setIsFocused(true);
    decorationRef.current?.focus();
    
    const rect = decorationRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isNearRightEdge = e.clientX > rect.right - 10;
    const isNearBottomEdge = e.clientY > rect.bottom - 10;
    
    if (isNearRightEdge || isNearBottomEdge) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    
    setDragStart({
      x: e.clientX - decoration.position.x,
      y: e.clientY - decoration.position.y
    });
  }, [decoration.position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      
      dispatch({
        type: 'UPDATE_DECORATION',
        payload: {
          id: decoration.id,
          updates: {
            position: { x: newX, y: newY }
          }
        }
      });
    } else if (isResizing) {
      const rect = decorationRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newWidth = Math.max(20, e.clientX - rect.left);
      const newHeight = Math.max(10, e.clientY - rect.top);
      
      dispatch({
        type: 'UPDATE_DECORATION',
        payload: {
          id: decoration.id,
          updates: {
            size: { width: newWidth, height: newHeight }
          }
        }
      });
    }
  }, [isDragging, isResizing, dragStart, decoration.id, dispatch]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFocused(true);
    decorationRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isFocused) return;
    
    const step = e.shiftKey ? 60 : 6; // Hold Shift for larger steps
    let newX = decoration.position.x;
    let newY = decoration.position.y;
    
    switch (e.key) {
      case 'ArrowLeft':
        newX = Math.max(0, decoration.position.x - step);
        break;
      case 'ArrowRight':
        newX = decoration.position.x + step;
        break;
      case 'ArrowUp':
        newY = Math.max(0, decoration.position.y - step);
        break;
      case 'ArrowDown':
        newY = decoration.position.y + step;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    dispatch({
      type: 'UPDATE_DECORATION',
      payload: {
        id: decoration.id,
        updates: {
          position: { x: newX, y: newY }
        }
      }
    });
  }, [isFocused, decoration.position, decoration.id, dispatch]);

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFocused, handleKeyDown]);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const renderDecorationContent = () => {
    const { color = '#000000', opacity = 1, thickness = 2, style = 'solid', borderRadius = 0, rotation = 0 } = decoration.properties || {};
    
    const baseStyle = {
      width: '100%',
      height: '100%',
      opacity,
      borderRadius: `${borderRadius}px`
    };

    switch (decoration.type) {
      case 'separator':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color,
              height: `${thickness}px`
            }}
          />
        );
      
      case 'corner-frame':
        return (
          <div
            style={{
              ...baseStyle,
              border: `${thickness}px ${style} ${color}`,
              backgroundColor: 'transparent',
              transform: `rotate(${rotation}deg)`
            }}
          />
        );
      
      case 'circle-frame':
        return (
          <div
            style={{
              ...baseStyle,
              border: `${thickness}px ${style} ${color}`,
              backgroundColor: 'transparent',
              borderRadius: '50%'
            }}
          />
        );
      
      case 'triangle-frame':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: 'transparent'
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              style={{ overflow: 'visible', transform: `rotate(${rotation}deg)` }}
            >
              <polygon
                points="50,10 10,90 90,90"
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeDasharray={style === 'dashed' ? '5,5' : style === 'dotted' ? '2,2' : 'none'}
              />
            </svg>
          </div>
        );
      

      
      case 'geometric-shape':
        const { shape = 'circle' } = decoration.properties || {};
        if (shape === 'triangle') {
          return (
            <div
              style={{
                ...baseStyle,
                width: 0,
                height: 0,
                borderLeft: `${decoration.size.width / 2}px solid transparent`,
                borderRight: `${decoration.size.width / 2}px solid transparent`,
                borderBottom: `${decoration.size.height}px solid ${color}`,
                opacity,
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        } else if (shape === 'circle') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                borderRadius: '50%',
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        } else if (shape === 'diamond') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                transform: `rotate(${45 + rotation}deg)`
              }}
            />
          );
        } else if (shape === 'hexagon') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                transform: `rotate(${rotation}deg)`
              }}
            />
          );
        }
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color
            }}
          />
        );
      
      case 'section-divider':
        return (
          <div
            style={{
              ...baseStyle,
              borderTop: `1px ${style} ${color}`,
              height: '1px'
            }}
          />
        );
      
      case 'highlight-box':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color,
              border: `1px solid ${color}`,
              transform: `rotate(${rotation}deg)`
            }}
          />
        );
      
      case 'decorative-border':
        return (
          <div
            style={{
              ...baseStyle,
              border: `${thickness}px ${style} ${color}`,
              backgroundColor: 'transparent'
            }}
          />
        );
      
      case 'visual-element':
        const { shape: visualShape = 'circle' } = decoration.properties || {};
        if (visualShape === 'circle') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                borderRadius: '50%'
              }}
            />
          );
        }
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color
            }}
          />
        );
      
      case 'dust-overlay':
        const { particleCount = 85, particleSize = 3 } = decoration.properties || {};
        // Use decoration ID as seed for consistent particle generation
        const seed = decoration.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const seededRandom = (index: number) => {
          const x = Math.sin(seed + index * 12.9898) * 43758.5453;
          return x - Math.floor(x);
        };
        
        const particles = Array.from({ length: particleCount }, (_, i) => {
          const x = seededRandom(i * 4) * 100;
          const y = seededRandom(i * 4 + 1) * 100;
          const size = seededRandom(i * 4 + 2) * particleSize + 1;
          const particleOpacity = seededRandom(i * 4 + 3) * opacity + 0.1;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                opacity: particleOpacity
              }}
            />
          );
        });
        
        return (
          <div style={{ ...baseStyle, position: 'relative' }}>
            {particles}
          </div>
        );
      
      case 'hexagonal-overlay':
        // Create different gradient shapes based on the shape property
        const { shape: overlayShape = 'flowing', rotation: userRotation = 0 } = decoration.properties || {};
        
        // Use decoration ID as seed for consistent shape generation
        const shapeSeed = decoration.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const shapeSeededRandom = (index: number) => {
          const x = Math.sin(shapeSeed + index * 12.9898) * 43758.5453;
          return x - Math.floor(x);
        };
        
        const gradientShapes = [];
        const numShapes = overlayShape === 'flowing' ? 3 : overlayShape === 'geometric' ? 4 : overlayShape === 'crystalline' ? 6 : overlayShape === 'waves' ? 4 : overlayShape === 'spiral' ? 5 : 5;
        
        for (let i = 0; i < numShapes; i++) {
          const shapeWidth = decoration.size.width * (0.3 + shapeSeededRandom(i * 4) * 0.4);
          const shapeHeight = decoration.size.height * (0.25 + shapeSeededRandom(i * 4 + 1) * 0.5);
          const x = shapeSeededRandom(i * 4 + 2) * (decoration.size.width - shapeWidth);
          const y = shapeSeededRandom(i * 4 + 3) * (decoration.size.height - shapeHeight);
          const baseRotation = shapeSeededRandom(i * 4 + 4) * 60 - 30;
          const finalRotation = baseRotation + userRotation;
          const shapeOpacity = opacity * (0.1 + shapeSeededRandom(i * 4 + 5) * 0.3);
          
          let shapeElement;
          
          if (overlayShape === 'flowing') {
            // Flowing elliptical gradients
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='grad'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color)}' stop-opacity='${shapeOpacity}'/%3E%3Cstop offset='70%25' stop-color='${encodeURIComponent(color)}' stop-opacity='${shapeOpacity * 0.4}'/%3E%3Cstop offset='100%25' stop-color='${encodeURIComponent(color)}' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx='50' cy='50' rx='45' ry='30' fill='url(%23grad)'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  transform: `rotate(${finalRotation}deg)`,
                  filter: 'blur(2px)'
                }}
              />
            );
          } else if (overlayShape === 'geometric') {
            // Angular geometric shapes
            const sides = 3 + (i % 3); // Triangle, square, pentagon
            const clipPaths = {
              3: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle
              4: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Square
              5: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' // Pentagon
            };
            
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `linear-gradient(${finalRotation}deg, ${color}${Math.round(shapeOpacity * 255).toString(16).padStart(2, '0')}, transparent)`,
                  clipPath: clipPaths[sides as keyof typeof clipPaths],
                  transform: `rotate(${finalRotation}deg)`
                }}
              />
            );
          } else if (overlayShape === 'crystalline') {
            // Crystalline diamond-like shapes
            const crystalPath = 'polygon(50% 0%, 80% 20%, 100% 50%, 80% 80%, 50% 100%, 20% 80%, 0% 50%, 20% 20%)';
            
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `conic-gradient(from ${finalRotation}deg, ${color}${Math.round(shapeOpacity * 255).toString(16).padStart(2, '0')}, transparent, ${color}${Math.round(shapeOpacity * 128).toString(16).padStart(2, '0')})`,
                  clipPath: crystalPath,
                  transform: `rotate(${finalRotation}deg)`,
                  filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.2))'
                }}
              />
            );
          } else if (overlayShape === 'waves') {
            // Wave patterns
            const waveHeight = shapeHeight * 0.3;
            const waveFreq = 2 + (i % 3);
            
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='waveGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color)}' stop-opacity='${shapeOpacity}'/%3E%3Cstop offset='100%25' stop-color='${encodeURIComponent(color)}' stop-opacity='0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M0,50 Q25,${30 + waveHeight * Math.sin(i * waveFreq)} 50,50 T100,50 L100,100 L0,100 Z' fill='url(%23waveGrad)'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  transform: `rotate(${finalRotation}deg)`,
                  filter: 'blur(1px)'
                }}
              />
            );
          } else if (overlayShape === 'spiral') {
            // Spiral patterns
            const spiralTurns = 2 + (i % 2);
            
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `conic-gradient(from ${finalRotation}deg, ${'transparent '.repeat(spiralTurns)}${color}${Math.round(shapeOpacity * 255).toString(16).padStart(2, '0')}, transparent)`,
                  borderRadius: '50%',
                  transform: `rotate(${finalRotation}deg)`,
                  filter: 'blur(2px)'
                }}
              />
            );
          } else {
            // Organic blob-like shapes
            const blobPath = `M${20 + shapeSeededRandom(i * 8) * 60},${20 + shapeSeededRandom(i * 8 + 1) * 60} C${40 + shapeSeededRandom(i * 8 + 2) * 40},${10 + shapeSeededRandom(i * 8 + 3) * 20} ${60 + shapeSeededRandom(i * 8 + 4) * 30},${30 + shapeSeededRandom(i * 8 + 5) * 40} ${80 + shapeSeededRandom(i * 8 + 6) * 15},${50 + shapeSeededRandom(i * 8 + 7) * 30} C${70 + shapeSeededRandom(i * 8 + 8) * 20},${70 + shapeSeededRandom(i * 8 + 9) * 20} ${30 + shapeSeededRandom(i * 8 + 10) * 40},${80 + shapeSeededRandom(i * 8 + 11) * 15} ${20 + shapeSeededRandom(i * 8 + 12) * 60},${20 + shapeSeededRandom(i * 8 + 13) * 60}Z`;
            
            shapeElement = (
              <div
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${shapeWidth}px`,
                  height: `${shapeHeight}px`,
                  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3CradialGradient id='grad'%3E%3Cstop offset='0%25' stop-color='${encodeURIComponent(color)}' stop-opacity='${shapeOpacity}'/%3E%3Cstop offset='100%25' stop-color='${encodeURIComponent(color)}' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cpath d='${blobPath}' fill='url(%23grad)'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  transform: `rotate(${finalRotation}deg)`,
                  filter: 'blur(1px)'
                }}
              />
            );
          }
          
          gradientShapes.push(
            <div key={i}>
              {shapeElement}
            </div>
          );
        }
        
        return (
           <div style={{ ...baseStyle, position: 'relative', overflow: 'hidden' }}>
             {gradientShapes}
           </div>
         );
       
      case 'svg-graphic':
        const { svgContent, svgColors, preserveAspectRatio = true } = decoration.properties || {};
        
        if (!svgContent) {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#6b7280'
              }}
            >
              SVG
            </div>
          );
        }
        
        // Apply color replacements and size constraints
        let processedSvg = svgContent;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(processedSvg, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // Remove any fixed width/height attributes that might cause overflow
          svgElement.removeAttribute('width');
          svgElement.removeAttribute('height');
          
          // Set responsive width and height
          svgElement.setAttribute('width', '100%');
          svgElement.setAttribute('height', '100%');
          
          // Ensure proper viewBox for scaling
          if (!svgElement.getAttribute('viewBox')) {
            const width = svgElement.getAttribute('width') || '100';
            const height = svgElement.getAttribute('height') || '100';
            svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
          }
          
          // Set preserveAspectRatio
          if (preserveAspectRatio) {
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          } else {
            svgElement.setAttribute('preserveAspectRatio', 'none');
          }
          
          // Add containment styles
          svgElement.style.maxWidth = '100%';
          svgElement.style.maxHeight = '100%';
          svgElement.style.width = 'auto';
          svgElement.style.height = 'auto';
          svgElement.style.display = 'block';
          
          processedSvg = new XMLSerializer().serializeToString(svgDoc);
        }
        
        // Apply color replacements if any
        if (svgColors) {
          Object.entries(svgColors).forEach(([key, newColor]) => {
            const [type, index] = key.split('-');
            const colorParser = new DOMParser();
            const colorSvgDoc = colorParser.parseFromString(processedSvg, 'image/svg+xml');
            const elements = colorSvgDoc.querySelectorAll(`[${type}]`);
            if (elements[parseInt(index)]) {
              elements[parseInt(index)].setAttribute(type, newColor);
              processedSvg = new XMLSerializer().serializeToString(colorSvgDoc);
            }
          });
        }
        
        return (
          <div
            className="svg-container"
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${rotation}deg)`,
              opacity,
              overflow: 'hidden'
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: processedSvg }}
              className="svg-content"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            />
          </div>
        );
       
       default:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color
            }}
          />
        );
    }
  };

  return (
    <div
      ref={decorationRef}
      className={`absolute cursor-move select-none ${
        isDragging ? 'z-50' : 'z-10'
      } hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 ${
        isFocused ? 'ring-2 ring-blue-500 ring-opacity-75' : ''
      }`}
      style={{
        left: `${decoration.position.x}px`,
        top: `${decoration.position.y}px`,
        width: `${decoration.size.width}px`,
        height: `${decoration.size.height}px`,
        outline: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      title={`${decoration.type} decoration - Drag to move, resize from edges, or use arrow keys to move (Shift+Arrow for larger steps)`}
    >
      {renderDecorationContent()}
      
      {/* Resize handles */}
      <div 
        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 opacity-0 hover:opacity-100 cursor-se-resize"
        style={{ transform: 'translate(50%, 50%)' }}
      />
    </div>
  );
};

export default InteractiveDecoration;