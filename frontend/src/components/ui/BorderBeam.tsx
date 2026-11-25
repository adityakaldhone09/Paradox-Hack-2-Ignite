import React from 'react';
import { cn } from '../../lib/utils';

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

/**
 * Animated light beam that travels smoothly along the perimeter of its parent container.
 * Uses CSS mask-composite and GPU-accelerated offset-distance; disabled under reduced-motion.
 */
export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 180,
  duration = 8,
  delay = 0,
  colorFrom = '#2563EB',
  colorTo = '#22D3EE',
  borderWidth = 1.5,
}) => {
  return (
    <div
      aria-hidden="true"
      style={
        {
          '--beam-size': size,
          '--beam-duration': `${duration}s`,
          '--beam-delay': `-${delay}s`,
          '--beam-color-from': colorFrom,
          '--beam-color-to': colorTo,
          '--beam-border-width': `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:var(--beam-border-width)_solid_transparent]',
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        'after:absolute after:aspect-square after:w-[calc(var(--beam-size)*1px)] after:animate-border-beam',
        'after:[animation-delay:var(--beam-delay)]',
        'after:[background:linear-gradient(to_left,var(--beam-color-from),var(--beam-color-to),transparent)]',
        'after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--beam-size)*1px))]',
        className
      )}
    />
  );
};

export default BorderBeam;
