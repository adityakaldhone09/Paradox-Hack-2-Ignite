import type { Variants, Transition } from 'framer-motion';

// Standardized Bezier Curves
export const easeOutQuad = [0.25, 1, 0.5, 1] as const;
export const easeInOutCubic = [0.65, 0, 0.35, 1] as const;
export const easeApple = [0.16, 1, 0.3, 1] as const;
export const easeArrowExpand = [0.65, 0, 0.076, 1] as const;

// Central Motion Configuration Tokens (Sections 27, 29)
export const motionConfig = {
  fast: 0.15,
  normal: 0.25,
  smooth: 0.4,
  slow: 0.7,
  hover: {
    y: -2,
    scale: 1.01,
  },
  tap: {
    scale: 0.98,
  },
};

// Shorthand motion config alias as requested in prompt Section 3
export const motionTokens = {
  fast: {
    duration: 0.15,
    ease: easeApple,
  },
  normal: {
    duration: 0.25,
    ease: easeApple,
  },
  smooth: {
    duration: 0.4,
    ease: easeApple,
  },
  hover: {
    y: -2,
    scale: 1.01,
  },
};

// Transition presets
export const transitions = {
  fast: { duration: 0.15, ease: easeApple },
  normal: { duration: 0.25, ease: easeApple },
  smooth: { duration: 0.4, ease: easeApple },
  slow: { duration: 0.7, ease: easeApple },
} satisfies Record<string, Transition>;

// Reusable Variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: easeApple,
      delay: custom * 0.08,
    },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: easeApple,
      delay: custom * 0.08,
    },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easeApple,
      delay: custom * 0.06,
    },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeApple },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeApple },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.7,
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
      duration: 0.5,
      ease: easeApple,
    },
  },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeApple } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};
