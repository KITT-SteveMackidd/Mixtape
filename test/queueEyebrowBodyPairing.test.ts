import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getFlipCompletionSideIndex } from '../src/utils/flipCompletion.ts';
import { getQueueListRows } from '../src/utils/queueListBody.ts';

test('queue eyebrow label and body tracks stay paired on the current side until flip completion', () => {
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
