import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';
import { createHash } from 'crypto';

const originalHTML = readFileSync('./index.html', 'utf-8');

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

interface ModelConfig {
  name: string;
  htmlContent: string;
  filePath: string;
  createdTime: Date;
  hash: string;
}

function formatModelName(filename: string): string {
  return filename
    .replace(/\\.html$/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function loadModelsFromDirectory(): ModelConfig[] {
  const models: ModelConfig[] = [];
  
  // Load gold standard files first
  const goldDir = './gold';
  try {
    const goldFiles = readdirSync(goldDir);
    const goldHtmlFiles = goldFiles.filter(file => file.endsWith('.html'));
    
    for (const file of goldHtmlFiles) {
      try {
        const filePath = join(goldDir, file);
        const stats = statSync(filePath);
        const htmlContent = readFileSync(filePath, 'utf-8');
        const filename = basename(file, '.html');
        const hash = createHash('md5').update(htmlContent).digest('hex');
        
        models.push({
          name: `[GOLD] ${formatModelName(filename)}`,
          htmlContent,
          filePath,
          createdTime: stats.birthtime,
          hash,
        });
      } catch (error) {
        console.warn(`Failed to load gold file from ${file}:`, error);
      }
    }
  } catch (error) {
    console.warn('Gold directory not found or inaccessible:', error);
  }
  
  // Load model responses
  const modelResponsesDir = './model-responses';
  try {
    const files = readdirSync(modelResponsesDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    for (const file of htmlFiles) {
      try {
        const filePath = join(modelResponsesDir, file);
        const stats = statSync(filePath);
        const htmlContent = readFileSync(filePath, 'utf-8');
        const filename = basename(file, '.html');
        const hash = createHash('md5').update(htmlContent).digest('hex');
        
        models.push({
          name: formatModelName(filename),
          htmlContent,
          filePath,
          createdTime: stats.birthtime,
          hash,
        });
      } catch (error) {
        console.warn(`Failed to load model from ${file}:`, error);
      }
    }
  } catch (error) {
    console.warn('Model responses directory not found or inaccessible:', error);
  }

  return models.sort((a, b) => {
    // Gold files first, then by creation time
    const aIsGold = a.name.startsWith('[GOLD]');
    const bIsGold = b.name.startsWith('[GOLD]');
    
    if (aIsGold && !bIsGold) return -1;
    if (!aIsGold && bIsGold) return 1;
    
    return a.createdTime.getTime() - b.createdTime.getTime();
  });
}

function checkZIndexFixes(htmlContent: string): {
  fixedInvalidZIndex: boolean;
  removedExtraZIndex: boolean;
  usedCustomZIndex: boolean;
  details: string[];
  modalMatch: boolean;
} {
  const details: string[] = [];
  
  // Check for invalid z-index classes (z-60, z-70, etc.)
  const invalidZIndexPattern = /z-(?:60|70|80|90|[1-9][0-9]{2,})/g;
  const invalidMatches = htmlContent.match(invalidZIndexPattern);

  // Check for HTML element presence
  const modalPattern = /<div[^>]*id="modal"[^>]*>/;
  const modalMatch = htmlContent.match(modalPattern)?.length === 1;

  const fixedInvalidZIndex = (!invalidMatches || invalidMatches.length === 0) && modalMatch;
  
  if (!fixedInvalidZIndex) {
    details.push(`Found invalid z-index classes: ${invalidMatches?.join(', ')}`);
  }
  
  // Check for custom z-index values like z-[60], z-[70], etc.
  const customZIndexPattern = /z-\[(?:60|70|80|90|[1-9][0-9]{2,})\]/g;
  const customMatches = htmlContent.match(customZIndexPattern);
  const usedCustomZIndex = !!(customMatches && customMatches.length > 0);
  
  // Check for unnecessary z-index classes (like on Save Settings button)
  const saveButtonPattern = /<button[^>]*class="[^"]*bg-green-500[^"]*"[^>]*>/;
  const saveButtonMatch = htmlContent.match(saveButtonPattern);
  const saveButtonHasZIndex = saveButtonMatch && saveButtonMatch[0].includes('z-');
  
  // Check for unnecessary z-index on modal content div
  const modalContentPattern = /<div[^>]*class="[^"]*bg-white[^"]*rounded-lg[^"]*p-6[^"]*max-w-md[^"]*w-full[^"]*mx-4[^"]*"[^>]*>/;
  const modalContentMatch = htmlContent.match(modalContentPattern);
  const modalContentHasZIndex = modalContentMatch && modalContentMatch[0].includes('z-');
  
  const removedExtraZIndex = !saveButtonHasZIndex && !modalContentHasZIndex;
  
  if (saveButtonHasZIndex) {
    details.push('Save Settings button still has unnecessary z-index class');
  }
  if (modalContentHasZIndex) {
    details.push('Modal content div still has unnecessary z-index class');
  }
  
  return {
    fixedInvalidZIndex,
    removedExtraZIndex,
    usedCustomZIndex,
    details,
    modalMatch
  };
}

function calculateScore(config: ModelConfig): {
  score: number;
  breakdown: string[];
} {
  const breakdown: string[] = [];
  let score = 1; // Base score for not identifying bug
  
  const zIndexAnalysis = checkZIndexFixes(config.htmlContent);
  
  // Main scoring criteria
  if (zIndexAnalysis.fixedInvalidZIndex) {
    score = 9; // Bug identified and fixed
    breakdown.push('✓ Fixed invalid z-index classes');
  } else {
    // Check if modal is present
    if (!zIndexAnalysis.modalMatch) {
      score = 1; // Bug not identified
      breakdown.push('✗ Did not fix invalid z-index classes');
      return { score, breakdown };
    }

    // Check if they at least identified some z-index issues
    const originalAnalysis = checkZIndexFixes(originalHTML);
    if (zIndexAnalysis.details.length < originalAnalysis.details.length) {
      score = 7; // Bug identified but not fully fixed
      breakdown.push('⚠ Partially fixed z-index issues');
    } else {
      score = 1; // Bug not identified
      breakdown.push('✗ Did not fix invalid z-index classes');
    }
  }
  
  // Additional components
  if (zIndexAnalysis.removedExtraZIndex) {
    score += 0.25;
    breakdown.push('✓ Removed extra z-index values');
  }
  
  if (zIndexAnalysis.usedCustomZIndex) {
    score += 0.25;
    breakdown.push('✓ Uses correct custom values syntax (e.g., z-[60])');
  }
  
  return { score: Math.min(score, 10), breakdown };
}

function testModel(config: ModelConfig): void {
  const result = calculateScore(config);
  
  console.log(`${config.name} (${config.hash.substring(0, 8)}): ${result.score.toFixed(2)}/10`);
  
  if (isVerbose) {
    result.breakdown.forEach(item => console.log(`    ${item}`));
    
    const zIndexAnalysis = checkZIndexFixes(config.htmlContent);
    if (zIndexAnalysis.details.length > 0) {
      zIndexAnalysis.details.forEach(detail => console.log(`    - ${detail}`));
    }
  }
}

function main() {
  try {
    const models = loadModelsFromDirectory();
    
    if (isVerbose) {
      console.log(`Found ${models.length} model responses to test:`);
      models.forEach(model => console.log(`  - ${model.name}`));
      console.log('');
    }
    
    models.forEach(model => testModel(model));
  } catch (error) {
    console.error('Failed to run tests:', error);
  }
}

main();