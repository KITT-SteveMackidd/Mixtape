import assert from 'node:assert/strict';
import test from 'node:test';

import { getFlipMidpointSideIndex } from '../src/utils/flipMidpoint.ts';

test('side badge and next up stay on side A throughout a forward flip before the cassette midpoint', () => {
  assert.equal(
    getFlipMidpointSideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
      hasPassedFlipMidpoint: false,
    }),
    0,
  );
});

test('side badge and next up stay on side B throughout a reverse flip before the cassette midpoint', () => {
  assert.equal(
    getFlipMidpointSideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
      hasPassedFlipMidpoint: false,
    }),
    1,
  );
});

test('side badge and next up move to side B once a forward flip reaches the cassette midpoint', () => {
  assert.equal(
    getFlipMidpointSideIndex({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 1,
      hasPassedFlipMidpoint: true,
    }),
    1,
  );
});

test('side badge and next up move to side A once a reverse flip reaches the cassette midpoint', () => {
  assert.equal(
    getFlipMidpointSideIndex({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 0,
      hasPassedFlipMidpoint: true,
    }),
    0,
  );
});

test('side badge and next up follow the active side when no flip is pending', () => {
  assert.equal(
    getFlipMidpointSideIndex({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
      hasPassedFlipMidpoint: false,
    }),
    1,
  );
});
