import { cleanMarkdown } from './cleanMarkdown.ts';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { diffChars } from 'diff';

const inputText = readFileSync('./sample-input.md', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

interface ModelConfig {
  name: string;
  cleanFunction: (text: string) => string;
  outputPath?: string;
  createdTime: Date;
}

function formatModelName(filename: string): string {
  return filename
    .replace(/\.ts$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function loadModelsFromDirectory(): Promise<ModelConfig[]> {
  const modelResponsesDir = './model-responses';
  const files = readdirSync(modelResponsesDir);
  const tsFiles = files.filter(file => file.endsWith('.ts'));
  
  const models: ModelConfig[] = [
    {
      name: 'cleanMarkdown',
      cleanFunction: cleanMarkdown,
      createdTime: new Date(0),
    }
  ];

  for (const file of tsFiles) {
    try {
      const filePath = `./${join(modelResponsesDir, file)}`;
      const fullPath = join(modelResponsesDir, file);
      const stats = statSync(fullPath);
      const module = await import(filePath);
      const filename = basename(file, '.ts');
      
      if (module.cleanMarkdown && typeof module.cleanMarkdown === 'function') {
        models.push({
          name: formatModelName(filename),
          cleanFunction: module.cleanMarkdown,
          outputPath: `./model-responses/${filename}.md`,
          createdTime: stats.birthtime,
        });
      }
    } catch (error) {
      console.warn(`Failed to load model from ${file}:`, error);
    }
  }

  return models.sort((a, b) => a.createdTime.getTime() - b.createdTime.getTime());
}

function testModel(config: ModelConfig, inputText: string, expectedOutputText: string): void {
  const cleanedText = config.cleanFunction(inputText);
  
  if (config.outputPath) {
    writeFileSync(config.outputPath, cleanedText);
  }
  
  const isSame = cleanedText.trim() === expectedOutputText.trim();
  console.log(config.name, isSame);
  
  if (!isSame) {
    const diff = diffChars(expectedOutputText.trim(), cleanedText.trim()).filter(
      (d) => d.added || d.removed
    );
    console.log('number of diff', diff.length);
    for (const d of diff) {
      console.log(d);
    }
  }
}

async function main() {
  try {
    const models = await loadModelsFromDirectory();
    models.forEach(model => testModel(model, inputText, expectedOutputText));
  } catch (error) {
    console.error('Failed to load models:', error);
  }
}

main();