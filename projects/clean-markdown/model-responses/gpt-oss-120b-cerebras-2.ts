// cleanMarkdown.ts

/**
 * Clean markdown string according to the following rules:
 * - Remove front‑matter (--- ... ---)
 * - Remove import statements
 * - Remove React components (both opening/closing and self‑closing)
 * - Remove markdown tables
 * - Unwrap code fences (keep the inner code)
 * - Unwrap markdown links, keeping only the link text
 * - Replace headings with plain text (strip leading #)
 */
export function cleanMarkdown(md: string): string {
  let text = md;

  // 1. Front‑matter (--- ... ---)
  text = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/m, '');

  // 2. Import statements (single line)
  text = text.replace(/^import .*$\n?/gm, '');

  // 3. React components
  //   a) Paired tags (e.g., <Comp>...</Comp>)
  text = text.replace(
    /<([A-Z][\w]*)\b[^>]*>[\s\S]*?<\/\1>\s*/g,
    '',
  );
  //   b) Self‑closing tags (e.g., <Comp />)
  text = text.replace(/<([A-Z][\w]*)\b[^>]*\/>\s*/g, '');

  // 4. Markdown tables
  //    Remove rows that start and end with a pipe,
  //    as well as the separator line (|---|---|).
  text = text.replace(/^\s*\|.*\|\s*$\n?/gm, '');
  text = text.replace(/^\s*\|\s*[-:]+\s*\|.*\n?/gm, '');

  // 5. Unwrap code fences (```[lang]?\n...```)

  //   a) Fences with language specifier
  text = text.replace(
    /```[\w]*\n([\s\S]*?)```/g,
    (_, code) => code.trimEnd(),
  );

  //   b) Fences without language (same pattern works but kept for clarity)
  // (the previous regex already matches them, so nothing extra needed)

  // 6. Unwrap markdown links: [text](url) → text
  text = text.replace(/\[([^\]]+)]\([^\)]+\)/g, '$1');

  // 7. Convert headings to plain text
  text = text.replace(/^#{1,6}\s*(.*)$/gm, (_, heading) => heading.trim());

  // Collapse multiple blank lines into a maximum of two
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  return text.trim();
}