import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';

test('queue header and reel caption stay on Side A until forward flip completion finishes', () => {
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

test('queue header and reel caption stay on Side B until reverse flip completion finishes', () => {
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

test('queue header and reel caption settle onto Side B after forward flip completion', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );
});

test('queue header and reel caption settle back onto Side A after reverse flip completion', () => {
  assert.equal(
    getFlipCompletionSideIndex({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
