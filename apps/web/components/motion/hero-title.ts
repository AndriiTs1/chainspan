export const heroTitleMotion = {
  initial: {
    opacity: 0,
    y: 28,
    scale: 0.96,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  transition: {
    delay: 0.12,
    duration: 0.8,
  },
} as const;
