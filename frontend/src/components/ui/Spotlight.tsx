import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  type SpringOptions,
} from 'framer-motion';
import { cn } from '../../lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
};

/**
 * Cursor-tracking radial spotlight effect (sourced from 21st.dev ibelick/spotlight).
 * Automatically binds to its parent container and respects prefers-reduced-motion.
 */
export const Spotlight: React.FC<SpotlightProps> = ({
  className,
  size = 220,
  springOptions = { bounce: 0, stiffness: 280, damping: 32 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useSpring(0, springOptions);
  const mouseY = useSpring(0, springOptions);

  const spotlightLeft = useTransform(mouseX, (x) => `${x - size / 2}px`);
  const spotlightTop = useTransform(mouseY, (y) => `${y - size / 2}px`);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        if (!parent.style.position) {
          parent.style.position = 'relative';
        }
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement || shouldReduceMotion) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement, shouldReduceMotion]
  );

  useEffect(() => {
    if (!parentElement || shouldReduceMotion) return;

    const onEnter = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', onEnter);
    parentElement.addEventListener('mouseleave', onLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', onEnter);
      parentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [parentElement, handleMouseMove, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_75%)] blur-xl transition-opacity duration-300',
        'from-blue-500/15 via-blue-400/10 to-transparent dark:from-blue-400/20 dark:via-cyan-400/10 dark:to-transparent',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
      }}
    />
  );
};

export default Spotlight;
