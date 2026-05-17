import type { Tape } from '../data/seedTape.ts';

export function getNowPlayingBodyCopy({
  tape,
  sideIndex,
  trackIndex,
}: {
  tape: Tape;
  sideIndex: number;
  trackIndex: number;
}) {
  const track = tape.sides[sideIndex].tracks[trackIndex];

  return {
    title: track.title,
    meta: `${track.artist} • ${track.duration}`,
  };
}
