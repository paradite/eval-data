export function cleanMarkdown(text: string): string {
  let cleaned = text;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\s*/gm, '');

  // Remove import statements
  cleaned = cleaned.replace(/^\s*import\s+.*$/gm, '');

  // Remove react components
  cleaned = cleaned.replace(/<[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<[^>]*>[\s\S]*?<\/[^>]*>/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*(?:\r?\n\|.*)+/gm, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)/gm, '$1');

  // Replace markdown links with plain text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');

  return cleaned.trim();
}