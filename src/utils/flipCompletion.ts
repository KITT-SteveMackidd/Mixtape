export function getFlipCompletionSideIndex({
  sideIndex,
  isFlipping,
  pendingFlipSideIndex,
}: {
  sideIndex: number;
  isFlipping: boolean;
  pendingFlipSideIndex: number | null;
}) {
  if (isFlipping && pendingFlipSideIndex !== null) {
    return pendingFlipSideIndex === 0 ? 1 : 0;
  }

  return sideIndex;
}
