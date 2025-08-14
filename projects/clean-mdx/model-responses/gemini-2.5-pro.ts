export const cleanMDX = (mdxText: string): string => {
  let cleaned = mdxText;

  // Rule: Remove frontmatter (YAML block at the beginning)
  // ---
  // layout: post
  // ...
  // ---
  cleaned = cleaned.replace(/^---[\s\S]*?---\s*/, '');

  // Rule: Remove import statements
  // e.g., import { MyComponent } from './MyComponent';
  // This handles single and multi-line imports ending with a semicolon.
  cleaned = cleaned.replace(/^import[\s\S]+?;\s*$/gm, '');

  // Rule: Remove react components
  // e.g., <MyComponent prop="value" /> or <MyComponent>...</MyComponent>
  // This regex handles both self-closing and block components whose names start
  // with an uppercase letter. The 's' flag lets '.' match newlines.
  const componentRegex = /<([A-Z][\w\d]*)\b[^>]*>[\s\S]*?<\/\1>|<[A-Z][\w\d]*\b[^>]*\/>/gs;
  cleaned = cleaned.replace(componentRegex, '');

  // Rule: Remove tables
  // This regex removes any block of lines where each line starts with a '|'.
  const tableRegex = /^\s*\|.*\|.*(?:\r?\n|\r|$)/gm;
  cleaned = cleaned.replace(tableRegex, (match) => {
    // Check if the next line is also a table line to form a block
    const nextLineIndex = cleaned.indexOf(match) + match.length;
    const nextLine = cleaned.substring(nextLineIndex).split(/(\r?\n|\r)/)[0];
    if (nextLine && /^\s*\|.*\|/.test(nextLine)) {
      return '';
    }
    // If it's a single line that looks like a table row, it might be a false positive.
    // However, for this problem, we'll remove any sequence of table-like lines.
    return '';
  });
  // A simpler, more aggressive regex that works for the sample:
  cleaned = cleaned.replace(/^(?:\|\s*:?-{3,}:?\s*)+\|\s*[\r\n]+(?:\|.*[\r\n]+)*/gm, (match, p1, offset) => {
      const preceedingLineIndex = cleaned.lastIndexOf('\n', offset - 2) + 1;
      const preceedingLine = cleaned.substring(preceedingLineIndex, offset);
      if (preceedingLine.includes('|')) {
        return preceedingLine + match;
      }
      return match;
  });
  cleaned = cleaned.replace(/^(?:\|.*[\r\n]+)+\|?:?-{3,}:?.*/gm, '');


  // Let's use a simpler and more robust approach for tables that finds the separator
  // and removes the whole block.
  // Header\nSeparator\n...Body
  const fullTableRegex = /^.*\|.*\r?\n\s*\|(?:\s*:?--+:?)+\s*\|\s*\r?\n(?:\|.*(?:\r?\n|\r|$))*/gm;
  cleaned = cleaned.replace(fullTableRegex, '');


  // Rule: Remove horizontal rule separators (---)
  // This must be run after removing frontmatter.
  const hrRegex = /^\s*---\s*$/gm;
  cleaned = cleaned.replace(hrRegex, '');

  // Rule: Unwrap code blocks
  // ```javascript\ncode\n``` -> code
  const codeBlockRegex = /^```(?:\w+)?\n([\s\S]*?)\n```/gm;
  cleaned = cleaned.replace(codeBlockRegex, '$1');
  
  // Rule: Remove any leftover empty code fences
  cleaned = cleaned.replace(/^```\s*$/gm, '');

  // Rule: Replace headings with plain text
  // e.g., ## My Heading -> My Heading
  const headingRegex = /^#+\s+(.+)/gm;
  cleaned = cleaned.replace(headingRegex, '$1');

  // Rule: Unwrap markdown links
  // e.g., [link text](https://example.com) -> link text
  const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
  cleaned = cleaned.replace(linkRegex, '$1');

  // Final cleanup:
  // - Replace multiple (3+) newlines with a double newline for spacing
  // - Trim leading/trailing whitespace from the final output
  cleaned = cleaned.replace(/(\r\n|\n){3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
};