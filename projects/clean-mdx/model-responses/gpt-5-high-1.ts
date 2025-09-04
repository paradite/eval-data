export function cleanMDX(input: string): string {
  // Remove frontmatter at the very beginning
  input = removeFrontmatter(input);

  const lines = input.split(/\r?\n/);

  const out: string[] = [];
  let inCodeBlock = false;
  let inImportBlock = false;
  const componentStack: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Toggle code block fences and remove them (unwrap code blocks)
    if (/^```/.test(trimmed)) {
      inCodeBlock = !inCodeBlock;
      continue; // remove the fence line
    }

    if (inCodeBlock) {
      // Inside code block: keep content as-is
      out.push(line);
      continue;
    }

    // Remove import statements (including multi-line)
    if (inImportBlock) {
      if (trimmed.includes(';')) {
        inImportBlock = false;
      }
      continue; // skip import lines
    }
    if (/^\s*import\s/.test(line)) {
      if (!trimmed.includes(';')) {
        inImportBlock = true;
      }
      continue;
    }

    // Remove horizontal rules (---)
    if (/^\s*-{3,}\s*$/.test(trimmed)) {
      continue;
    }

    // Remove React components (JSX) - uppercase tags
    // We only consider tags that start the line (ignoring indentation)
    if (componentStack.length > 0) {
      // We're inside a component block; adjust stack by looking for nested opens/closes
      const t = trimmed;

      // Closing tag
      if (/^<\/[A-Z][\w.]*(\s*)>/.test(t)) {
        if (componentStack.length > 0) componentStack.pop();
        continue;
      }

      // Nested opening tag at start-of-line
      let consumedSelfClose = false;
      if (/^<[A-Z][\w.]*\b/.test(t)) {
        if (/\/>\s*$/.test(t)) {
          // self-closing nested tag: does not change depth
          consumedSelfClose = true;
        } else {
          // nested open tag increases depth
          componentStack.push('X');
        }
      }

      // Handle '/>' that closes a tag spanning multiple lines (e.g., <Comp ... \n />)
      if (!consumedSelfClose && /\/>\s*$/.test(t)) {
        if (componentStack.length > 0) componentStack.pop();
      }

      // Always skip lines while inside a component block
      if (componentStack.length >= 0) {
        // If stack reached 0, next lines will be processed again
      }
      continue;
    } else {
      const t = trimmed;
      // Stray closing tag (uppercase) - skip
      if (/^<\/[A-Z][\w.]*(\s*)>/.test(t)) {
        continue;
      }
      // Opening tag for component
      if (/^<[A-Z][\w.]*\b/.test(t)) {
        if (/\/>\s*$/.test(t)) {
          // Self-closing component on one line: remove line
          continue;
        } else {
          // Start a component block
          componentStack.push('X');
          continue;
        }
      }
    }

    // Remove tables: lines that start with '|' or are typical separator rows made of |:- and spaces
    if (/^\s*\|/.test(line)) {
      continue;
    }
    if (/^\s*[:\-\|\s]+$/.test(trimmed)) {
      continue;
    }

    // Replace headings with plain text
    const headingMatch = line.match(/^\s{0,3}(#{1,6})\s*(.+)$/);
    if (headingMatch) {
      const content = headingMatch[2];
      out.push(content);
      continue;
    }

    // Unwrap markdown links [text](url) -> text (also handles images by keeping alt text)
    const processed = unwrapMarkdownLinks(line);

    out.push(processed);
  }

  // Join lines and normalize line endings
  const result = out.join('\n').replace(/\r/g, '');

  // Keep a trailing newline for cleanliness (tests use trim())
  return result.trimEnd() + '\n';
}

function removeFrontmatter(text: string): string {
  // Only remove frontmatter if it is at the very beginning
  const frontmatterRegex = /^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/;
  return text.replace(frontmatterRegex, '');
}

function unwrapMarkdownLinks(s: string): string {
  // Replace [text](url) with text; also handles images ![alt](src) -> alt
  // Run repeatedly until no more matches
  const pattern = /!?\[([^\]]+)\]\(([^)]+)\)/g;
  let prev: string;
  do {
    prev = s;
    s = s.replace(pattern, (m, label) => {
      // m may start with '!' for images; we still return the label (alt text)
      return label;
    });
  } while (s !== prev);
  return s;
}