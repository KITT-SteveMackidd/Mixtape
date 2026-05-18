import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueuePanelProps } from '../src/utils/queuePanel.ts';

test('queue panel keeps the Side A eyebrow and tracks paired throughout a forward flip', () => {
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

test('queue panel keeps the Side B eyebrow and tracks paired throughout a reverse flip', () => {
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

test('queue panel lands on Side B once a forward flip completes', () => {
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

test('queue panel lands back on Side A once a reverse flip completes', () => {
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
