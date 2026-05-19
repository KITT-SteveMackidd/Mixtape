import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape';
import { getNowPlayingBodyCopy } from '../src/utils/nowPlayingBodyCopy';

function getSeedNowPlayingBodyCopyInput(
  input: Omit<Parameters<typeof getNowPlayingBodyCopy>[0], 'tape'>,
): Omit<Parameters<typeof getNowPlayingBodyCopy>[0], 'tape'> {
  return input;
}

function assertNowPlayingBodyCopy(
  input: Omit<Parameters<typeof getNowPlayingBodyCopy>[0], 'tape'>,
  expected: ReturnType<typeof getNowPlayingBodyCopy>,
) {
  assert.deepEqual(
    getNowPlayingBodyCopy({
      tape: seedTape,
      ...input,
    }),
    expected,
  );
}

test('now playing body copy stays on Side A until the flip settles on Side B', () => {
  assertNowPlayingBodyCopy(
    getSeedNowPlayingBodyCopyInput({
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
    getSeedNowPlayingBodyCopyInput({
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
    getSeedNowPlayingBodyCopyInput({
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
    getSeedNowPlayingBodyCopyInput({
      sideIndex: 0,
      trackIndex: 1,
    }),
    {
      title: 'Rearview',
      meta: 'Static Bloom • 04:08',
    },
  );
});
