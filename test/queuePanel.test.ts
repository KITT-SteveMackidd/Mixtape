import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueuePanelProps } from '../src/utils/queuePanel.ts';

test('queue panel stays on Side A until the flip settles on Side B', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 1,
  });

  assert.equal(queuePanel.eyebrow, 'Side A queue');
  assert.deepEqual(
    queuePanel.rows.map((row) => row.id),
    ['A1', 'A2', 'A3'],
  );
  assert.equal(queuePanel.rows[1]?.isActive, true);
});

test('queue panel stays on Side B until the flip settles on Side A', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 0,
  });

  assert.equal(queuePanel.eyebrow, 'Side B queue');
  assert.deepEqual(
    queuePanel.rows.map((row) => row.id),
    ['B1', 'B2', 'B3'],
  );
  assert.equal(queuePanel.rows[1]?.isActive, true);
});

test('queue panel moves to Side B once the flip settles on Side B', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  assert.equal(queuePanel.eyebrow, 'Side B queue');
  assert.deepEqual(
    queuePanel.rows.map((row) => row.id),
    ['B1', 'B2', 'B3'],
  );
  assert.equal(queuePanel.rows[1]?.isActive, true);
});

test('queue panel moves to Side A once the flip settles on Side A', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  assert.equal(queuePanel.eyebrow, 'Side A queue');
  assert.deepEqual(
    queuePanel.rows.map((row) => row.id),
    ['A1', 'A2', 'A3'],
  );
  assert.equal(queuePanel.rows[1]?.isActive, true);
});
