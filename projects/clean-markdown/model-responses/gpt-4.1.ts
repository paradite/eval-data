export function cleanMarkdown(text: string): string {
  let lines = text.split('\n');
  let out: string[] = [];
  let i = 0;
  const n = lines.length;

  // Remove frontmatter
  if (
    lines[0]?.trim() === '---'
  ) {
    i = 1;
    while (i < n && lines[i].trim() !== '---') i++;
    if (i < n && lines[i].trim() === '---') i++; // skip end ---
  }

  // Helper to match React component/tag
  const reactComponentOpenTagRe = /^<([A-Z][\w]*)\b[^>]*>?$/;
  const reactComponentSelfClosingTagRe = /^<([A-Z][\w]*)\b[^>]*?\/>$/;
  const reactComponentImportRe = /^\s*import\s.+from\s.+;?\s*$/;

  // Helper for code block
  let inCodeBlock = false;
  let codeBlockFence = '';
  let codeBlockLang = '';

  // Helper for tables
  let inTable = false;
  let skipNextTableSeparator = false;

  // Helper for React component (possibly multiline)
  let inReactComponent = false;
  let reactComponentStack: string[] = [];

  for (; i < n; ++i) {
    let line = lines[i];

    // Remove import statements
    if (reactComponentImportRe.test(line)) continue;

    // Remove tables
    // Tables start with | and are at least 2 lines: header and separator
    if (!inCodeBlock && !inReactComponent) {
      // Start of table
      if (/^\s*\|.*\|\s*$/.test(line)) {
        // Look ahead for table separator (next line looks like |----|----|)
        if (
          i + 1 < n &&
          /^\s*\|? *:?-+:? *(?:\| *:?-+:? *)+\|?\s*$/.test(lines[i + 1])
        ) {
          // skip header and separator
          i += 2;
          // skip table rows until a non-table line
          while (i < n && /^\s*\|.*\|\s*$/.test(lines[i])) i++;
          i--; // so next iteration resumes properly
          continue;
        }
      }
    }

    // Remove React components
    if (!inCodeBlock && !inReactComponent) {
      // Single-line self-closing or open tag
      if (reactComponentSelfClosingTagRe.test(line.trim())) continue;
      if (
        reactComponentOpenTagRe.test(line.trim()) && !line.trim().endsWith('/>')
      ) {
        // Check if single-line (has closing tag on line)
        const tagName = line.trim().match(reactComponentOpenTagRe)?.[1];
        if (
          new RegExp(`</${tagName}>`).test(line)
        ) {
          continue;
        }
        // Otherwise, multiline, start skipping until closing tag
        inReactComponent = true;
        reactComponentStack = [];
        reactComponentStack.push(tagName!);
        continue;
      }
    } else if (inReactComponent) {
      // Handle nested components
      // Opening tag
      let openMatch = line.trim().match(/^<([A-Z][\w]*)\b[^>]*>?$/);
      if (
        openMatch &&
        !line.trim().endsWith('/>')
      ) {
        reactComponentStack.push(openMatch[1]);
      }
      // Closing tag
      let closeMatch = line.trim().match(/^<\/([A-Z][\w]*)>/);
      if (closeMatch) {
        if (reactComponentStack.length > 0 && closeMatch[1] === reactComponentStack[reactComponentStack.length - 1]) {
          reactComponentStack.pop();
          if (reactComponentStack.length === 0) {
            inReactComponent = false;
          }
        }
      }
      continue;
    }

    // Code block handling
    // Enter/exit only if not inside a react component
    if (!inReactComponent) {
      if (!inCodeBlock) {
        const match = line.match(/^(```+|~~~+)(.*)$/);
        if (match) {
          inCodeBlock = true;
          codeBlockFence = match[1];
          codeBlockLang = match[2] || '';
          // Start code block: do not output the fence
          continue;
        }
      } else {
        // End code block
        if (line.startsWith(codeBlockFence)) {
          inCodeBlock = false;
          codeBlockFence = '';
          codeBlockLang = '';
          continue; // do not output the code block fence
        }
        // Inside code block: just output
        out.push(line);
        continue;
      }
    }

    // Replace headings with plain text
    if (!inCodeBlock && !inReactComponent) {
      // Replace ## Heading
      let headingMatch = line.match(/^ {0,3}(#{1,6}) +(.*)$/);
      if (headingMatch) {
        out.push(headingMatch[2]);
        continue;
      }
    }

    // Unwrap markdown links [text](url) -> text
    // We use a replace inside the line (can be multiple)
    // Don't touch images (![text](url))
    if (!inCodeBlock && !inReactComponent) {
      line = line.replace(/\[([^\]\[]+)\]\(([^\)]+)\)/g, '$1');
    }

    // Push the processed line
    if (!inReactComponent) {
      out.push(line);
    }
  }
  // Remove leading blank lines
  while (out.length && out[0].trim() === '') out.shift();
  // Remove trailing blank lines
  while (out.length && out[out.length - 1].trim() === '') out.pop();

  return out.join('\n');
}