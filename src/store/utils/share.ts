import type { Champion } from '../../data/champions';
import type { Guess } from '../types';

function squareForStatus(status: 'correct' | 'close' | 'wrong'): string {
  switch (status) {
    case 'correct':
      return '🟩';
    case 'close':
      return '🟨';
    default:
      return '🟥';
  }
}

export function buildShareGridRows(guesses: Guess[]): string[] {
  // Use squares for: name, gender, roles, species, resource, rangeType, regions
  const squareFields: (keyof Champion)[] = [
    'name',
    'gender',
    'roles',
    'species',
    'resource',
    'rangeType',
    'regions',
  ];
  const list = [...guesses].reverse();
  return list.map(g => {
    const parts: string[] = [];
    for (const f of squareFields) {
      const c = g.clues.find(cc => cc.field === f);
      parts.push(squareForStatus(c?.status ?? 'wrong'));
    }
    // Year as arrow hint (no symbol if correct)
    const year = g.clues.find(cc => cc.field === 'releaseYear');
    if (year) {
      if (year.status === 'wrong') {
        parts.push(year.direction === 'older' ? '⬇️' : '⬆️');
      } else {
        parts.push('🟩');
      }
    }
    return parts.join('');
  });
}
