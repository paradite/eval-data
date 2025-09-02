function cleanMDX(input: string): string {
  // Remove frontmatter
  input = input.replace(/^---[\s\S]*?---\n/, '');

  // Remove import statements
  input = input.replace(/^import[\s\S]*?;\n/g, '');

  // Unwrap markdown links
  input = input.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove JSX components
  input = removeJSX(input);

  // Unwrap code blocks
  input = input.replace(/```[^\n]*\n([\s\S]*?)\n```/g, '$1');

  // Replace headings with plain text
  input = input.replace(/^#{1,6} +(.*)$/gm, '$1');

  // Remove table lines
  input = input.replace(/^ *\|.*\| *$/gm, '');

  // Remove horizontal rules
  input = input.replace(/^---+ *$/gm, '');

  return input;
}

function removeJSX(input: string): string {
  let result = '';
  let i = 0;
  while (i < input.length) {
    if (input[i] === '<') {
      let depth = 1;
      let j = i + 1;
      while (j < input.length && depth > 0) {
        if (input[j] === '<') {
          depth++;
        } else if (input[j] === '>') {
          depth--;
        }
        j++;
      }
      i = j;
    } else {
      result += input[i];
      i++;
    }
  }
  return result;
}

export { cleanMDX };