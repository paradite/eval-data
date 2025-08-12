export function cleanMDX(input: string): string {
  // Normalize input (remove BOM if present)
  let text = input.replace(/^\uFEFF/, '');

  // Split into lines
  const lines = text.split(/\r?\n/);

  // Remove frontmatter at start of file (--- ... ---)
  if (lines.length > 0 && lines[0].trim() === '---') {
    let endIndex = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        endIndex = i;
        break;
      }
    }
    if (endIndex !== -1) {
      lines.splice(0, endIndex + 1);
    }
  }

  const resultLines: string[] = [];

  let inCode = false;
  let inImport = false;
  let reactDepth = 0;

  const codeFenceRe = /^\s*```/;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Toggle code block fences, and unwrap by not pushing fence lines
    if (!inImport && codeFenceRe.test(trimmed)) {
      inCode = !inCode;
      continue;
    }

    // Inside code block: keep content as-is without further processing
    if (inCode) {
      resultLines.push(line);
      continue;
    }

    // Remove import statements (including multi-line imports) outside code
    if (inImport) {
      if (trimmed.endsWith(';')) {
        inImport = false;
      }
      continue;
    } else if (/^\s*import\s/.test(line)) {
      if (!trimmed.endsWith(';')) {
        inImport = true;
      }
      continue;
    }

    // Remove horizontal rule separators (---)
    if (trimmed === '---') {
      continue;
    }

    // Detect and skip React components (uppercase JSX tags), including nested and multi-line/self-closing
    const openTagRegex = /<([A-Z][A-Za-z0-9._:-]*)(?=[\s>\/])/g;
    const closeTagRegex = /<\/[A-Z][A-Za-z0-9._:-]*\s*>/g;
    const selfClosingRegex = /<([A-Z][A-Za-z0-9._:-]*)(?:[^<>]*?)\/>/g;

    let openers = 0;
    let closers = 0;
    let selfClosers = 0;

    // Count tags on this line
    while (openTagRegex.exec(line) !== null) openers++;
    while (closeTagRegex.exec(line) !== null) closers++;
    while (selfClosingRegex.exec(line) !== null) selfClosers++;

    if (openers > 0 || closers > 0 || selfClosers > 0 || reactDepth > 0) {
      reactDepth += openers;
      reactDepth -= closers;
      reactDepth -= selfClosers;
      if (reactDepth < 0) reactDepth = 0;
      // Skip any line that contains part of a React component or if currently inside one
      if (openers > 0 || closers > 0 || selfClosers > 0 || reactDepth > 0) {
        continue;
      }
    }

    // Remove tables: detect a table header row followed by a separator row and skip all rows in that table
    if (line.includes('|')) {
      const nextLine = lines[i + 1] ?? '';
      if (isTableSeparatorRow(nextLine)) {
        // Skip header and separator
        i += 1;
        // Skip subsequent table rows
        while (i + 1 < lines.length && lines[i + 1].includes('|')) {
          i += 1;
        }
        continue;
      }
    }

    // Replace headings with plain text
    let processed = line;
    const headingMatch = processed.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      let headingText = headingMatch[2].trim();
      headingText = headingText.replace(/\s*#+\s*$/, '').trim();
      processed = headingText;
    }

    // Unwrap markdown links [text](url) -> text (ignore images ![alt](url))
    processed = unwrapMarkdownLinks(processed);

    resultLines.push(processed);
  }

  return resultLines.join('\n');
}

function isTableSeparatorRow(line: string): boolean {
  const t = (line || '').trim();
  if (!t.includes('|')) return false;

  // Remove leading/trailing pipes for clean splitting
  const withoutOuterPipes = t.replace(/^\|/, '').replace(/\|$/, '');
  const cells = withoutOuterPipes.split('|').map(s => s.trim());
  if (cells.length < 2) return false;

  // A valid separator cell looks like :---, ---:, :---:, or --- (3+ dashes)
  const isSepCell = (cell: string) => /^:?-{3,}:?$/.test(cell);
  return cells.every(isSepCell);
}

function unwrapMarkdownLinks(s: string): string {
  // Replace [text](url) -> text; ignore images ![alt](url)
  // This simplistic regex won't handle nested brackets in link text, which is fine for typical docs.
  return s.replace(/(!)?\[([^\]]+)\]\(([^)]+)\)/g, (_m, bang, text) => {
    if (bang) {
      // It's an image, leave as-is
      return _m;
    }
    return text;
  });
}