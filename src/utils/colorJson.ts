export function colorJson(obj: unknown): string {
  const json = JSON.stringify(obj, null, 2)
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(?:[^"\\]|\\.)*")(\s*:)/g, '<span class="k">$1</span>$2')
    .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="s">$1</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)/gi, ': <span class="n">$1</span>')
    .replace(/:\s*(true|false|null)\b/g, ': <span class="b">$1</span>')
}
