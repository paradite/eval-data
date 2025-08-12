export function cleanMDX(text: string): string {
  // remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n?/, '');

  // remove imports
  let lines = text.split('\n');
  let newLines: string[] = [];
  let inImport = false;
  for (let line of lines) {
    if (inImport) {
      if (line.includes(';')) inImport = false;
      continue;
    }
    if (line.trim().startsWith('import')) {
      inImport = true;
      if (line.includes(';')) inImport = false;
      continue;
    }
    newLines.push(line);
  }
  text = newLines.join('\n');

  // remove JSX
  text = removeJSX(text);

  // remove horizontal rules
  lines = text.split('\n');
  newLines = [];
  for (let line of lines) {
    if (line.trim() === '---') continue;
    newLines.push(line);
  }
  text = newLines.join('\n');

  // remove tables
  lines = text.split('\n');
  newLines = [];
  for (let line of lines) {
    let trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.indexOf('|', 1) > 0) continue;
    newLines.push(line);
  }
  text = newLines.join('\n');

  // unwrap code blocks
  lines = text.split('\n');
  newLines = [];
  let inCode = false;
  for (let line of lines) {
    if (line.trim().startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }
  text = newLines.join('\n');

  // replace headings
  text = text.replace(/^(\s*)#{1,6}\s*(.*)$/gm, '$1$2');

  // unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // collapse multiple blank lines to one
  lines = text.split('\n');
  newLines = [];
  let lastWasBlank = false;
  for (let line of lines) {
    let isBlank = line.trim() === '';
    if (isBlank) {
      if (!lastWasBlank) {
        newLines.push(line);
        lastWasBlank = true;
      }
    } else {
      newLines.push(line);
      lastWasBlank = false;
    }
  }
  text = newLines.join('\n');

  return text;
}

function removeJSX(text: string): string {
  const chars = text.split('');
  const result: string[] = [];
  let i = 0;
  while (i < chars.length) {
    if (chars[i] === '<' && i + 1 < chars.length) {
      let j = i + 1;
      let isClosing = false;
      if (chars[j] === '/') {
        isClosing = true;
        j++;
      }
      let k = j;
      while (k < chars.length && chars[k] !== '>') {
        if (chars[k] === '"') {
          k++;
          while (k < chars.length && chars[k] !== '"') k++;
          if (k < chars.length) k++;
        } else if (chars[k] === "'") {
          k++;
          while (k < chars.length && chars[k] !== "'") k++;
          if (k < chars.length) k++;
        } else if (chars[k] === '{') {
          let braceDepth = 1;
          k++;
          while (k < chars.length && braceDepth > 0) {
            if (chars[k] === '{') braceDepth++;
            else if (chars[k] === '}') braceDepth--;
            k++;
          }
        } else {
          k++;
        }
      }
      if (k >= chars.length || chars[k] !== '>') {
        result.push(chars[i]);
        i++;
        continue;
      }
      let selfClosing = false;
      if (k > i + 1 && chars[k - 1] === '/') {
        selfClosing = true;
      }
      if (isClosing) {
        result.push(chars[i]);
        i++;
        continue;
      }
      if (selfClosing) {
        i = k + 1;
        continue;
      }
      // opening tag
      let tagName = '';
      let m = i + 1;
      while (m < k && !/\s|\/|>/.test(chars[m])) {
        tagName += chars[m];
        m++;
      }
      let closingTag = '</' + tagName + '>';
      let depth = 1;
      let n = k + 1;
      while (n < chars.length && depth > 0) {
        if (chars[n] === '<') {
          if (chars[n + 1] === '/') {
            let p = n;
            let currentClosing = '';
            while (p < chars.length && chars[p] !== '>') {
              currentClosing += chars[p];
              p++;
            }
            if (p < chars.length && chars[p] === '>') {
              currentClosing += '>';
              if (currentClosing === closingTag) {
                depth--;
              }
              n = p + 1;
              continue;
            }
          } else {
            // possible nested opening
            let p = n;
            let openTagName = '';
            let q = n + 1;
            while (q < chars.length && !/\s|\/|>/.test(chars[q])) {
              openTagName += chars[q];
              q++;
            }
            if (openTagName === tagName) {
              depth++;
            }
            while (p < chars.length && chars[p] !== '>') p++;
            n = p + 1;
            continue;
          }
        }
        n++;
      }
      if (depth === 0) {
        i = n;
        continue;
      }
      // not matched
      result.push(chars[i]);
      i++;
    } else {
      result.push(chars[i]);
      i++;
    }
  }
  return result.join('');
}