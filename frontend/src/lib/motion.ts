import type { Variants, Transition } from 'framer-motion';

// Standardized Bezier Curves
export const easeOutQuad = [0.25, 1, 0.5, 1] as const;
export const easeInOutCubic = [0.65, 0, 0.35, 1] as const;
export const easeApple = [0.16, 1, 0.3, 1] as const;

// Transition presets
export const transitions = {
  fast: { duration: 0.18, ease: easeApple },
  normal: { duration: 0.3, ease: easeApple },
  smooth: { duration: 0.6, ease: easeApple },
  slow: { duration: 0.9, ease: easeApple },
} satisfies Record<string, Transition>;

// Reusable Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: easeApple,
      delay: custom * 0.1,
    },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeApple,
      delay: custom * 0.1,
    },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeApple,
      delay: custom * 0.08,
    },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeApple },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeApple },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easeInOutCubic,
    },
  },
};

export const reveal: Variants = {
  hidden: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: {
      duration: 0.6,
      ease: easeApple,
    },
  },
};
