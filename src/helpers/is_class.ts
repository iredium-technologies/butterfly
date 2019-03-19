export function isClass (v): boolean {
  return typeof v === 'function' && /^\s*class\s+/.test(v.toString())
}
