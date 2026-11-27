/**
 * Mutable scroll state shared between the DOM layer (GSAP ScrollTrigger)
 * and the R3F render loop (useFrame).  Avoids React re-renders.
 */
export const scrollState = { progress: 0 };
