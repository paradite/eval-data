// cleanMarkdown.ts

export function cleanMarkdown(text: string): string {
  let result = text;

  // ---- Remove front‑matter (YAML block at the very beginning) ----
  result = result.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');

  // ---- Remove import statements (any line that starts with "import") ----
  result = result.replace(/^import .*$\n?/gm, '');

  // ---- Remove React / JSX components ----
  // Self‑closing components like <MyComponent />
  result = result.replace(/<\s*[A-Z][\w]*[^>]*\/\s*>/g, '');
  // Paired components like <MyComponent>...</MyComponent>
  result = result.replace(/<\s*([A-Z][\w]*)[^>]*>[\s\S]*?<\/\s*\1\s*>/g, '');

  // ---- Remove markdown tables ----
  // Remove any line that looks like a table row (starts with a pipe)
  result = result.replace(/^\s*\|.*\n/gm, '');

  // ---- Unwrap fenced code blocks (```...``` or ```lang\n...``` ) ----
  result = result.replace(/```[a-zA-Z0-9]*\n([\s\S]*?)```/g, (_, code) => {
    // Preserve the code as‑is, but trim trailing newlines to avoid excess blanks
    return code.replace(/\s+$/g, '');
  });

  // ---- Replace headings with plain text (remove leading #) ----
  result = result.replace(/^#{1,6}\s*(.*)$/gm, (_, heading) => heading);

  // ---- Unwrap markdown links: [text](url) → text ----
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // ---- Collapse multiple consecutive blank lines to at most two ----
  result = result.replace(/\n{3,}/g, '\n\n');

  // ---- Trim leading / trailing whitespace ----
  return result.trim();
}