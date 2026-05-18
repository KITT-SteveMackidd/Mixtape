import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueuePanelProps } from '../src/utils/queuePanel.ts';

function assertQueuePanel(
  queuePanel: ReturnType<typeof getQueuePanelProps>,
  expected: {
    eyebrow: `${(typeof seedTape.sides)[number]['label']} queue`;
    rowIds: Array<ReturnType<typeof getQueuePanelProps>['rows'][number]['id']>;
    activeRowIndex: number;
  },
) {
  assert.equal(queuePanel.eyebrow, expected.eyebrow);
  assert.deepEqual(
    queuePanel.rows.map((row) => row.id),
    expected.rowIds,
  );
  assert.equal(queuePanel.rows[expected.activeRowIndex]?.isActive, true);
}

test('queue panel stays on Side A until the flip settles on Side B', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 1,
  });

  assertQueuePanel(queuePanel, {
    eyebrow: 'Side A queue',
    rowIds: ['A1', 'A2', 'A3'],
    activeRowIndex: 1,
  });
});

test('queue panel stays on Side B until the flip settles on Side A', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
    isFlipping: true,
    pendingFlipSideIndex: 0,
  });

  assertQueuePanel(queuePanel, {
    eyebrow: 'Side B queue',
    rowIds: ['B1', 'B2', 'B3'],
    activeRowIndex: 1,
  });
});

test('queue panel moves to Side B once the flip settles on Side B', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 1,
    trackIndex: 1,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  assertQueuePanel(queuePanel, {
    eyebrow: 'Side B queue',
    rowIds: ['B1', 'B2', 'B3'],
    activeRowIndex: 1,
  });
});

test('queue panel moves to Side A once the flip settles on Side A', () => {
  const queuePanel = getQueuePanelProps({
    tape: seedTape,
    sideIndex: 0,
    trackIndex: 1,
    isFlipping: false,
    pendingFlipSideIndex: null,
  });

  assertQueuePanel(queuePanel, {
    eyebrow: 'Side A queue',
    rowIds: ['A1', 'A2', 'A3'],
    activeRowIndex: 1,
  });
});
