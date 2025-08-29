import { useMemo } from 'react';
import type { TextStats } from '../types';

export const useTextStats = (original: string, cleaned: string): TextStats => {
  return useMemo(() => ({
    lines: original.split('\n').length,
    characters: original.length,
    cleaned: original.length - cleaned.length
  }), [original, cleaned]);
};