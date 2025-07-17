import { cleanMarkdown } from './cleanMarkdown.ts';
import { cleanMarkdown as cleanMarkdownGpt41 } from './model-responses/gpt-4.1.ts';
import { cleanMarkdown as cleanMarkdownSonnet4 } from './model-responses/sonnet-4.ts';
import { readFileSync, writeFileSync } from 'fs';
import { diffChars } from 'diff';

const inputText = readFileSync('./sample-input.md', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

interface ModelConfig {
  name: string;
  cleanFunction: (text: string) => string;
  outputPath?: string;
}

function testModel(config: ModelConfig, inputText: string, expectedOutputText: string): void {
  const cleanedText = config.cleanFunction(inputText);
  
  if (config.outputPath) {
    writeFileSync(config.outputPath, cleanedText);
  }
  
  const isSame = cleanedText.trim() === expectedOutputText.trim();
  console.log(config.name, isSame);
  
  if (!isSame) {
    const diff = diffChars(expectedOutputText, cleanedText).filter(
      (d) => d.added || d.removed
    );
    console.log('number of diff', diff.length);
    for (const d of diff) {
      console.log(d);
    }
  }
}

const models: ModelConfig[] = [
  {
    name: 'cleanMarkdown',
    cleanFunction: cleanMarkdown,
  },
  {
    name: 'GPT-4.1',
    cleanFunction: cleanMarkdownGpt41,
    outputPath: './model-responses/gpt-4.1.md',
  },
  {
    name: 'Claude Sonnet 4',
    cleanFunction: cleanMarkdownSonnet4,
    outputPath: './model-responses/sonnet-4.md',
  },
];

models.forEach(model => testModel(model, inputText, expectedOutputText));