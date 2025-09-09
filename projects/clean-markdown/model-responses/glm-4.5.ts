export function cleanMarkdown(inputText: string): string {
  // Remove frontmatter
  let lines = inputText.split('\n');
  let startIndex = 0;
  if (lines.length > 0 && lines[0].trim() === '---') {
      let i = 1;
      while (i < lines.length) {
          if (lines[i].trim() === '---') {
              startIndex = i + 1;
              break;
          }
          i++;
      }
  }

  let inCodeBlock = false;
  let inReactBlock = false;
  let reactDepth = 0;
  let outputLines: string[] = [];

  for (let i = startIndex; i < lines.length; i++) {
      let line = lines[i];

      // Check for code block delimiters
      if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          continue;
      }

      if (inCodeBlock) {
          outputLines.push(line);
          continue;
      }

      // If we are in a react block, update the depth and skip the line.
      if (inReactBlock) {
          const netChange = calculateNetReactChange(line);
          reactDepth += netChange;
          if (reactDepth <= 0) {
              inReactBlock = false;
              reactDepth = 0;
          }
          continue;
      }

      // Remove self-closing react components
      line = line.replace(/<\w+[^>]*\/>/g, '');

      // Calculate net change for non-self-closing react components
      const netChange = calculateNetReactChange(line);
      if (netChange > 0) {
          inReactBlock = true;
          reactDepth = netChange;
          continue;
      }

      // Remove import statements
      if (line.match(/^\s*import\s+/)) {
          continue;
      }

      // Remove tables
      if (line.match(/^\s*\|.*\|/)) {
          continue;
      }

      // Unwrap markdown links
      line = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

      // Replace headings
      line = line.replace(/^#{1,6}\s*/, '');

      outputLines.push(line);
  }

  let output = outputLines.join('\n');
  // Replace three or more consecutive newlines with two newlines
  output = output.replace(/\n{3,}/g, '\n\n');
  return output;
}

function calculateNetReactChange(line: string): number {
  const openingTags = line.match(/<(\w+)[^>]*>/g) || [];
  const closingTags = line.match(/<\/(\w+)>/g) || [];

  let openingCount = 0;
  for (const tag of openingTags) {
      if (!tag.endsWith('/>')) {
          openingCount++;
      }
  }
  const closingCount = closingTags.length;

  return openingCount - closingCount;
}