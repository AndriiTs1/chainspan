export const heroActionsMotion = {
  initial: {
    opacity: 0,
    y: 22,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    delay: 0.38,
    duration: 0.7,
  },
} as const;
