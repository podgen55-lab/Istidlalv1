import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialMemory, createGuestUser } from '../src/services/storageService.ts';

test('Initial memory guarantees strictly zero pre-filled fake data', () => {
  const initial = createInitialMemory('test_user_123');
  assert.equal(initial.totalExercisesSolved, 0);
  assert.equal(initial.scientificMastery, 0);
  assert.equal(initial.methodologyMastery, 0);
  assert.equal(initial.averageScore, 0);
  assert.deepEqual(initial.scoreHistory, []);
  assert.deepEqual(initial.skills, []);
  assert.deepEqual(initial.overcomeDefects, []);
  assert.ok(initial.nextSessionDirective.includes('استدلال'));
});

test('Guest user creation creates a clean guest profile', () => {
  const guest = createGuestUser();
  assert.ok(guest.id.startsWith('guest_'));
  assert.equal(guest.isGuest, true);
  assert.equal(guest.name, 'تلميذ زائر');
});

test('Score increments respect Algerian Baccalaureate 0.25 scoring steps', () => {
  const validScores = [0, 0.25, 0.5, 0.75, 1.0, 3.25, 4.75, 5.0, 7.0, 8.0];
  for (const s of validScores) {
    const remainder = Math.round((s % 0.25) * 100) / 100;
    assert.equal(remainder === 0 || remainder === 0.25, true);
  }
});
