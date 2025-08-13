export function cleanMarkdown(md: string): string {
  let text = md.replace(/\r\n?/g, '\n');

  text = stripFrontmatter(text);
  text = removeReactComponents(text);
  text = unwrapFencedCodeBlocks(text);
  text = removeTables(text);
  text = replaceHeadings(text);
  text = unwrapLinks(text);
  text = removeImportStatements(text);
  text = cleanBlankLines(text);

  return text;
}

function stripFrontmatter(text: string): string {
  if (!text.startsWith('---')) return text;
  const lines = text.split('\n');
  if (lines[0].trim() !== '---') return text;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      return lines.slice(i + 1).join('\n');
    }
  }
  return text;
}

function removeReactComponents(text: string): string {
  // Remove JSX-like React components with uppercase tag names,
  // including their nested content. Self-closing uppercase tags are removed inline.
  let out = '';
  let i = 0;
  let depth = 0;

  while (i < text.length) {
    const ch = text[i];
    if (ch === '<') {
      const start = i;
      let j = i + 1;

      // Detect closing tag
      let closing = false;
      if (j < text.length && text[j] === '/') {
        closing = true;
        j++;
      }

      // Read tag name
      const nameStart = j;
      while (j < text.length && /[A-Za-z0-9]/.test(text[j])) j++;
      const tagName = text.slice(nameStart, j);
      const hasTagName = tagName.length > 0;
      const isUpper = hasTagName && /^[A-Z]/.test(tagName);

      // Move to end of tag while respecting quotes
      let quote: string | null = null;
      let selfClosing = false;
      while (j < text.length) {
        const c = text[j];
        if (quote) {
          if (c === quote) {
            quote = null;
          } else if (c === '\\') {
            j += 2;
            continue;
          }
        } else {
          if (c === '"' || c === "'") {
            quote = c;
          } else if (c === '>') {
            if (text[j - 1] === '/') selfClosing = true;
            j++;
            break;
          }
        }
        j++;
      }

      if (isUpper) {
        if (selfClosing) {
          // Remove just this self-closing tag
          i = j;
          continue;
        }
        if (closing) {
          if (depth > 0) {
            depth--;
            i = j;
            continue;
          } else {
            // Stray closing tag; skip it
            i = j;
            continue;
          }
        } else {
          // Opening tag
          depth++;
          i = j;
          continue;
        }
      } else {
        // Not a React component tag; emit as-is if not inside a component
        if (depth === 0) {
          out += text.slice(start, j);
        }
        i = j;
        continue;
      }
    } else {
      if (depth === 0) out += ch;
      i++;
    }
  }

  return out;
}

function unwrapFencedCodeBlocks(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inFence = false;
  let fenceChar: '`' | '~' | '' = '';
  let fenceLen = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inFence) {
      const m = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (m) {
        inFence = true;
        fenceChar = m[1][0] as '`' | '~';
        fenceLen = m[1].length;
        continue; // skip the opening fence line
      }
      out.push(line);
    } else {
      const m = line.match(/^\s*([`~]{3,})(.*)$/);
      if (m) {
        const char = m[1][0] as '`' | '~';
        const len = m[1].length;
        if (char === fenceChar && len >= fenceLen) {
          inFence = false;
          continue; // skip the closing fence line
        }
      }
      out.push(line);
    }
  }

  return out.join('\n');
}

function isTableAlignmentLine(line: string): boolean {
  const t = line.trim();
  if (!t.includes('|')) return false;
  // Alignment lines are composed of pipes, colons, dashes, and spaces, and include at least one dash
  return /^[\s\|\-:]+$/.test(t) && /-/.test(t);
}

function removeTables(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes('|') &&
      i + 1 < lines.length &&
      isTableAlignmentLine(lines[i + 1])
    ) {
      // Skip header and alignment lines
      i += 2;
      // Skip subsequent table rows
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        i++;
      }
      i--; // adjust because for-loop will increment
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function replaceHeadings(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ATX-style headings: #, ##, ..., ######
    const m = line.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
    if (m) {
      let content = m[2].replace(/\s*#+\s*$/, '');
      out.push(content);
      continue;
    }

    // Setext-style headings: text followed by ==== or ---- (strip underline)
    if (i + 1 < lines.length) {
      const next = lines[i + 1];
      if (/^\s{0,3}=+\s*$/.test(next) || /^\s{0,3}-+\s*$/.test(next)) {
        out.push(line);
        i++; // skip underline
        continue;
      }
    }

    out.push(line);
  }

  return out.join('\n');
}

function unwrapLinks(text: string): string {
  let out = '';
  let i = 0;

  while (i < text.length) {
    const idx = text.indexOf('[', i);
    if (idx === -1) {
      out += text.slice(i);
      break;
    }
    out += text.slice(i, idx);

    // Find matching closing bracket for link text
    let j = idx + 1;
    let depth = 1;
    while (j < text.length) {
      const ch = text[j];
      if (ch === '\\') {
        j += 2;
        continue;
      }
      if (ch === '[') depth++;
      else if (ch === ']') {
        depth--;
        if (depth === 0) break;
      }
      j++;
    }
    if (j >= text.length || text[j] !== ']') {
      // Not a proper link, emit '[' and continue
      out += text[idx];
      i = idx + 1;
      continue;
    }
    const linkText = text.slice(idx + 1, j);
    const nextChar = text[j + 1];

    if (nextChar !== '(') {
      // Not a markdown link pattern, emit as-is
      out += '[' + linkText + ']';
      i = j + 1;
      continue;
    }

    // Find matching ')', allowing nested parentheses
    let k = j + 2;
    let pDepth = 1;
    while (k < text.length) {
      const ch2 = text[k];
      if (ch2 === '\\') {
        k += 2;
        continue;
      }
      if (ch2 === '(') pDepth++;
      else if (ch2 === ')') {
        pDepth--;
        if (pDepth === 0) break;
      }
      k++;
    }
    if (k >= text.length || text[k] !== ')') {
      // Malformed, emit as-is
      out += '[' + linkText + '](';
      i = j + 2;
      continue;
    }

    // Replace with plain link text
    out += linkText;
    i = k + 1;
  }

  return out;
}

function removeImportStatements(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if (/^\s*import\s+/.test(line)) {
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

function cleanBlankLines(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let prevBlank = true; // avoid leading blank lines

  for (let line of lines) {
    line = line.replace(/[ \t]+$/g, '');
    const isBlank = /^\s*$/.test(line);
    if (isBlank) {
      if (!prevBlank) {
        out.push('');
      }
    } else {
      out.push(line);
    }
    prevBlank = isBlank;
  }

  // Remove trailing blank line(s)
  while (out.length > 0 && out[out.length - 1] === '') {
    out.pop();
  }

  return out.join('\n');
}