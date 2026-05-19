import type { Tape } from '../data/seedTape';
import { getFlipCompletionSideIndex } from './flipCompletion';

export function getNowPlayingBodyCopy({
  tape,
  sideIndex,
  trackIndex,
  isFlipping = false,
  pendingFlipSideIndex = null,
}: {
  tape: Tape;
  sideIndex: number;
  trackIndex: number;
  isFlipping?: boolean;
  pendingFlipSideIndex?: number | null;
}) {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex,
    isFlipping,
    pendingFlipSideIndex,
  });
  const track = tape.sides[visibleSideIndex].tracks[trackIndex];

  return {
    title: track.title,
    meta: `${track.artist} • ${track.duration}`,
  };
}
