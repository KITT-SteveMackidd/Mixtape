import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumePausedBoundaryResumeAck,
  getPausedBoundaryResumeAckForInactivePlayback,
} from '../src/utils/pausedBoundaryResume';

test('transport skip paths only prime a paused-boundary resume ack when playback is inactive', () => {
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'forward' }), 'forward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'backward' }), 'backward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: true, direction: 'forward' }), null);
});

test('scrub release only primes a paused-boundary resume ack at the tape edge when playback is inactive', () => {
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: false, direction: 'forward' }), 'forward');
  assert.equal(getPausedBoundaryResumeAckForInactivePlayback({ isPlaying: true, direction: 'forward' }), null);
});

test('queue selection and flip completion resume share the same paused-boundary ack consumption rule', () => {
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
