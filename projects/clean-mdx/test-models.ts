import { cleanMDX } from './cleanMDX.ts';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { diffChars } from 'diff';

const inputText = readFileSync('./sample-input.mdx', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

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
      name: 'cleanMDX',
      cleanFunction: cleanMDX,
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
      
        if (module.cleanMDX && typeof module.cleanMDX === 'function') {
        models.push({
          name: formatModelName(filename),
          cleanFunction: module.cleanMDX,
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
    if (isVerbose) {
      console.log(`Written output to: ${config.outputPath}`);
    }
  }
  
  const isSame = cleanedText.trim() === expectedOutputText.trim();
  
  if (isSame) {
    console.log(`${config.name}: 100% match`);
  } else {
    const diff = diffChars(expectedOutputText.trim(), cleanedText.trim()).filter(
      (d) => d.added || d.removed
    );
    console.log(`${config.name}: not match (${diff.length} diffs)`);
    
    if (isVerbose) {
      console.log('  Diff details:');
      for (const d of diff) {
        const type = d.added ? 'added' : d.removed ? 'removed' : 'unchanged';
        const preview = d.value.length > 50 ? d.value.substring(0, 50) + '...' : d.value;
        const displayValue = preview.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
        console.log(`    ${type}: "${displayValue}"`);
      }
    }
  }
}

async function main() {
  try {
    if (isVerbose) {
      console.log('Running in verbose mode...');
      console.log(`Input text length: ${inputText.length}`);
      console.log(`Expected output length: ${expectedOutputText.length}`);
      console.log('');
    }
    
    const models = await loadModelsFromDirectory();
    
    if (isVerbose) {
      console.log(`Found ${models.length} models to test:`);
      models.forEach(model => console.log(`  - ${model.name}`));
      console.log('');
    }
    
    models.forEach(model => testModel(model, inputText, expectedOutputText));
  } catch (error) {
    console.error('Failed to load models:', error);
  }
}

main();