function removeReactComponents(text: string): string {
  let result = text;

  result = result.replace(
    /<([A-Z][a-zA-Z0-9]*)[^>]*(?:\{(?:[^{}]|\{[^{}]*\})*\}[^>]*)*\/>/g,
    ''
  );

  result = result.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, '');

  return result;
}

export function cleanMDX(text: string): string {
  if (!text) return '';

  let cleanedText = text;

  cleanedText = cleanedText.replace(/^---[\s\S]*?---\n?/m, '');

  // Remove import statements (both single-line and multi-line)
  // First, remove multi-line imports that end with semicolon
  cleanedText = cleanedText.replace(/^import\s+[\s\S]*?;\s*$/gm, '');
  // Then, remove single-line imports without semicolon
  cleanedText = cleanedText.replace(/^import\s+[^;\n\r]*$/gm, '');

  // Remove horizontal rule separators (--- or *** or ___)
  cleanedText = cleanedText.replace(/^[-*_]{3,}\s*$/gm, '');

  // Convert headings to plain text (remove # symbols but keep content)
  cleanedText = cleanedText.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  cleanedText = cleanedText.replace(/^.*\|.*$/gm, '');

  // Unwrap code blocks (remove triple backticks but keep content)
  cleanedText = cleanedText.replace(/```[a-zA-Z]*\n?([\s\S]*?)```/g, '$1');

  // Unwrap markdown links (keep only link text, remove URLs)
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  cleanedText = removeReactComponents(cleanedText);

  while (/<[^>]*>/.test(cleanedText)) {
    cleanedText = cleanedText.replace(/<[^>]*>/g, '');
  }

  cleanedText = cleanedText
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();

  return cleanedText;
}
