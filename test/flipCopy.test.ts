import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipCopySideIndex } from '../src/utils/flipCopy.ts';

test('flip copy stays on Side B while the flip is heading to Side B', () => {
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

test('flip copy stays on Side A while the flip is heading to Side A', () => {
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

test('flip copy falls back to Side B when Side A is showing and no flip is pending', () => {
  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    1,
  );
});

test('flip copy falls back to Side A when Side B is showing and no flip is pending', () => {
  assert.equal(
    getFlipCopySideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    0,
  );
});
