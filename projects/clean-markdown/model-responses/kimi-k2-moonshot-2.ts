export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove frontmatter
    .replace(/^---[\s\S]*?^---\s*/m, '')
    // Remove react components
    .replace(/<[^>]*>([\s\S]*?<[^>]*>)*[^>]*>/g, '')
    // Remove import statements
    .replace(/^(import\s.*|export\s.*)\s*$/gm, '')
    // Replace headings with plain text
    .replace(/^(#{1,6})\s+(.*)$/gm, '$2')
    // Remove tables
    .replace(/^\|.*\|.*(\n\|.*\|.*)*$/gm, '')
    // Unwrap markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Unwrap code blocks
    .replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
    .replace(/```$/gm, '')
    // Clean up empty lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}