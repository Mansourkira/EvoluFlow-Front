// Governorates of Tunisia (unique list)
export const TUNISIA_GOVERNORATES = [
  'Ariana',
  'Béja', 
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan'
] as const;

// User types
export const USER_TYPES = [
  'Admin',
  'Utilisateur avec pouvoir',
] as const;

// Utility function to create unique keys for arrays with potential duplicates
export const createUniqueKey = (item: string, index: number, prefix?: string): string => {
  const baseKey = prefix ? `${prefix}-${item}` : item;
  return `${baseKey}-${index}`;
};

// Utility function to deduplicate arrays while preserving order
export const deduplicateArray = <T>(
  array: T[], 
  keySelector: (item: T) => string
): T[] => {
  const seen = new Set<string>();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Utility function to safely map arrays with potential duplicates
export const safeMapWithUniqueKeys = <T>(
  array: T[],
  renderFunction: (item: T, uniqueKey: string) => React.ReactNode,
  keySelector: (item: T) => string,
  prefix?: string
): React.ReactNode[] => {
  return array.map((item, index) => {
    const baseKey = keySelector(item);
    const uniqueKey = createUniqueKey(baseKey, index, prefix);
    return renderFunction(item, uniqueKey);
  });
}; 