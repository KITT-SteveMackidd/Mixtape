import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';

test('queue header and reel caption stay on Side A throughout a forward flip', () => {
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

test('queue header and reel caption stay on Side B throughout a reverse flip', () => {
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

test('queue header and reel caption lands on Side B once a forward flip completes', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );
});

test('queue header and reel caption lands back on Side A once a reverse flip completes', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
