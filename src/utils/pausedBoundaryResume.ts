export type PausedBoundaryResumeDirection = 'backward' | 'forward';

type GetPausedBoundaryResumeAckForInactivePlaybackArgs = {
  isPlaying: boolean;
  direction: PausedBoundaryResumeDirection;
};

type ConsumePausedBoundaryResumeAckArgs = {
  isPausedAtTrackBoundary: boolean;
  queuedDirection: PausedBoundaryResumeDirection | null;
  trackIndex: number;
  elapsedSeconds: number;
};

export function getPausedBoundaryResumeAckForInactivePlayback({
  isPlaying,
  direction,
}: GetPausedBoundaryResumeAckForInactivePlaybackArgs): PausedBoundaryResumeDirection | null {
  return !isPlaying ? direction : null;
}

export function consumePausedBoundaryResumeAck({
  isPausedAtTrackBoundary,
  queuedDirection,
  trackIndex,
  elapsedSeconds,
}: ConsumePausedBoundaryResumeAckArgs): PausedBoundaryResumeDirection | null {
  return isPausedAtTrackBoundary && queuedDirection && (trackIndex !== 0 || elapsedSeconds === 0) ? queuedDirection : null;
}
