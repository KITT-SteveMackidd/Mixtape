export function getFlipMidpointSideIndex({
  sideIndex,
  isFlipping,
  pendingFlipSideIndex,
  hasPassedFlipMidpoint,
}: {
  sideIndex: number;
  isFlipping: boolean;
  pendingFlipSideIndex: number | null;
  hasPassedFlipMidpoint: boolean;
}) {
  if (isFlipping && pendingFlipSideIndex !== null && hasPassedFlipMidpoint) {
    return pendingFlipSideIndex;
  }

  return sideIndex;
}
