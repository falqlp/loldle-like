// src/store/solver.ts (ou où tu veux le mettre)

import type { Champion } from '../../data/champions';
import type { Clue } from '../types';
import { computeClues } from '../utils/clues';
import { CHAMPIONS } from '../../data/championsData.ts';

export type GuessEntry = {
  raw: string; // nom tapé / stocké
  clues: Clue[]; // feedback
};

function getChampionByName(name: string): Champion | undefined {
  const lower = name.toLowerCase();
  return CHAMPIONS.find(c => c.name.toLowerCase() === lower);
}

/**
 * Deux clues sont équivalents du point de vue du solver si :
 * - même field
 * - même status
 * - même direction (pour releaseYear)
 * On ne compare PAS value, car c’est toujours la valeur du guess.
 */
function sameCluePattern(a: Clue, b: Clue | undefined): boolean {
  if (!b) return false;
  if (a.status !== b.status) return false;

  // gestion du cas releaseYear avec direction
  const aDir = 'direction' in a ? a.direction : undefined;
  const bDir = 'direction' in b ? b.direction : undefined;

  if (aDir !== bDir) return false;

  return true;
}

/**
 * Construit une clé de pattern pour résumer un feedback.
 * On encode field + status + direction éventuelle.
 */
function patternKey(clues: Clue[]): string {
  return clues
    .map(c => {
      const dir = 'direction' in c && c.direction ? c.direction : 'none';
      return `${String(c.field)}:${c.status}:${dir}`;
    })
    .join('|');
}

/**
 * Vérifie si un champion hypothétique `candidate` est compatible
 * avec un guess (raw + clues) déjà joué.
 */
function isCandidateCompatibleWithGuess(candidate: Champion, guessEntry: GuessEntry): boolean {
  const guessChamp = getChampionByName(guessEntry.raw);
  if (!guessChamp) {
    // sécurité au cas où, normalement ça ne devrait pas arriver
    return true;
  }

  const simulated = computeClues(candidate, guessChamp);

  return guessEntry.clues.every(fb => {
    const sim = simulated.find(c => c.field === fb.field);
    return sameCluePattern(fb, sim);
  });
}

/**
 * À partir de l’historique, reconstruit les champions encore possibles.
 */
export function buildRemainingCandidates(guesses: GuessEntry[]): Champion[] {
  if (guesses.length === 0) return [...CHAMPIONS];

  return CHAMPIONS.filter(c => guesses.every(g => isCandidateCompatibleWithGuess(c, g)));
}

/**
 * Calcule le score (taille moyenne des partitions) pour un guess donné.
 * Plus le score est petit, plus le guess est informatif.
 */
function expectedPartitionSize(remaining: Champion[], guess: Champion): number {
  const counts = new Map<string, number>();

  for (const ans of remaining) {
    const clues = computeClues(ans, guess);
    const key = patternKey(clues);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const n = remaining.length;
  let sumSq = 0;
  for (const count of counts.values()) {
    sumSq += count * count;
  }
  return sumSq / n;
}

/**
 * Choisit le meilleur prochain guess.
 */
export function chooseBestNextGuess(
  remaining: Champion[],
  possibleGuesses: Champion[] = CHAMPIONS,
): Champion | null {
  if (remaining.length === 0) return null;
  if (remaining.length === 1) return remaining[0];

  let best: Champion | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const g of possibleGuesses) {
    const score = expectedPartitionSize(remaining, g);
    if (score < bestScore) {
      bestScore = score;
      best = g;
    }
  }

  return best;
}

/**
 * Helper haut niveau : à partir de l’historique de guesses (ton state),
 * renvoie { remaining, suggestion }.
 */
export function suggestFromHistory(guesses: GuessEntry[]): {
  remaining: Champion[];
  suggestion: Champion | null;
} {
  const remaining = buildRemainingCandidates(guesses);
  const suggestion = chooseBestNextGuess(remaining, CHAMPIONS);
  return { remaining, suggestion };
}
