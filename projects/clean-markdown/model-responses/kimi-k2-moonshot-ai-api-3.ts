export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n?/, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*;?\s*$/gm, '');

  // Remove react components
  cleaned = cleaned.replace(/<[^>]*>[\s\S]*?<\/[^>]*>/g, '');
  cleaned = cleaned.replace(/<[^>]*\/>/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|.*\n(?:^\|.*\|.*\n)*/gm, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');

  // Clean up extra newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}