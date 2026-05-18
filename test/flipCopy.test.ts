import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCopySideIndex } from '../src/utils/flipCopy.ts';

function assertFlipCopySideIndex(
  input: Parameters<typeof getFlipCopySideIndex>[0],
  expected: number,
) {
  assert.equal(getFlipCopySideIndex(input), expected);
}

test('flip copy stays on Side B until the flip settles on Side B', () => {
  assertFlipCopySideIndex(
    {
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    },
    1,
  );

  assertFlipCopySideIndex(
    {
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    },
    1,
  );
});

test('flip copy stays on Side A until the flip settles on Side A', () => {
  assertFlipCopySideIndex(
    {
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    },
    0,
  );

  assertFlipCopySideIndex(
    {
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    },
    0,
  );
});

test('flip copy falls back to Side B when Side A is showing and no flip is pending', () => {
  assertFlipCopySideIndex(
    {
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    },
    1,
  );
});

test('flip copy falls back to Side A when Side B is showing and no flip is pending', () => {
  assertFlipCopySideIndex(
    {
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    },
    0,
  );
});
