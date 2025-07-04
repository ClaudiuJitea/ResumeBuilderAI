import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { Decoration } from '../types/resume';

interface InteractiveSeparatorProps {
  decoration: Decoration;
}

const InteractiveSeparator: React.FC<InteractiveSeparatorProps> = ({ decoration }) => {
  const { dispatch } = useResume();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const separatorRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Focus the separator for keyboard navigation
    setIsFocused(true);
    separatorRef.current?.focus();
    
    const rect = separatorRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Check if click is on the resize handle (last 8px of the separator)
    const isNearRightEdge = e.clientX > rect.right - 8;
    
    if (isNearRightEdge) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - decoration.position.x,
        y: e.clientY - decoration.position.y
      });
    }
  }, [decoration.position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(400, e.clientX - dragStart.x)); // Constrain to resume bounds
      const newY = Math.max(0, Math.min(600, e.clientY - dragStart.y));
      
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
      const rect = separatorRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newWidth = Math.max(50, Math.min(300, e.clientX - rect.left));
      
      dispatch({
        type: 'UPDATE_DECORATION',
        payload: {
          id: decoration.id,
          updates: {
            size: { ...decoration.size, width: newWidth }
          }
        }
      });
    }
  }, [isDragging, isResizing, dragStart, decoration.id, decoration.size, dispatch]);

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
    separatorRef.current?.focus();
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
      document.body.style.cursor = isDragging ? 'grabbing' : 'ew-resize';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const rotation = decoration.properties?.rotation || 0;
  const thickness = decoration.properties?.thickness || decoration.size.height;
  
  const separatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${decoration.position.x}px`,
    top: `${decoration.position.y}px`,
    width: `${decoration.size.width}px`,
    height: `${thickness}px`,
    backgroundColor: decoration.properties?.color || '#000000',
    opacity: decoration.properties?.opacity || 1,
    cursor: isDragging ? 'grabbing' : (isResizing ? 'ew-resize' : 'move'),
    border: isDragging || isResizing ? '2px dashed #3b82f6' : (isFocused ? '2px solid #3b82f6' : 'none'),
    borderRadius: '2px',
    zIndex: isDragging || isResizing ? 1000 : 1,
    userSelect: 'none',
    transform: `rotate(${rotation}deg)`,
    outline: 'none'
  };

  return (
    <div
      ref={separatorRef}
      style={separatorStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      className="group transition-all duration-200"
      title="Separator - Drag to move, resize from right edge, or use arrow keys to move (Shift+Arrow for larger steps)"
    >
      {/* Resize handles */}
      <div
        className="absolute right-0 top-0 w-3 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 bg-blue-500 rounded-r transition-opacity duration-200"
        style={{ backgroundColor: '#3b82f6', zIndex: 10 }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsResizing(true);
        }}
      />
      
      {/* Hover indicator for main body */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 rounded transition-colors duration-200 pointer-events-none" />
      
      {/* Visual feedback when selected */}
      {(isDragging || isResizing) && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
          {isDragging ? 'Drag to move' : 'Drag to resize'}
        </div>
      )}
    </div>
  );
};

export default InteractiveSeparator;