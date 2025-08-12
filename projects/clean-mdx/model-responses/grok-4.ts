export function cleanMDX(text: string): string {
  // Remove frontmatter
  text = text.replace(/^\---[\s\S]*?\n---\n/, '');

  // Remove imports
  text = text.replace(/import[\s\S]*?;\n*/g, '');

  // Remove horizontal rules
  text = text.replace(/^\s*---\s*$/gm, '');

  // Define skipComponent
  const skipComponent = (text: string, start: number): number => {
    let i = start;
    if (text[i] !== '<') return start;
    let j = i + 1;
    if (!/[A-Z]/.test(text[j])) return start;
    // get tagName
    let tagStart = j;
    while (j < text.length && /\w/.test(text[j])) j++;
    const tagName = text.slice(tagStart, j);
    // parse attributes
    let attributeDepth = 0;
    let inQuote = false;
    let quoteChar = '';
    let isSelfClosing = false;
    while (j < text.length) {
      let ch = text[j];
      if (inQuote) {
        if (ch === quoteChar) inQuote = false;
        j++;
        continue;
      }
      if (attributeDepth === 0 && ch === '>') {
        break;
      }
      if (attributeDepth === 0 && ch === '/' && j + 1 < text.length && text[j + 1] === '>') {
        isSelfClosing = true;
        j += 2;
        return j;
      }
      if (attributeDepth === 0 && (ch === '"' || ch === "'")) {
        inQuote = true;
        quoteChar = ch;
        j++;
        continue;
      }
      if (ch === '{') attributeDepth++;
      if (ch === '}') if (attributeDepth > 0) attributeDepth--;
      j++;
    }
    if (j >= text.length || text[j] !== '>') return start;
    j++; // past >
    if (isSelfClosing) return j;
    // now skip content
    while (j < text.length) {
      if (text[j] === '<') {
        if (text[j + 1] === '/') {
          let k = j + 2;
          let closeStart = k;
          while (k < text.length && /\w/.test(text[k])) k++;
          const closeName = text.slice(closeStart, k);
          if (closeName === tagName && text[k] === '>') {
            return k + 1;
          }
        } else if (/[A-Z]/.test(text[j + 1])) {
          j = skipComponent(text, j); // recursive
          continue;
        }
      }
      j++;
    }
    return j; // if not found, end
  };

  // Parsing loop for components and code blocks
  let result = '';
  let i = 0;
  const length = text.length;
  while (i < length) {
    if (text[i] === '`' && text[i + 1] === '`' && text[i + 2] === '`') {
      // unwrap code block
      i += 3;
      // skip language
      while (i < length && text[i] !== '\n') i++;
      if (i < length) i++; // past \n
      // collect content until ```
      let endIndex = i;
      while (endIndex < length) {
        if (text[endIndex] === '`' && text[endIndex + 1] === '`' && text[endIndex + 2] === '`') {
          break;
        }
        endIndex++;
      }
      const code = text.slice(i, endIndex);
      result += code;
      i = endIndex + 3;
      continue;
    } else if (text[i] === '<' && /[A-Z]/.test(text[i + 1] || '')) {
      const newI = skipComponent(text, i);
      if (newI > i) {
        i = newI;
        continue;
      }
    }
    result += text[i];
    i++;
  }

  // Remove tables
  result = result.replace(/^(\|.*\|\s*\n)+/gm, (match) => {
    if (match.includes('----')) return '';
    return match;
  });

  // Replace headings with plain text
  result = result.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Unwrap markdown links
  result = result.replace(/\[(.*?)\]\((.*?)\)/g, '$1');

  // Collapse multiple newlines to single
  result = result.replace(/\n{2,}/g, '\n');

  return result;
}