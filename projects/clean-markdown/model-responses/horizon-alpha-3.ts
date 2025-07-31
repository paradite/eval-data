export function cleanMarkdown(input: string): string {
  let text = input;

  // Remove frontmatter (YAML or TOML) at the start of the file
  text = text.replace(/^\s*---[\s\S]*?---\s*\n?/, '');
  text = text.replace(/^\s*\+\+\+[\s\S]*?\+\+\+\s*\n?/, '');

  // Remove import/export statements (TypeScript/ESM)
  text = text.replace(/^\s*(?:import|export)\b[^\n]*\n/gm, '');

  // Remove tables (any line that looks like a table row or separator, plus contiguous block)
  // Lines with pipes or markdown table separators
  const lines = text.split('\n');
  const outLines: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const isTableLike =
      /\|/.test(line) ||
      /^\s*:\-+:\s*$/.test(line) ||
      /^\s*\-+\|\-+/.test(line) ||
      /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line) ||
      /^\s*\|.*\|\s*$/.test(line);

    if (isTableLike) {
      // consume contiguous table-like lines
      while (
        i < lines.length &&
        (/\|/.test(lines[i]) ||
          /^\s*:\-+:\s*$/.test(lines[i]) ||
          /^\s*\-+\|\-+/.test(lines[i]) ||
          /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(lines[i]) ||
          /^\s*\|.*\|\s*$/.test(lines[i]))
      ) {
        i++;
      }
      // Add a blank line once for the removed block (optional)
      outLines.push('');
      continue;
    } else {
      outLines.push(line);
      i++;
    }
  }
  text = outLines.join('\n');

  // Remove React components (JSX-like), including nested blocks
  // Remove self-closing tags like <Component ... />
  text = text.replace(/<([A-Z][A-Za-z0-9_]*)\b[^>]*\/\s*>/g, '');

  // Remove block components with possible nesting by repeated passes
  // This regex removes the innermost non-nested component pair
  const blockComponentRegex = /<([A-Z][A-Za-z0-9_]*)\b[^>]*>([\s\S]*?)<\/\1\s*>/g;
  let prev: string;
  do {
    prev = text;
    text = text.replace(blockComponentRegex, '');
  } while (text !== prev);

  // Unwrap fenced code blocks: ```lang ... ``` or ``` ... ```
  // Replace with the content only
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => {
    return code.trimEnd();
  });

  // Unwrap inline code `code` -> code
  text = text.replace(/`([^`]+)`/g, '$1');

  // Unwrap markdown links: [text](url) -> text
  // Also handle images ![alt](src) by removing entire image; if desired keep alt: replace with alt
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, ''); // remove images
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Replace ATX headings with plain text (remove leading # and trailing spaces)
  text = text.replace(/^\s{0,3}#{1,6}\s*(.*)$/gm, (_, title) => title.trim());

  // Remove Setext heading underlines (=== or --- on the next line)
  text = text.replace(/^(.*)\n[=-]{3,}\s*$/gm, '$1');

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Collapse multiple blank lines to at most one
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  text = text.trim();

  // Ensure final newline
  return text + '\n';
}