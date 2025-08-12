// cleanMDX.ts
export function cleanMDX(input: string): string {
  let text = input;

  // 1. Remove frontmatter (--- ... --- at the very start)
  if (/^\s*---\s*$/.test(text.split('\n')[0])) {
    const parts = text.split('\n');
    let endIdx = -1;
    for (let i = 1; i < parts.length; i++) {
      if (/^\s*---\s*$/.test(parts[i])) {
        endIdx = i;
        break;
      }
    }
    if (endIdx !== -1) {
      parts.splice(0, endIdx + 1);
      text = parts.join('\n');
    }
  }

  // 2. Remove import statements
  text = text.replace(/^ *import.*$/gm, '');

  // 3. Remove horizontal rules (---)
  text = text.replace(/^\s*---\s*$/gm, '');

  // 4. Remove React components
  //    a) Self‑closing JSX tags like <Component ... />
  text = text.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, '');
  //    b) Paired JSX tags (including their content) like <Component>...</Component>
  //       This uses a non‑greedy match and works for non‑nested custom components.
  text = text.replace(
    /<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g,
    '',
  );

  // 5. Remove markdown tables (any line containing a pipe)
  text = text.replace(/^\s*\|.*\|.*$/gm, '');

  // 6. Unwrap fenced code blocks, keeping only the code inside
  text = text.replace(
    /```(?:[\w.+-]+)?\n([\s\S]*?)```/g,
    (_, code) => code.trim(),
  );

  // 7. Unwrap markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)]\([^)\n]*\)/g, '$1');

  // 8. Replace headings with plain text
  text = text.replace(/^#{1,6}\s*(.*)$/gm, '$1');

  // 9. Collapse multiple blank lines to a maximum of two
  text = text.replace(/\n{3,}/g, '\n\n');

  // 10. Trim leading/trailing whitespace
  return text.trim();
}