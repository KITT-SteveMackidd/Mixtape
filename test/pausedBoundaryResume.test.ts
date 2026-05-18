import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumePausedBoundaryResumeAck,
  getPausedBoundaryResumeAckForInactivePlayback,
} from '../src/utils/pausedBoundaryResume.ts';

test('transport skip paths only prime forward or backward resume ack while paused', () => {
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'forward' }), 'forward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'backward' }), 'backward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: true, direction: 'forward' }), null);
});

test('scrub release only primes forward resume ack when paused at the tape edge', () => {
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'forward' }), 'forward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: true, direction: 'forward' }), null);
});

test('queue selection and flip completion resume consume the shared forward or backward paused-boundary rule', () => {
  assert.equal(
    consumePausedBoundaryResumeAck({
      isPausedAtTrackBoundary: true,
      queuedDirection: 'forward',
      trackIndex: 2,
      elapsedSeconds: 187,
    }),
    'forward',
  );

  assert.equal(
    consumePausedBoundaryResumeAck({
      isPausedAtTrackBoundary: true,
      queuedDirection: 'backward',
      trackIndex: 0,
      elapsedSeconds: 0,
    }),
    'backward',
  );

  assert.equal(
    consumePausedBoundaryResumeAck({
      isPausedAtTrackBoundary: true,
      queuedDirection: 'forward',
      trackIndex: 0,
      elapsedSeconds: 187,
    }),
    null,
  );
});
