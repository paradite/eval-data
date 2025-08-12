// cleanMDX.ts

export function cleanMDX(input: string): string {
  let text = input;

  // 1. Remove frontmatter (first "--- ... ---" block)
  text = text.replace(
    /^---[\s\S]*?---\s*/m,
    ''
  );

  // 2. Remove import statements (lines starting with 'import')
  text = text.replace(/^\s*import\s[^\n]*\n?/gm, '');

  // 3. Remove tables (blocks of |...|\n|---|...\n... )
  // 3a. Remove tables: lines containing '|', but NOT in code blocks
  //    so let's do this blockwise, first remove tables.

  // This regex will remove entire table blocks:
  text = text.replace(
    /((?:^\s*\|.*?\n)+\s*(?:^\s*\|[\s:\-]+?\|.*?\n)(?:^\s*\|.*?\n)+)/gm,
    ''
  );
  // As a fallback, also remove all lines that look like markdown table header/separator
  text = text.replace(/^\s*\|[\s\S]*?\|.*\n?/gm, (line) => {
    // Don't remove if in a code block. We'll handle this after code block aware part. For now, remove.
    return '';
  });

  // 4. Remove react components (lines/blocks like <Component ... /> or <Component>...</Component>)
  // This must remove both single lines and multi-line nested react blocks.

  // Remove self-closing tags, including multi-line props
  text = text.replace(/^\s*<([A-Z][A-Za-z0-9]*)\b[^>]*?\/>\s*$/gm, '');

  // Remove block components, potentially nested (do a simple greedy for now)
  // Remove blocks like <Component ... > ... </Component>
  // This naive version will remove from first <Comp ...> to first </Comp>
  // which is usually enough for current MDX needs; for nested tags of the same type, could improve later.

  function stripBlocks(str: string): string {
    // Recursively removes outermost <Component...>...</Component> blocks
    const tagBlockRegex = /<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>\s*/g;
    let oldStr = str;
    let newStr = str.replace(tagBlockRegex, '');
    while (newStr !== oldStr) {
      oldStr = newStr;
      newStr = newStr.replace(tagBlockRegex, '');
    }
    return newStr;
  }
  text = stripBlocks(text);

  // Remove leftover empty lines after removing components
  text = text.replace(/^\s*\n/gm, '');

  // 5. Remove horizontal rule separators, which are lines that are exactly '---' (possibly surrounded with whitespace)
  text = text.replace(/^\s*---\s*$/gm, '');

  // 6. Unwrap code blocks (replace ```(lang)? ... ``` with just the code)
  // Replace all ```lang?...``` blocks with code only
  text = text.replace(/```[\w]*\n([\s\S]*?)```/g, (_, code) => {
    // Remove trailing leading newlines in code
    return code.replace(/^\s+|\s+$/g, '') + '\n\n';
  });
  // Finally, remove possible leftover triple backticks
  text = text.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1');

  // 7. Replace headings (# + text) with just plain text
  // From h1 to h6
  text = text.replace(
    /^#{1,6}\s+(.*)$/gm,
    (_, title) => title.trim()
  );

  // 8. Unwrap markdown links: [text](url) --> text
  // Do NOT match image links (![...](...)), only standard links
  text = text.replace(/!?\[([^\]]+)\]\([^\)\s]+(?:\s+"[^"]*")?\)/g, (all, label) => label);

  // 9. Remove any extra blank lines (more than 2 consecutive \n become just 2)
  text = text.replace(/\n{3,}/g, '\n\n');

  // 10. Final trim
  text = text.trim();

  return text;
}
