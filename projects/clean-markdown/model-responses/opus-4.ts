export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n*/m, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;?\s*$/gm, '');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');

  // Remove React components
  cleaned = cleaned.replace(/<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?>[\s\S]*?<\/[A-Z][a-zA-Z0-9]*>/g, '');
  cleaned = cleaned.replace(/<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?\s*\/>/g, '');

  // Remove tables
  cleaned = cleaned.replace(/\|.*\|[\s\S]*?(?=\n(?!\|)|$)/g, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Clean up multiple consecutive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim leading and trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}