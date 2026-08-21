export function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    return `${trimZero((n / 1_000_000).toFixed(1))}M`;
  }
  if (n >= 1_000) {
    return `${trimZero((n / 1_000).toFixed(1))}K`;
  }
  return String(n);
}

function trimZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}
