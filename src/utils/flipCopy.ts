export function getFlipCopySideIndex({
  sideIndex,
  isFlipping,
  pendingFlipSideIndex,
}: {
  sideIndex: number;
  isFlipping: boolean;
  pendingFlipSideIndex: number | null;
}) {
  if (isFlipping && pendingFlipSideIndex !== null) {
    return pendingFlipSideIndex;
  }

  return sideIndex === 0 ? 1 : 0;
}
