import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipMidpointSideIndex } from '../src/utils/flipMidpoint.ts';

function assertFlipMidpointSideIndex(
  input: Parameters<typeof getFlipMidpointSideIndex>[0],
  expected: number,
) {
  assert.equal(getFlipMidpointSideIndex(input), expected);
}

test('side badge and next up stay on Side A until the flip reaches the cassette midpoint on the way to Side B', () => {
  assertFlipMidpointSideIndex(
    {
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
      hasPassedFlipMidpoint: false,
    },
    0,
  );
});

test('side badge and next up stay on Side B until the flip reaches the cassette midpoint on the way to Side A', () => {
  assertFlipMidpointSideIndex(
    {
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
      hasPassedFlipMidpoint: false,
    },
    1,
  );
});

test('side badge and next up move to Side B once the flip reaches the cassette midpoint on the way to Side B', () => {
  assertFlipMidpointSideIndex(
    {
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
      hasPassedFlipMidpoint: true,
    },
    1,
  );
});

test('side badge and next up move to Side A once the flip reaches the cassette midpoint on the way to Side A', () => {
  assertFlipMidpointSideIndex(
    {
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
      hasPassedFlipMidpoint: true,
    },
    0,
  );
});

test('side badge and next up follow the active side when no flip is pending', () => {
  assertFlipMidpointSideIndex(
    {
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
      hasPassedFlipMidpoint: false,
    },
    1,
  );
});
