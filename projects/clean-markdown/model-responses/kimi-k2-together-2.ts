export function cleanMarkdown(text: string): string {
  return text
    // — 1. Remove frontmatter
    .replace(/^---\n[\s\S]*?\n---\n?/, '')
    // — 2. Replace headings (no # symbols at start of line)
    .replace(/^[#\s]+(.+)$/gm, '$1')
    // — 3. Strip tables lines
    .split('\n')
    .filter(l => !l.includes('|') || !(l.trim().startsWith('|') || l.match('|')))
    .join('\n')
    // — 4. Remove import statements
    .replace(/^\s*import\s+.*\s*$/gm, '')
    // — 5. Remove React components (<...> on their own lines)
    .replace(/^<[\s\S]*?>/gm, '')
    .replace(/^\s*<\/[^>]+>\s*$/gm, '')
    // — 6. Extract code-block contents (unwrap them)
    .replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, '$1')
    // — 7. Unwrap markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}