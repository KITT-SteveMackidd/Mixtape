import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCopySideIndex } from '../src/utils/flipCopy.ts';

test('flip copy stays locked to Side B during a forward flip through the mid-flip timeout window', () => {
  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    1,
  );

  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    1,
  );
});

test('flip copy stays locked to Side A during a reverse flip through the mid-flip timeout window', () => {
  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    0,
  );

  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    0,
  );
});

test('flip copy falls back to the opposite side when no flip is pending', () => {
  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );

  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
