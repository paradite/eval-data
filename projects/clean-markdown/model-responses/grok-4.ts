export function cleanMarkdown(text: string): string {
  const lines = text.split('\n');
  const cleanedLines: string[] = [];
  let i = 0;
  let inComponent = 0;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inTable = false;

  // Remove frontmatter
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') {
      i++;
    }
    if (i < lines.length) i++;
  }

  while (i < lines.length) {
    let line = lines[i];

    // Remove import statements
    if (line.trim().startsWith('import ')) {
      i++;
      continue;
    }

    // Handle components
    if (inComponent > 0) {
      if (line.trim().startsWith('</')) {
        inComponent--;
      } else if (line.trim().startsWith('<') && !line.trim().startsWith('</') && !line.trim().endsWith('/>')) {
        inComponent++;
      }
      i++;
      continue;
    } else {
      if (line.trim().startsWith('<') && line.trim().length > 1 && line.trim()[1].toUpperCase() === line.trim()[1] && !line.trim().startsWith('</')) {
        inComponent = 1;
        if (line.trim().endsWith('/>')) {
          inComponent = 0;
        }
        i++;
        continue;
      }
    }

    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        cleanedLines.push(...codeBlockLines);
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }

    // Handle headings
    if (line.match(/^\s*#+\s*/)) {
      let cleaned = line.replace(/^\s*#+\s*/, '');
      cleaned = cleaned.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
      cleanedLines.push(cleaned);
      i++;
      continue;
    }

    // Handle tables
    if (!inTable && line.trim().startsWith('|') && (line.match(/\|/g) || []).length > 1) {
      if (i + 1 < lines.length && lines[i + 1].trim().match(/^\|?(\s*-+\s*\|?)+$/)) {
        inTable = true;
        i += 2;
        continue;
      }
    }
    if (inTable) {
      if (!line.trim().startsWith('|') || (line.match(/\|/g) || []).length <= 1) {
        inTable = false;
      } else {
        i++;
        continue;
      }
    }

    // Process regular lines: unwrap links
    let cleanedLine = line.replace(/\[(.*?)\]\((.*?)\)/g, '$1');
    cleanedLines.push(cleanedLine);
    i++;
  }

  // If ended in code block, add the lines
  if (inCodeBlock) {
    cleanedLines.push(...codeBlockLines);
  }

  return cleanedLines.join('\n');
}