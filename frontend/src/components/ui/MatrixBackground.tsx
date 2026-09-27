import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

// Cryptographic and digital integrity characters (alphanumeric, hex, Katakana, math symbols)
const MATRIX_CHARACTERS =
  '0123456789ABCDEF010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンλμσΩψΔΞ';

interface MatrixBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
  overlayOpacity?: number;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  density = 'medium',
  className = '',
  overlayOpacity = 0.85,
}) => {
  const columnCount = {
    low: 18,
    medium: 28,
    high: 38,
  }[density];

  // Pre-generate stable random column properties so they don't re-render unpredictably
  const columns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, index) => {
      // Deterministic staggered timing
      const duration = 3.2 + ((index * 0.43) % 2.5);
      const delay = -((index * 0.67) % 4.5);
      // Generate randomized slice of characters for natural variation
      const charOffset = (index * 7) % 20;
      const chars = (MATRIX_CHARACTERS.slice(charOffset) + MATRIX_CHARACTERS.slice(0, charOffset)).repeat(2);

      return {
        id: index,
        duration: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        chars,
      };
    });
  }, [columnCount]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden bg-[#050816]',
        className
      )}
    >
      {/* Dynamic directional fade masks for foreground contrast */}
      <div
        className="matrix-fade absolute inset-0 z-10"
        style={{ opacity: overlayOpacity }}
      />

      {/* Grid of matrix columns */}
      <div
        className="relative h-full w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        }}
      >
        {columns.map((col) => (
          <span
            key={col.id}
            className="matrix-column"
            style={{
              animationDuration: col.duration,
              animationDelay: col.delay,
            }}
          >
            {col.chars}
          </span>
        ))}
      </div>
    </div>
  );
};
