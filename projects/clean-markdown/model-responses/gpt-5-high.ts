export function cleanMarkdown(input: string): string {
  // Normalize newlines
  let text = input.replace(/\r\n/g, '\n');

  // 1) Remove frontmatter
  text = removeFrontmatter(text);

  // 2) Extract fenced code blocks (to protect them while cleaning) and replace with placeholders
  const extracted = extractFencedCodeBlocks(text);
  let skeleton = extracted.text;

  // 3) Remove React components (MDX/JSX)
  skeleton = removeReactComponents(skeleton);

  // 4) Remove import statements (outside code blocks)
  skeleton = removeImportStatements(skeleton);

  // 5) Remove tables
  skeleton = removeTables(skeleton);

  // 6) Replace headings with plain text
  skeleton = replaceHeadings(skeleton);

  // 7) Unwrap markdown links
  skeleton = unwrapMarkdownLinks(skeleton);

  // 8) Collapse multiple blank lines on skeleton (so code block internal spacing is preserved)
  skeleton = collapseBlankLines(skeleton);

  // 9) Put back code blocks as plain content (unwrap code blocks)
  let result = restoreCodeBlocks(skeleton, extracted.blocks);

  // Final trim (tests compare with trim anyway)
  return result.trim();
}

function removeFrontmatter(s: string): string {
  // Remove YAML frontmatter at the start of the file
  // Handles BOM and optional trailing newline after closing ---
  return s.replace(/^\ufeff?---[ \t]*\n[\s\S]*?\n---[ \t]*\n?/, '');
}

function extractFencedCodeBlocks(s: string): { text: string; blocks: string[] } {
  const lines = s.split('\n');
  const outLines: string[] = [];
  const blocks: string[] = [];

  let inFence = false;
  let fenceMarker = '';
  let buffer: string[] = [];

  const pushPlaceholder = () => {
    const index = blocks.length;
    blocks.push(buffer.join('\n'));
    outLines.push(getCodeToken(index));
    buffer = [];
  };

  const isFenceStart = (line: string): string | null => {
    const m = line.match(/^\s*(```|~~~)/);
    return m ? m[1] : null;
  };

  const isFenceEnd = (line: string, marker: string): boolean => {
    return new RegExp(`^\\s*${escapeRegex(marker)}\\s*$`).test(line);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inFence) {
      const marker = isFenceStart(line);
      if (marker) {
        inFence = true;
        fenceMarker = marker;
        // start collecting, do not include this fence line
      } else {
        outLines.push(line);
      }
    } else {
      if (isFenceEnd(line, fenceMarker)) {
        // End of fence; push placeholder
        pushPlaceholder();
        inFence = false;
        fenceMarker = '';
      } else {
        buffer.push(line);
      }
    }
  }

  // If file ended while still in fence, push what we captured
  if (inFence) {
    pushPlaceholder();
  }

  return { text: outLines.join('\n'), blocks };
}

function restoreCodeBlocks(s: string, blocks: string[]): string {
  let result = s;
  for (let i = 0; i < blocks.length; i++) {
    const token = getCodeToken(i);
    // Replace token with raw code content (unwrap code block)
    result = result.replace(token, blocks[i]);
  }
  return result;
}

function getCodeToken(i: number): string {
  return `<<<CODE_BLOCK_${i}>>>`;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function removeReactComponents(s: string): string {
  let result = s;

  // Remove block components like <Component ...> ... </Component>
  // Loop to remove nested occurrences progressively
  const blockRe = /<([A-Z][A-Za-z0-9_]*)\b[^>]*>[\s\S]*?<\/\1>/g;
  let prev: string;
  do {
    prev = result;
    result = result.replace(blockRe, '');
  } while (result !== prev);

  // Remove self-closing components like <Component ... />
  result = result.replace(/<([A-Z][A-Za-z0-9_]*)\b[^>]*\/>/g, '');

  return result;
}

function removeImportStatements(s: string): string {
  // Remove lines that start with "import ...", common MDX/ESM import usage
  return s.replace(/^[ \t]*import[^\n]*\n?/gm, '');
}

function removeTables(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    if (isMarkdownTableLine(line)) {
      // skip table lines
      continue;
    }
    out.push(line);
  }

  return out.join('\n');
}

function isMarkdownTableLine(line: string): boolean {
  const t = line.trim();
  if (t.length === 0) return false;

  // Typical table rows
  if ((t.startsWith('|') && t.includes('|')) || (t.includes('|') && t.endsWith('|'))) {
    return true;
  }

  // Header separator like ---|--- or :---|:---
  if (/^[\s:\-|]+$/.test(t) && t.includes('|')) {
    return true;
  }

  return false;
}

function replaceHeadings(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ATX headings: # .. ###### ...
    const m = line.match(/^\s{0,3}(#{1,6})\s*(.*?)\s*#*\s*$/);
    if (m) {
      const text = m[2];
      out.push(text);
      continue;
    }

    // Optionally handle setext headings:
    // Line of text followed by ==== or ----.
    // We'll convert it by dropping the underline (the text line is already plain),
    // but only if previous line exists and is not empty.
    const underline = line.match(/^\s*(=+|-+)\s*$/);
    if (underline && out.length > 0 && out[out.length - 1].trim().length > 0) {
      // Drop this underline line (do nothing) to "flatten" setext heading.
      continue;
    }

    out.push(line);
  }

  return out.join('\n');
}

function unwrapMarkdownLinks(s: string): string {
  let result = s;

  // Remove reference-style link definitions: [id]: url "title"
  result = result.replace(/^\s*\[[^\]]+\]:\s+\S.*$/gm, '');

  // Images: ![alt](url) -> alt
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');

  // Inline links: [text](url) -> text
  // This is a practical heuristic and may not handle deeply nested parentheses in URLs.
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Reference links: [text][id] -> text
  result = result.replace(/\[([^\]]+)\]\s*\[[^\]]*\]/g, '$1');

  return result;
}

function collapseBlankLines(s: string): string {
  const lines = s.split('\n');
  const out: string[] = [];
  let prevEmpty = true; // avoid leading blank lines

  for (const line of lines) {
    const isEmpty = line.trim().length === 0;
    if (isEmpty) {
      if (!prevEmpty) {
        out.push(''); // keep a single blank line
      }
      prevEmpty = true;
    } else {
      out.push(line);
      prevEmpty = false;
    }
  }

  // Remove trailing blank lines
  while (out.length > 0 && out[out.length - 1].trim() === '') {
    out.pop();
  }

  return out.join('\n');
}