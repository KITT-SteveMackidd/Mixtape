import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getNowPlayingBodyCopy } from '../src/utils/nowPlayingBodyCopy.ts';

test('now playing body copy stays on Side A until the flip settles on Side B', () => {
  const bodyCopy = getNowPlayingBodyCopy({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 1,
  });

  assert.equal(bodyCopy.title, 'Rearview');
  assert.equal(bodyCopy.meta, 'Static Bloom • 04:08');
});

test('now playing body copy moves to Side B once the flip settles on Side B', () => {
  const bodyCopy = getNowPlayingBodyCopy({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
  });

  assert.equal(bodyCopy.title, 'Parking Lot Stars');
  assert.equal(bodyCopy.meta, 'Frame Drift • 04:21');
  assert.notEqual(bodyCopy.title, 'Rearview');
  assert.notEqual(bodyCopy.meta, 'Static Bloom • 04:08');
});

test('now playing body copy stays on Side B until the flip settles on Side A', () => {
  const bodyCopy = getNowPlayingBodyCopy({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 0,
  });

  assert.equal(bodyCopy.title, 'Parking Lot Stars');
  assert.equal(bodyCopy.meta, 'Frame Drift • 04:21');
});

test('now playing body copy moves to Side A once the flip settles on Side A', () => {
  const bodyCopy = getNowPlayingBodyCopy({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
  });

  assert.equal(bodyCopy.title, 'Rearview');
  assert.equal(bodyCopy.meta, 'Static Bloom • 04:08');
  assert.notEqual(bodyCopy.title, 'Parking Lot Stars');
  assert.notEqual(bodyCopy.meta, 'Frame Drift • 04:21');
});
