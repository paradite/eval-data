import { cleanMarkdown } from './cleanMarkdown.ts';
import { cleanMarkdown as cleanMarkdownGpt41 } from './model-responses/gpt-4.1.ts';
import { cleanMarkdown as cleanMarkdownSonnet4 } from './model-responses/sonnet-4.ts';
import { cleanMarkdown as cleanMarkdownGemini25Pro } from './model-responses/gemini-2.5-pro.ts';
import { cleanMarkdown as cleanMarkdownOpus4 } from './model-responses/opus-4.ts';
import { cleanMarkdown as cleanMarkdownDeepSeekV3 } from './model-responses/deepseek-v3.ts';
import { cleanMarkdown as cleanMarkdownO3 } from './model-responses/o3.ts';
import { cleanMarkdown as cleanMarkdownGrok4 } from './model-responses/grok-4.ts';

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
  {
    name: 'Gemini 2.5 Pro',
    cleanFunction: cleanMarkdownGemini25Pro,
    outputPath: './model-responses/gemini-2.5-pro.md',
  },
  {
    name: 'Claude Opus 4',
    cleanFunction: cleanMarkdownOpus4,
    outputPath: './model-responses/opus-4.md',
  },
  {
    name: 'DeepSeek V3',
    cleanFunction: cleanMarkdownDeepSeekV3,
    outputPath: './model-responses/deepseek-v3.md',
  },
  {
    name: 'o3',
    cleanFunction: cleanMarkdownO3,
    outputPath: './model-responses/o3.md',
  },
  {
    name: 'Grok 4',
    cleanFunction: cleanMarkdownGrok4,
    outputPath: './model-responses/grok-4.md',
  },
];

models.forEach(model => testModel(model, inputText, expectedOutputText));