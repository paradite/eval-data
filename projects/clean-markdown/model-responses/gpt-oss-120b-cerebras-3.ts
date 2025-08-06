// cleanMarkdown.ts
/**
 * Cleans a markdown string according to the following rules:
 *  - Remove front‑matter (YAML block between leading `---` lines)
 *  - Remove import statements (`import ...;`)
 *  - Remove markdown tables
 *  - Remove React/HTML components (both paired and self‑closing tags)
 *  - Unwrap fenced code blocks (keep only the inner code)
 *  - Unwrap markdown links (`[text](url)` → `text`)
 *  - Replace headings with their plain text content
 *  - Collapse excessive blank lines
 */
export function cleanMarkdown(input: string): string {
  let text = input;

  // 1. Front‑matter
  text = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/gm, '');

  // 2. Import statements
  text = text.replace(/^import\s.+?;\s*$/gm, '');

  // 3. Tables (any consecutive lines that start with a pipe)
  text = text.replace(/^(\s*\|.*\|[ \t]*\n)+/gm, '');

  // 4. React/HTML components
  // Paired tags (non‑greedy to avoid spanning the whole document)
  text = text.replace(/<[\w-][^>]*>([\s\S]*?)<\/[\w-][^>]*>/g, '');
  // Self‑closing tags
  text = text.replace(/<[\w-][^>]*\/>/g, '');

  // 5. Unwrap fenced code blocks (with or without language specifier)
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => code.trimEnd());

  // 6. Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 7. Replace headings with plain text
  text = text.replace(/^#{1,6}\s*(.+?)\s*#*\s*$/gm, '$1');

  // 8. Collapse multiple blank lines to at most two
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace for the final output
  return text.trim();
}