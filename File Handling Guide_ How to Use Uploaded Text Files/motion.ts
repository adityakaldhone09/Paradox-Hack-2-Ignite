import type { Variants } from 'framer-motion';

export const fadeIn: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } } };
export const fadeUp: Variants = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
export const fadeDown: Variants = { hidden: { opacity: 0, y: -18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
export const fadeLeft: Variants = { hidden: { opacity: 0, x: 18 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
export const fadeRight: Variants = { hidden: { opacity: 0, x: -18 }, visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
export const scaleIn: Variants = { hidden: { opacity: 0, scale: 0.96 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } } };
export const staggerContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
export const staggerItem: Variants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
export const slideIn: Variants = { hidden: { opacity: 0, x: 28 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
