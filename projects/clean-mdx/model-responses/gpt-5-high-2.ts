export function cleanMDX(input: string): string {
  // Normalize newlines
  let text = input.replace(/\r\n/g, '\n');

  // Step 1: Protect code blocks with placeholders so we don't modify their content
  const codeBlocks: string[] = [];
  {
    const lines = text.split('\n');
    const outLines: string[] = [];
    let inCode = false;
    let buffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!inCode && trimmed.startsWith('```')) {
        inCode = true;
        buffer = [line];
        continue; // don't emit fence line
      }

      if (inCode) {
        buffer.push(line);
        if (trimmed.startsWith('```') && buffer.length > 1) {
          inCode = false;
          const idx = codeBlocks.length;
          codeBlocks.push(buffer.join('\n'));
          outLines.push(`<<<CODEBLOCK_${idx}>>>`);
          buffer = [];
        }
        continue;
      }

      outLines.push(line);
    }

    // If file ends while still in a code block, treat the rest as a code block
    if (inCode && buffer.length) {
      const idx = codeBlocks.length;
      codeBlocks.push(buffer.join('\n'));
      outLines.push(`<<<CODEBLOCK_${idx}>>>`);
    }

    text = outLines.join('\n');
  }

  // Step 2: Remove frontmatter at the very beginning
  // Matches:
  // ---\n
  // ... any content ...
  // ---\n
  text = text
    .replace(/^\ufeff?---\s*\n[\s\S]*?\n---\s*\n?/, '')
    .replace(/^\n+/, ''); // remove extra leading newlines after frontmatter removal

  // Step 3: Remove import statements (outside code, since code is protected)
  // Remove any "import ... ;" including multiline imports
  text = text.replace(/(^|\n)\s*import[\s\S]*?;\s*(?=\n|$)/g, '\n');

  // Step 4: Remove React components (uppercase tag names)
  // 4a: Self-closing uppercase components, possibly spanning multiple lines
  const selfClosingRe = /<([A-Z][A-Za-z0-9_.]*)\b[\s\S]*?\/>/g;
  // 4b: Paired uppercase components <Name ...> ... </Name>
  const pairedRe = /<([A-Z][A-Za-z0-9_.]*)\b[\s\S]*?>[\s\S]*?<\/\1\s*>/g;

  let prev = '';
  do {
    prev = text;
    text = text.replace(selfClosingRe, '');
    text = text.replace(pairedRe, '');
  } while (text !== prev);

  // Step 5: Remove tables (lines starting with a pipe)
  {
    const lines = text.split('\n');
    const out: string[] = [];
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith('|')) continue; // drop table rows
      out.push(line);
    }
    text = out.join('\n');
  }

  // Step 6: Remove horizontal rule separators (---, ***, ___) if they are alone on a line
  text = text
    .split('\n')
    .filter((l) => {
      const t = l.trim();
      return !(t === '---' || t === '***' || t === '___');
    })
    .join('\n');

  // Step 7: Replace headings with plain text (strip leading # and trailing #)
  {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\s{0,3}(#{1,6})\s+(.*)$/);
      if (m) {
        let content = m[2].replace(/\s*#+\s*$/, ''); // remove trailing # group if present
        lines[i] = content;
      }
    }
    text = lines.join('\n');
  }

  // Step 8: Unwrap markdown links: [text](url) -> text (outside code only)
  // Simple, common-case regex
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Optional: replace common MDX whitespace expressions {' '} with a single space
  text = text.replace(/\{\s*['"]\s+['"]\s*\}/g, ' ');

  // Step 9: Trim trailing spaces and compress excessive blank lines
  text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // Step 10: Re-insert code blocks, unwrapping the fences
  text = text.replace(/<<<CODEBLOCK_(\d+)>>>/g, (_, idxStr) => {
    const idx = parseInt(idxStr, 10);
    const block = codeBlocks[idx] || '';
    const lines = block.split('\n');

    // Remove opening fence
    if (lines.length && lines[0].trim().startsWith('```')) {
      lines.shift();
    }
    // Remove closing fence
    if (lines.length && lines[lines.length - 1].trim().startsWith('```')) {
      lines.pop();
    }

    return lines.join('\n');
  });

  // Final clean-up: remove trailing spaces and compress blank lines again (in case reinsertion created extras)
  text = text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  return text;
}