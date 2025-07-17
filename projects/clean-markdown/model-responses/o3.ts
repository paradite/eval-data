export function cleanMarkdown(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const result: string[] = [];

  let inCodeBlock = false;
  let skippingFrontMatter = false;

  // Handle front-matter removal
  if (lines.length && lines[0].trim() === '---') {
    skippingFrontMatter = true;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip lines while inside front-matter
    if (skippingFrontMatter) {
      if (i !== 0 && line.trim() === '---') {
        skippingFrontMatter = false; // reached the end of front-matter
      }
      continue;
    }

    // Toggle code block status
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue; // remove the fence itself
    }

    // If currently inside a code block, keep the line verbatim
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    const trimmed = line.trimStart();

    // Remove import statements
    if (trimmed.startsWith('import ')) {
      continue;
    }

    // Remove React components / JSX tags (simple heuristic)
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      continue;
    }

    // Remove tables (lines that look like markdown table rows)
    if (trimmed.startsWith('|')) {
      continue;
    }

    // Remove heading markdown (#, ##, ###, etc.) but keep the text
    if (/^#+\s/.test(trimmed)) {
      line = line.replace(/^#+\s*/, '');
    }

    // Unwrap markdown links [text](url) => text
    line = line.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');

    result.push(line);
  }

  let cleaned = result.join('\n');

  // Collapse more than two consecutive newlines into exactly two
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}