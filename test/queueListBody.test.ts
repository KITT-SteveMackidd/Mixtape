import assert from 'node:assert/strict';
import test from 'node:test';

import { seedTape } from '../src/data/seedTape.ts';
import { getQueueListRows } from '../src/utils/queueListBody.ts';

function getSeedQueueListRows(
  input: {
    sideIndex: number;
    activeRowIndex: number;
  },
) {
  return getQueueListRows(seedTape.sides[input.sideIndex].tracks, input.activeRowIndex);
}

function assertQueueListRows(
  rows: ReturnType<typeof getQueueListRows>,
  expected: {
    rowIds: Array<ReturnType<typeof getQueueListRows>[number]['id']>;
    activeRowIndex: number;
    excludedSidePrefix: (typeof seedTape.sides)[number]['id'];
  },
) {
  assert.deepEqual(
    rows.map((row) => row.id),
    expected.rowIds,
  );
  assert.equal(rows[expected.activeRowIndex]?.isActive, true);
  assert.equal(
    rows.some((row) => row.id.startsWith(expected.excludedSidePrefix)),
    false,
  );
}

test('queue list body follows the active side when no flip is pending', () => {
  const rows = getSeedQueueListRows({
    sideIndex: 0,
    activeRowIndex: 1,
  });

  assertQueueListRows(rows, {
    rowIds: ['A1', 'A2', 'A3'],
    activeRowIndex: 1,
    excludedSidePrefix: 'B',
  });
});
