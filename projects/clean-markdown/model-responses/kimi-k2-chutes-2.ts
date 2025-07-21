export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove frontmatter (--- ... ---)
    .replace(/^---\s*\n[\s\S]*?\n---\s*\n/g, '')
    // Remove import statements
    .replace(/^(import|export)\s.*?(\n|$)/gm, '')
    // Remove tables
    .replace(/^\|.*(?:\n\|.*)*/gm, '')
    // Unwrap code blocks
    .replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, '$1')
    // Remove react components (jsx tags)
    .replace(/<([A-Z][^\s>\/<>]*|\/[A-Z][^\s>\/<>]*)([^<>]*|.*?)>/gs, '')
    // Unwrap markdown links
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Replace headings with plain text
    .replace(/^#{1,6}\s+(.*)/gm, '$1')
    .trim();
}