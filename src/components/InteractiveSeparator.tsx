import React, { useState, useRef, useCallback } from 'react';
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
  const separatorRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = separatorRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isNearRightEdge = e.clientX > rect.right - 10;
    
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

  const separatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${decoration.position.x}px`,
    top: `${decoration.position.y}px`,
    width: `${decoration.size.width}px`,
    height: `${decoration.size.height}px`,
    backgroundColor: decoration.properties?.color || '#000000',
    opacity: decoration.properties?.opacity || 1,
    cursor: isDragging ? 'grabbing' : 'grab',
    border: isDragging || isResizing ? '2px dashed #3b82f6' : 'none',
    borderRadius: '2px',
    zIndex: isDragging || isResizing ? 1000 : 1,
  };

  return (
    <div
      ref={separatorRef}
      style={separatorStyle}
      onMouseDown={handleMouseDown}
      className="group transition-all duration-200"
    >
      {/* Resize handles */}
      <div
        className="absolute -right-1 top-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-100 bg-blue-500 rounded-r"
        style={{ backgroundColor: '#3b82f6' }}
      />
      
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