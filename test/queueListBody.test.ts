import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueueListRows } from '../src/utils/queueListBody.ts';

test('queue list body follows the active side when no flip is pending', () => {
  const rows = getQueueListRows(seedTape.sides[0].tracks, 1);

  assert.deepEqual(
    rows.map((row) => row.id),
    ['A1', 'A2', 'A3'],
  );
  assert.equal(rows[1]?.isActive, true);
  assert.equal(rows.some((row) => row.id.startsWith('B')), false);
});
