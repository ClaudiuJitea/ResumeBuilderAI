import React, { useState, useRef, useCallback } from 'react';
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
  const decorationRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    const { color = '#000000', opacity = 1, thickness = 2, style = 'solid', shape = 'rectangle', borderRadius = 0 } = decoration.properties || {};
    
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
      
      case 'accent-line':
        return (
          <div
            style={{
              ...baseStyle,
              background: style === 'gradient' ? `linear-gradient(90deg, ${color}, transparent)` : (style === 'solid' ? color : 'transparent'),
              height: `${thickness}px`,
              borderStyle: style === 'dashed' ? 'dashed' : style === 'dotted' ? 'dotted' : 'none',
              borderWidth: style !== 'solid' ? `${thickness}px` : '0',
              borderColor: color
            }}
          />
        );
      
      case 'corner-frame':
        return (
          <div
            style={{
              ...baseStyle,
              border: `${thickness}px ${style} ${color}`,
              backgroundColor: 'transparent'
            }}
          />
        );
      
      case 'skill-badge':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            SKILL
          </div>
        );
      
      case 'geometric-shape':
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
                opacity
              }}
            />
          );
        } else if (shape === 'circle') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                borderRadius: '50%'
              }}
            />
          );
        } else if (shape === 'diamond') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                transform: 'rotate(45deg)'
              }}
            />
          );
        } else if (shape === 'hexagon') {
          return (
            <div
              style={{
                ...baseStyle,
                backgroundColor: color,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
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
      
      case 'progress-indicator':
        return (
          <div
            style={{
              ...baseStyle,
              background: style === 'gradient' 
                ? `linear-gradient(90deg, ${color} 70%, #e5e7eb 70%)` 
                : color,
              borderRadius: `${borderRadius}px`
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
              border: `1px solid ${color}`
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
        if (shape === 'circle') {
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
      } hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50`}
      style={{
        left: `${decoration.position.x}px`,
        top: `${decoration.position.y}px`,
        width: `${decoration.size.width}px`,
        height: `${decoration.size.height}px`
      }}
      onMouseDown={handleMouseDown}
      title={`${decoration.type} decoration - Drag to move, resize from edges`}
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