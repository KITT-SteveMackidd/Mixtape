import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getNowPlayingBodyCopy } from '../src/utils/nowPlayingBodyCopy.ts';

function getNowPlayingBodyCopyInput(
  input: Parameters<typeof getNowPlayingBodyCopy>[0],
): Parameters<typeof getNowPlayingBodyCopy>[0] {
  return input;
}

function assertNowPlayingBodyCopy(
  input: Parameters<typeof getNowPlayingBodyCopy>[0],
  expected: ReturnType<typeof getNowPlayingBodyCopy>,
) {
  assert.deepEqual(getNowPlayingBodyCopy(input), expected);
}

test('now playing body copy stays on Side A until the flip settles on Side B', () => {
  assertNowPlayingBodyCopy(
    getNowPlayingBodyCopyInput({
      tape: seedTape,
      sideIndex: 1,
      trackIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    {
      title: 'Rearview',
      meta: 'Static Bloom • 04:08',
    },
  );
});

test('now playing body copy moves to Side B once the flip settles on Side B', () => {
  assertNowPlayingBodyCopy(
    getNowPlayingBodyCopyInput({
      tape: seedTape,
      sideIndex: 1,
      trackIndex: 1,
    }),
    {
      title: 'Parking Lot Stars',
      meta: 'Frame Drift • 04:21',
    },
  );
});

test('now playing body copy stays on Side B until the flip settles on Side A', () => {
  assertNowPlayingBodyCopy(
    getNowPlayingBodyCopyInput({
      tape: seedTape,
      sideIndex: 0,
      trackIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    {
      title: 'Parking Lot Stars',
      meta: 'Frame Drift • 04:21',
    },
  );
});

test('now playing body copy moves to Side A once the flip settles on Side A', () => {
  assertNowPlayingBodyCopy(
    getNowPlayingBodyCopyInput({
      tape: seedTape,
      sideIndex: 0,
      trackIndex: 1,
    }),
    {
      title: 'Rearview',
      meta: 'Static Bloom • 04:08',
    },
  );
});
