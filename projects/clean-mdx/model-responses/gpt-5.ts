export function cleanMDX(input: string): string {
  let text = removeFrontmatter(input);

  const lines = text.split(/\r?\n/);

  const out: string[] = [];
  let inCodeBlock = false;
  let codeFence: '```' | '~~~' | null = null;

  let inImportBlock = false;

  // React component removal state
  let inReactBlock = false;
  let reactStack: string[] = [];
  let pendingReactOpenName: string | null = null; // for multi-line opening tags before '>' or '/>'

  const startReactComponentRegex = /^\s*<([A-Z][\w.-]*)(?=[\s>/])/;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle code fences (unwrap code blocks)
    if (!inReactBlock && !inImportBlock) {
      if (!inCodeBlock) {
        if (trimmed.startsWith('```')) {
          inCodeBlock = true;
          codeFence = '```';
          continue; // skip the fence line
        } else if (trimmed.startsWith('~~~')) {
          inCodeBlock = true;
          codeFence = '~~~';
          continue; // skip the fence line
        }
      } else {
        // in code block: only look for corresponding closing fence
        if (
          (codeFence === '```' && trimmed.startsWith('```')) ||
          (codeFence === '~~~' && trimmed.startsWith('~~~'))
        ) {
          inCodeBlock = false;
          codeFence = null;
          continue; // skip the closing fence
        }
      }
    }

    // When inside code block, just output as-is (no transformations)
    if (inCodeBlock) {
      out.push(line);
      continue;
    }

    // Handle import statements (single-line or multi-line)
    if (inImportBlock) {
      if (trimmed.includes(';')) {
        inImportBlock = false;
      }
      continue; // skip import lines
    } else {
      if (/^\s*import\b/.test(trimmed)) {
        if (!trimmed.includes(';')) {
          inImportBlock = true;
        }
        continue; // skip the current import line
      }
    }

    // Handle React component blocks (remove them entirely)
    if (inReactBlock) {
      // If we are still in the phase of opening tag spanning multiple lines
      if (pendingReactOpenName) {
        if (trimmed.includes('/>')) {
          // self-closing component finished
          pendingReactOpenName = null;
          inReactBlock = reactStack.length > 0; // remain in block if nested paired components exist
          // Skip this line
          continue;
        } else if (trimmed.includes('>')) {
          // opening tag finished; now expect a closing tag later
          reactStack.push(pendingReactOpenName);
          pendingReactOpenName = null;
          // Skip this line
          continue;
        } else {
          // still within opening tag attributes
          continue;
        }
      } else {
        // Inside component content; look for closing tags for any open components in stack
        while (reactStack.length > 0) {
          const top = reactStack[reactStack.length - 1];
          if (line.includes(`</${top}>`)) {
            reactStack.pop();
          } else {
            break;
          }
        }

        if (reactStack.length === 0) {
          // Component block ended with the closing tag on this line or earlier; skip this line too
          inReactBlock = false;
        }
        // Regardless, skip the line while inReactBlock or the closing line itself
        continue;
      }
    } else {
      // Not currently in a React block; check if this line starts a React component
      const startMatch = trimmed.match(startReactComponentRegex);
      if (startMatch) {
        const tagName = startMatch[1];
        if (trimmed.includes('/>')) {
          // self-closing on the same line
          continue; // skip this line
        } else if (trimmed.includes('>')) {
          // paired component; push and start skipping until closing tag
          reactStack.push(tagName);
          inReactBlock = true;
          continue; // skip this line
        } else {
          // opening tag spans multiple lines; wait until '>' or '/>'
          pendingReactOpenName = tagName;
          inReactBlock = true;
          continue; // skip this line
        }
      }
    }

    // Remove tables: lines that look like table rows (start with a pipe)
    if (/^\s*\|/.test(trimmed)) {
      continue;
    }

    // Remove horizontal rules (---) explicitly
    if (/^\s*-{3,}\s*$/.test(trimmed)) {
      continue;
    }

    // Replace ATX headings with plain text
    const headingMatch = line.match(/^\s*#{1,6}\s*([^#\n]+?)(\s*#+\s*)?$/);
    if (headingMatch) {
      line = headingMatch[1].trim();
      out.push(line);
      continue;
    }

    // Handle Setext headings: underline with === or ---; remove underline lines
    // If current line is just ===... or ---... and previous line exists, skip it
    if (/^\s*={3,}\s*$/.test(trimmed) || /^\s*-{3,}\s*$/.test(trimmed)) {
      // Skip setext underline (previous line remains as plain text)
      continue;
    }

    // Unwrap markdown links: [text](url) -> text
    line = unwrapLinks(line);

    // Optionally remove common MDX inline spaces like {' '} leftover (conservative)
    line = line.replace(/\{\s*' '\s*\}/g, ' ');

    out.push(line);
  }

  return out.join('\n');
}

function removeFrontmatter(text: string): string {
  // Remove YAML frontmatter only if it appears at the very beginning
  // Matches: ---\n ... \n---\n (the last newline optional)
  return text.replace(/^\uFEFF?\s*---\s*\n[\s\S]*?\n---\s*\n?/, '');
}

function unwrapLinks(line: string): string {
  // Basic unwrap: [label](url "title") -> label
  // This is a simple regex that handles typical cases (no nested brackets)
  // Handle multiple links per line globally
  return line.replace(/\[([^\]]+)\]\((?:\\\)|[^)])+\)/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}