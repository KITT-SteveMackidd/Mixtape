import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';
import { getQueueListRows } from '../src/utils/queueListBody.ts';

test('queue eyebrow label and body tracks stay paired on Side A throughout a forward flip', () => {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 1,
  });

  const visibleSide = seedTape.sides[visibleSideIndex];
  const rows = getQueueListRows(visibleSide.tracks, 1);

  assert.equal(visibleSide?.label, 'Side A');
  assert.deepEqual(
    rows.map((row) => row.id),
    ['A1', 'A2', 'A3'],
  );
  assert.equal(rows[1]?.isActive, true);
});

test('queue eyebrow label and body tracks land on Side B together once a forward flip completes', () => {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex: 1,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  const visibleSide = seedTape.sides[visibleSideIndex];
  const rows = getQueueListRows(visibleSide.tracks, 1);

  assert.equal(visibleSide?.label, 'Side B');
  assert.deepEqual(
    rows.map((row) => row.id),
    ['B1', 'B2', 'B3'],
  );
  assert.equal(rows[1]?.isActive, true);
});

test('queue eyebrow label and body tracks stay paired on Side B throughout a reverse flip', () => {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex: 0,
    isFlipping: true,
    pendingFlipSideIndex: 0,
  });

  const visibleSide = seedTape.sides[visibleSideIndex];
  const rows = getQueueListRows(visibleSide.tracks, 1);

  assert.equal(visibleSide?.label, 'Side B');
  assert.deepEqual(
    rows.map((row) => row.id),
    ['B1', 'B2', 'B3'],
  );
  assert.equal(rows[1]?.isActive, true);
});

test('queue eyebrow label and body tracks land back on Side A together once a reverse flip completes', () => {
  const visibleSideIndex = getFlipCompletionSideIndex({
    sideIndex: 0,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  const visibleSide = seedTape.sides[visibleSideIndex];
  const rows = getQueueListRows(visibleSide.tracks, 1);

  assert.equal(visibleSide?.label, 'Side A');
  assert.deepEqual(
    rows.map((row) => row.id),
    ['A1', 'A2', 'A3'],
  );
  assert.equal(rows[1]?.isActive, true);
});
