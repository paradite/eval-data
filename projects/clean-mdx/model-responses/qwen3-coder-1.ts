export function cleanMDX(mdx: string): string {
  let cleaned = mdx;

  // Remove frontmatter (--- ... ---)
  cleaned = cleaned.replace(/^---[\s\S]*?^---\n?/m, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+[^;]*?;\s*$/gm, '');

  // Remove React components (opening and closing tags)
  cleaned = cleaned.replace(/<[A-Z][^>]*?\/>/gs, ''); // Self-closing components
  cleaned = cleaned.replace(/<[A-Z][^>]*?>[^]*?<\/[A-Z][^>]*?>/gs, ''); // Block components

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|$/gm, '');
  cleaned = cleaned.replace(/^[\s\S]*?(\n\n)/g, '$1'); // Trim extra spaces from table removal

  // Replace headings with plain text (### Heading -> Heading)
  cleaned = cleaned.replace(/^#+\s+(.*)$/gm, '$1');

  // Unwrap markdown links ([text](url) -> text)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove horizontal rules (---)
  cleaned = cleaned.replace(/^---$/gm, '');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');

  // Trim extra newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  return cleaned.trim();
}