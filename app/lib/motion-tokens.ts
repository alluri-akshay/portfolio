// Seconds and bounded travel. Each animated layer has one motion owner.
export const motionTokens = {
  duration: { feedback: 0.14, navigation: 0.22, exit: 0.16, quiet: 0.4, entrance: 0.56, hero: 0.72, page: 0.42, handoff: 0.16, theme: 0.18 },
  easeOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
  spring: { stiffness: 160, damping: 24 },
  scrollSpring: { stiffness: 180, damping: 30 },
  entrance: { distance: 16, quietDistance: 6, amount: 0.12, maxDelay: 0.18 },
  page: { distance: 12, maxDelay: 0.16 },
  hero: { distance: 12, delays: [0, 0.08, 0.24, 0.24], lineDelay: 0.08, lineStagger: 0.1, lineRise: "20%" },
  magnetic: { x: 4, y: 3 },
  depth: { surfaceTilt: 1.5, surfaceLift: 4, previewTilt: 4, previewLift: 8, previewRestX: 3, previewRestY: -5, workflowStep: 6, heroUnfold: 0.9, heroStagger: 0.12, spring: { stiffness: 260, damping: 32 } },
  highlight: { size: 180, spring: { stiffness: 280, damping: 35 } },
  cursor: { spring: { stiffness: 700, damping: 50, mass: 0.6 } },
  preview: { tilt: 3, lift: 6, arrowTravel: 3, parallax: 3, scale: 1.08 },
  camera: { pointerAngle: 4, distance: 7.2, scrollTravel: 1.2, maxDpr: 1.5, settleSpeed: 8, backWidth: 5, frontWidth: 4.2, cornerRadius: .22 },
  lighting: {
    light: { ambient: 1.2, key: 1.8, edge: 0.6 },
    dark: { ambient: 0.9, key: 1.4, edge: 0.8 },
  },
  choreography: {
    heading: { duration: 0.52, distance: 12 },
    visual: { duration: 0.56, distance: 12 },
    experience: { duration: 0.48, distance: 6 },
    contact: { duration: 0.44, distance: 6 },
    reading: { duration: 0.32, distance: 4 },
    workflow: { duration: 0.42, distance: 6, stagger: 0.08 },
  },
} as const;
