export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove frontmatter
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/g, '')
    // Remove tables (single-line replacement only – drops the whole line)
    .replace(/^\s*\|.*(?:\r?\n|$)/gm, '')
    // Remove import statements
    .replace(/^\s*import\s+.*\s+from\s+['"`]([^'"`]+)['"`];?\s*$/gm, '')
    .replace(/^\s*import\s+['"`]([^'"`]+)['"`];?\s*$/gm, '')
    // Remove React/JSX components
    .replace(/<[\w/-]+[^>]*[\s\S]*?>[\s\S]*?<\/[\w/-]+>/g, '')
    .replace(/<[\w/-]+[^>]*\s*\/?>/g, '')
    // Unwrap code blocks
    .replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1')
    // Replace headings with plain text
    .replace(/^\s*#{1,6}\s*/gm, '')
    // Unwrap markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}