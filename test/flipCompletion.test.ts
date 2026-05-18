import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';

test('queue header and reel caption stay on Side A while the flip is heading to Side B', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    0,
  );

  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    0,
  );
});

test('queue header and reel caption stay on Side B while the flip is heading to Side A', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    1,
  );

  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    1,
  );
});

test('queue header and reel caption moves to Side B once the flip finishes on Side B', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );
});

test('queue header and reel caption moves to Side A once the flip finishes on Side A', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
