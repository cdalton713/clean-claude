import { useMemo } from 'react';
import { cleaningRules } from '../utils/cleaningRules';

export const useTextCleaner = (input: string): string => {
  return useMemo(() => {
    if (!input) return '';

    let cleaned = input;
    for (const rule of cleaningRules) {
      cleaned = rule.apply(cleaned);
    }
    return cleaned;
  }, [input]);
};