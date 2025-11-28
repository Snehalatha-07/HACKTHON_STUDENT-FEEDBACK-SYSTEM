export function normalizeUserInput(input) {
  const value = (input || '').toString().trim();
  if (!value) return { id: Date.now().toString(), name: '' };

  // numeric-only IDs -> use as id
  if (/^[0-9]+$/.test(value)) {
    return { id: value, name: value };
  }

  // basic email detection -> use email as name
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { id: Date.now().toString(), name: value };
  }

  // fallback: treat as name
  return { id: Date.now().toString(), name: value };
}
