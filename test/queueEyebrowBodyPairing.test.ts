import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape';
import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion';
import { getQueueListRows } from '../src/utils/queueListBody';

function getQueueEyebrowBodyPairingInput(
  input: Parameters<typeof getFlipCompletionSideIndex>[0],
): Parameters<typeof getFlipCompletionSideIndex>[0] {
  return input;
}

function assertQueueEyebrowBodyPairing(
  input: Parameters<typeof getFlipCompletionSideIndex>[0],
  expected: {
    label: (typeof seedTape.sides)[number]['label'];
    rowIds: Array<ReturnType<typeof getQueueListRows>[number]['id']>;
    activeRowIndex: number;
  },
) {
  const visibleSideIndex = getFlipCompletionSideIndex(input);
  const visibleSide = seedTape.sides[visibleSideIndex];
  const rows = getQueueListRows(visibleSide.tracks, expected.activeRowIndex);

  assert.equal(visibleSide.label, expected.label);
  assert.deepEqual(
    rows.map((row) => row.id),
    expected.rowIds,
  );
  assert.equal(rows[expected.activeRowIndex]?.isActive, true);
}

test('queue eyebrow label and body tracks stay paired on Side A until the flip settles on Side B', () => {
  assertQueueEyebrowBodyPairing(
    getQueueEyebrowBodyPairingInput({
      sideIndex: 1,
      isFlipping: true,
      pendingFlipSideIndex: 1,
    }),
    {
      label: 'Side A',
      rowIds: ['A1', 'A2', 'A3'],
      activeRowIndex: 1,
    },
  );
});

test('queue eyebrow label and body tracks move to Side B together once the flip settles on Side B', () => {
  assertQueueEyebrowBodyPairing(
    getQueueEyebrowBodyPairingInput({
      sideIndex: 1,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    {
      label: 'Side B',
      rowIds: ['B1', 'B2', 'B3'],
      activeRowIndex: 1,
    },
  );
});

test('queue eyebrow label and body tracks stay paired on Side B until the flip settles on Side A', () => {
  assertQueueEyebrowBodyPairing(
    getQueueEyebrowBodyPairingInput({
      sideIndex: 0,
      isFlipping: true,
      pendingFlipSideIndex: 0,
    }),
    {
      label: 'Side B',
      rowIds: ['B1', 'B2', 'B3'],
      activeRowIndex: 1,
    },
  );
});

test('queue eyebrow label and body tracks move to Side A together once the flip settles on Side A', () => {
  assertQueueEyebrowBodyPairing(
    getQueueEyebrowBodyPairingInput({
      sideIndex: 0,
      isFlipping: false,
      pendingFlipSideIndex: null,
    }),
    {
      label: 'Side A',
      rowIds: ['A1', 'A2', 'A3'],
      activeRowIndex: 1,
    },
  );
});
