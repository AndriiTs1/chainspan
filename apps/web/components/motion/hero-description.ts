export const heroDescriptionMotion = {
  initial: {
    opacity: 0,
    y: 22,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  transition: {
    delay: 0.25,
    duration: 0.7,
  },
} as const;
