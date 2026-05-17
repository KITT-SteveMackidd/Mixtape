import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueuePanelProps } from '../src/utils/queuePanel.ts';

test('queue panel keeps the Side B eyebrow and tracks paired until flip back completion finishes', () => {
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
