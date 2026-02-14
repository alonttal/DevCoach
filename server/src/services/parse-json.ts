export function extractJSON(text: string): any {
  // Try direct parse first
  try {
    return JSON.parse(text.trim());
  } catch {}

  // Strip markdown code fences — use greedy match to grab everything between first and last fence
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {}
  }

  // Find the outermost { ... } by matching balanced braces
  const start = text.indexOf('{');
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === '\\' && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') depth++;
      if (ch === '}') { depth--; if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {}
        break;
      }}
    }
  }

  console.error('[extractJSON] Failed to parse. Raw response (first 500 chars):', text.slice(0, 500));
  throw new Error('Could not extract valid JSON from Claude response');
}
