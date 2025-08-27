import { readFileSync } from 'fs';

export function cleanMDX(text: string): string {
  let cleaned = text;

  // Remove frontmatter (between --- and ---)
  cleaned = cleaned.replace(/^---\s*[\s\S]*?^---\s*$/gm, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;$\s*/gm, '');

  // Remove react components (both self-closing and with children)
  cleaned = cleaned.replace(/<[A-Za-z][A-Za-z0-9]*(?:\s+[^>]*)?(?:\/>|>[\s\S]*?<\/[A-Za-z][A-Za-z0-9]*>)/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|$\s*^\|.*\|$\s*(\^\|.*\|$\s*)*/gm, '');

  // Remove horizontal rules
  cleaned = cleaned.replace(/^---\s*$/gm, '');

  // Unwrap markdown links [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text (remove # symbols)
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Unwrap code blocks (both with and without language specification)
  cleaned = cleaned.replace(/```[a-z]*\n([\s\S]*?)```/g, '$1');

  // Clean up extra newlines and whitespace
  cleaned = cleaned
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple blank lines with single blank line
    .trim();

  return cleaned;
}