/**
 * Storage Service for ISTIDLAL platform
 * Handles user isolation, persistence, guest-to-account migrations
 * Rule: Zero pre-filled fake data! Fresh accounts start with 0 solved exercises.
 * إعداد: فنكوح عبد الرحيم
 */

import { User, PedagogicalMemory, SavedExerciseAttempt } from '../types';

const USER_SESSION_KEY = 'istidlal_current_user';
const MEMORY_PREFIX = 'istidlal_memory_';
const ATTEMPTS_PREFIX = 'istidlal_attempts_';

export function createInitialMemory(userId: string): PedagogicalMemory {
  return {
    userId,
    totalExercisesSolved: 0,
    scientificMastery: 0,
    methodologyMastery: 0,
    averageScore: 0,
    scoreHistory: [],
    skills: [],
    overcomeDefects: [],
    nextSessionDirective: 'أهلاً بك في منصة استدلال! صوّر تمرينك الأول لنبدأ معاً رحلة بناء الاستدلال العلمي خطوة بخطوة.',
    lastUpdated: new Date().toISOString(),
  };
}

export function createGuestUser(): User {
  const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
  return {
    id: guestId,
    name: 'تلميذ زائر',
    email: 'guest@istidlal.edu.dz',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };
}

export const StorageService = {
  getCurrentUser(): User {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // Fallback to guest
      }
    }
    const guest = createGuestUser();
    this.setCurrentUser(guest);
    return guest;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  },

  logoutUser(): User {
    const newGuest = createGuestUser();
    this.setCurrentUser(newGuest);
    return newGuest;
  },

  getPedagogicalMemory(userId: string): PedagogicalMemory {
    const raw = localStorage.getItem(MEMORY_PREFIX + userId);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error parsing memory for user', userId, e);
      }
    }
    // Strict zero fake data: return clean initial memory
    const initial = createInitialMemory(userId);
    this.savePedagogicalMemory(userId, initial);
    return initial;
  },

  savePedagogicalMemory(userId: string, memory: PedagogicalMemory): void {
    memory.lastUpdated = new Date().toISOString();
    localStorage.setItem(MEMORY_PREFIX + userId, JSON.stringify(memory));
  },

  getSavedAttempts(userId: string): SavedExerciseAttempt[] {
    const raw = localStorage.getItem(ATTEMPTS_PREFIX + userId);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error('Error parsing attempts for user', userId, e);
      }
    }
    return [];
  },

  saveAttempt(userId: string, attempt: SavedExerciseAttempt): void {
    const attempts = this.getSavedAttempts(userId);
    // Add to beginning of list
    const updated = [attempt, ...attempts.filter((a) => a.id !== attempt.id)];
    localStorage.setItem(ATTEMPTS_PREFIX + userId, JSON.stringify(updated));

    // Update memory statistics
    const memory = this.getPedagogicalMemory(userId);
    memory.totalExercisesSolved = updated.length;
    
    // Calculate average score percentage
    const totalPercentage = updated.reduce((acc, curr) => {
      const percentage = (curr.gradingResult.awardedScore / curr.gradingResult.maxScore) * 100;
      return acc + percentage;
    }, 0);
    memory.averageScore = Math.round(totalPercentage / updated.length);

    // Update score history
    memory.scoreHistory.push({
      date: attempt.date,
      score: attempt.gradingResult.awardedScore,
      maxScore: attempt.gradingResult.maxScore,
      title: attempt.visionData.title,
      exerciseType: attempt.visionData.exerciseTypeLabel,
    });

    // Update with memoryUpdate from grading
    if (attempt.gradingResult.memoryUpdate) {
      const update = attempt.gradingResult.memoryUpdate;
      memory.scientificMastery = update.scientificMastery;
      memory.methodologyMastery = update.methodologyMastery;
      memory.nextSessionDirective = update.nextSessionDirective;

      if (update.overcomeDefectsAdded && update.overcomeDefectsAdded.length > 0) {
        memory.overcomeDefects = Array.from(new Set([...memory.overcomeDefects, ...update.overcomeDefectsAdded]));
      }

      // Merge skills
      if (update.skillsUpdated && update.skillsUpdated.length > 0) {
        const existingMap = new Map(memory.skills.map((s) => [s.id, s]));
        for (const skill of update.skillsUpdated) {
          const prev = existingMap.get(skill.id);
          if (prev) {
            existingMap.set(skill.id, {
              ...skill,
              evidenceCount: prev.evidenceCount + 1,
            });
          } else {
            existingMap.set(skill.id, skill);
          }
        }
        memory.skills = Array.from(existingMap.values());
      }
    }

    this.savePedagogicalMemory(userId, memory);
  },

  migrateGuestDataToUser(guestId: string, newUser: User): void {
    const guestAttempts = this.getSavedAttempts(guestId);
    const guestMemory = this.getPedagogicalMemory(guestId);

    if (guestAttempts.length > 0) {
      const existingUserAttempts = this.getSavedAttempts(newUser.id);
      const mergedAttempts = [...guestAttempts, ...existingUserAttempts];
      localStorage.setItem(ATTEMPTS_PREFIX + newUser.id, JSON.stringify(mergedAttempts));
      
      // Update memory for new user
      guestMemory.userId = newUser.id;
      this.savePedagogicalMemory(newUser.id, guestMemory);
      
      // Clean guest data
      localStorage.removeItem(ATTEMPTS_PREFIX + guestId);
      localStorage.removeItem(MEMORY_PREFIX + guestId);
    }

    this.setCurrentUser(newUser);
  },

  clearUserData(userId: string): void {
    localStorage.removeItem(MEMORY_PREFIX + userId);
    localStorage.removeItem(ATTEMPTS_PREFIX + userId);
  },
};
