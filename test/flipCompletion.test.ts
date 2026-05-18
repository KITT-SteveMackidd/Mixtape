import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';

function getFlipCompletionInput(
  input: Parameters<typeof getFlipCompletionSideIndex>[0],
): Parameters<typeof getFlipCompletionSideIndex>[0] {
  return input;
}

function assertFlipCompletionSideIndex(
  input: Parameters<typeof getFlipCompletionSideIndex>[0],
  expected: number,
) {
  assert.equal(getFlipCompletionSideIndex(input), expected);
}

test('queue header and reel caption stay on Side A until the flip settles on Side B', () => {
  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    0,
  );

  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    0,
  );
});

test('queue header and reel caption stay on Side B until the flip settles on Side A', () => {
  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    1,
  );

  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    1,
  );
});

test('queue header and reel caption move to Side B once the flip settles on Side B', () => {
  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );
});

test('queue header and reel caption move to Side A once the flip settles on Side A', () => {
  assertFlipCompletionSideIndex(
    getFlipCompletionInput({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
