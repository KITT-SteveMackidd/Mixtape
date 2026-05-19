import type { Tape } from '../data/seedTape';
import { getFlipCompletionSideIndex } from './flipCompletion';
import { getQueueListRows } from './queueListBody';

export function getQueuePanelProps({
  tape,
  sideIndex,
  trackIndex,
  isFlipping,
  pendingFlipSideIndex,
}: {
  tape: Tape;
  sideIndex: number;
  trackIndex: number;
  isFlipping: boolean;
  pendingFlipSideIndex: number | null;
}) {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex,
    isFlipping,
    pendingFlipSideIndex,
  });
  const visibleSide = tape.sides[visibleSideIndex];

  return {
    eyebrow: `${visibleSide.label} queue`,
    rows: getQueueListRows(visibleSide.tracks, trackIndex),
  };
}
