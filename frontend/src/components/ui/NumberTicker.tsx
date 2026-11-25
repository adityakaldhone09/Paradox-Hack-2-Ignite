import React, { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Smooth spring-driven numeric counter with tabular-nums alignment and reduced-motion fallback.
 */
export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  decimalPlaces = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const initialValue = direction === 'down' ? value : 0;
  const motionValue = useMotionValue(shouldReduceMotion ? value : initialValue);
  const springValue = useSpring(motionValue, {
    damping: 32,
    stiffness: 180,
    mass: 0.8,
  });

  const [display, setDisplay] = useState<string>(() =>
    Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(shouldReduceMotion ? value : initialValue)
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(
        Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(value)
      );
      return;
    }

    if (!isInView) return;

    const timer = window.setTimeout(() => {
      motionValue.set(direction === 'down' ? 0 : value);
    }, delay * 1000);

    return () => window.clearTimeout(timer);
  }, [isInView, value, direction, delay, motionValue, shouldReduceMotion, decimalPlaces]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const unsubscribe = springValue.on('change', (latest) => {
      setDisplay(
        Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)))
      );
    });

    return () => unsubscribe();
  }, [springValue, decimalPlaces, shouldReduceMotion]);

  return (
    <span
      ref={ref}
      className={cn('inline-block tabular-nums tracking-tight', className)}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default NumberTicker;
