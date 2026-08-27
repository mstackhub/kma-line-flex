'use client';

import React, { useRef, useState, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface DraggableScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function DraggableScrollContainer({
  children,
  className,
}: DraggableScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDown(true);
    setHasDragged(false);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        'flex gap-2.5 overflow-x-auto pb-2 select-none line-chat-scroll',
        isDown ? 'cursor-grabbing select-none' : 'cursor-grab',
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-x pan-y',
      }}
    >
      {/* Pass down hasDragged context or render children */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<any>, {
          onClick: (e: any) => {
            if (hasDragged) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            if (child.props.onClick) {
              child.props.onClick(e);
            }
          },
        });
      })}
    </div>
  );
}
