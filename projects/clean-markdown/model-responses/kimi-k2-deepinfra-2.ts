/**
 * Cleans a markdown text by:
 * - Unwrapping code blocks
 * - Unwrapping markdown links
 * - Replacing headings with plain text
 * - Removing tables
 * - Removing react components
 * - Removing import statements
 * - Removing frontmatter
 */
export function cleanMarkdown(source: string): string {
  return (
    source
      // 1. Strip frontmatter (--- ... ---)
      .replace(/^---[\s\S]*?---\s*/m, '')

      // 2. Remove import statements
      .replace(/^import\s[\s\S]*?$/gm, '')

      // 3. Remove JSX / React components  (<...>)
      .replace(/<\/?[^>]+(?:\s.*?)?\/?\s*>/gs, '')

      // 4. Remove tables (`|...|` split by newlines)
      .replace(/^\s*\|.*?\|.*(?:\n^\s*\|.*?\|.*)*\n?/gm, '')

      // 5. Remove heading markers (# ## ### …) keeping the rest as plain
      .replace(/^(#{1,6})\s*(.*)$/gm, '$2')

      // 6. Unwrap markdown links [...](...) → just the text
      .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')

      // 7. Extricate fenced code blocks
      //    ```lang ... ```
      .replace(/```(?:\w+)?\s*\n?([\s\S]*?)\n?```/g, '$1')

      // 8. Extricate inline code blocks with single backtick
      .replace(/`([^`]+)`/g, '$1')

      // 9. Collapse multiple blank lines into single
      .replace(/\n{3,}/g, '\n\n')

      // 10. Trim leading & trailing whitespace
      .trim()
  );
}