import { cleanMarkdown } from './cleanMarkdown.ts';
import { cleanMarkdown as cleanMarkdownGpt41 } from './model-responses/gpt-4.1.ts';
import { cleanMarkdown as cleanMarkdownSonnet4 } from './model-responses/sonnet-4.ts';
import { cleanMarkdown as cleanMarkdownGemini25Pro } from './model-responses/gemini-2.5-pro.ts';
import { cleanMarkdown as cleanMarkdownOpus4 } from './model-responses/opus-4.ts';
import { cleanMarkdown as cleanMarkdownDeepSeekV3 } from './model-responses/deepseek-v3.ts';
import { cleanMarkdown as cleanMarkdownO3 } from './model-responses/o3.ts';
import { cleanMarkdown as cleanMarkdownGrok4 } from './model-responses/grok-4.ts';
import { cleanMarkdown as cleanMarkdownKimiK2DeepInfra1 } from './model-responses/kimi-k2-deepinfra-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2DeepInfra2 } from './model-responses/kimi-k2-deepinfra-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2DeepInfra3 } from './model-responses/kimi-k2-deepinfra-3.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Groq1 } from './model-responses/kimi-k2-groq-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Groq2 } from './model-responses/kimi-k2-groq-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Groq3 } from './model-responses/kimi-k2-groq-3.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Moonshot1 } from './model-responses/kimi-k2-moonshot-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Moonshot2 } from './model-responses/kimi-k2-moonshot-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Moonshot3 } from './model-responses/kimi-k2-moonshot-3.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Together1 } from './model-responses/kimi-k2-together-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Together2 } from './model-responses/kimi-k2-together-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Together3 } from './model-responses/kimi-k2-together-3.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Chutes1 } from './model-responses/kimi-k2-chutes-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Chutes2 } from './model-responses/kimi-k2-chutes-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2Chutes3 } from './model-responses/kimi-k2-chutes-3.ts';
import { cleanMarkdown as cleanMarkdownKimiK2MoonshotAiApi1 } from './model-responses/kimi-k2-moonshot-ai-api-1.ts';
import { cleanMarkdown as cleanMarkdownKimiK2MoonshotAiApi2 } from './model-responses/kimi-k2-moonshot-ai-api-2.ts';
import { cleanMarkdown as cleanMarkdownKimiK2MoonshotAiApi3 } from './model-responses/kimi-k2-moonshot-ai-api-3.ts';
import { cleanMarkdown as cleanMarkdownQwen3CoderOrAlibabaPlus1 } from './model-responses/qwen3-coder-or-alibaba-plus-1.ts';
import { cleanMarkdown as cleanMarkdownQwen3CoderOrAlibabaPlus2 } from './model-responses/qwen3-coder-or-alibaba-plus-2.ts';
import { cleanMarkdown as cleanMarkdownQwen3CoderOrAlibabaPlus3 } from './model-responses/qwen3-coder-or-alibaba-plus-3.ts';
import { cleanMarkdown as cleanMarkdownHorizonAlpha1 } from './model-responses/horizon-alpha-1.ts';
import { cleanMarkdown as cleanMarkdownHorizonAlpha2 } from './model-responses/horizon-alpha-2.ts';
import { cleanMarkdown as cleanMarkdownHorizonAlpha3 } from './model-responses/horizon-alpha-3.ts';
import { cleanMarkdown as cleanMarkdownHorizonAlpha4 } from './model-responses/horizon-alpha-4.ts';
import { cleanMarkdown as cleanMarkdownHorizonAlpha5 } from './model-responses/horizon-alpha-5.ts';
import { cleanMarkdown as cleanMarkdownGptOss120bCerebras1 } from './model-responses/gpt-oss-120b-cerebras-1.ts';
import { cleanMarkdown as cleanMarkdownGptOss120bCerebras2 } from './model-responses/gpt-oss-120b-cerebras-2.ts';
import { cleanMarkdown as cleanMarkdownGptOss120bCerebras3 } from './model-responses/gpt-oss-120b-cerebras-3.ts';

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
    const diff = diffChars(expectedOutputText.trim(), cleanedText.trim()).filter(
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
  {
    name: 'Kimi K2 DeepInfra 1',
    cleanFunction: cleanMarkdownKimiK2DeepInfra1,
    outputPath: './model-responses/kimi-k2-deepinfra-1.md',
  },
  {
    name: 'Kimi K2 DeepInfra 2',
    cleanFunction: cleanMarkdownKimiK2DeepInfra2,
    outputPath: './model-responses/kimi-k2-deepinfra-2.md',
  },
  {
    name: 'Kimi K2 DeepInfra 3',
    cleanFunction: cleanMarkdownKimiK2DeepInfra3,
    outputPath: './model-responses/kimi-k2-deepinfra-3.md',
  },
  {
    name: 'Kimi K2 Groq 1',
    cleanFunction: cleanMarkdownKimiK2Groq1,
    outputPath: './model-responses/kimi-k2-groq-1.md',
  },
  {
    name: 'Kimi K2 Groq 2',
    cleanFunction: cleanMarkdownKimiK2Groq2,
    outputPath: './model-responses/kimi-k2-groq-2.md',
  },
  {
    name: 'Kimi K2 Groq 3', 
    cleanFunction: cleanMarkdownKimiK2Groq3,
    outputPath: './model-responses/kimi-k2-groq-3.md',
  },
  {
    name: 'Kimi K2 Moonshot 1',
    cleanFunction: cleanMarkdownKimiK2Moonshot1,
    outputPath: './model-responses/kimi-k2-moonshot-1.md',
  },
  {
    name: 'Kimi K2 Moonshot 2', 
    cleanFunction: cleanMarkdownKimiK2Moonshot2,
    outputPath: './model-responses/kimi-k2-moonshot-2.md',
  },
  {
    name: 'Kimi K2 Moonshot 3',
    cleanFunction: cleanMarkdownKimiK2Moonshot3,
    outputPath: './model-responses/kimi-k2-moonshot-3.md',
  },
  {
    name: 'Kimi K2 Together 1',
    cleanFunction: cleanMarkdownKimiK2Together1,
    outputPath: './model-responses/kimi-k2-together-1.md',
  },
  {
    name: 'Kimi K2 Together 2',
    cleanFunction: cleanMarkdownKimiK2Together2,
    outputPath: './model-responses/kimi-k2-together-2.md',
  },
  {
    name: 'Kimi K2 Together 3',
    cleanFunction: cleanMarkdownKimiK2Together3,
    outputPath: './model-responses/kimi-k2-together-3.md',
  },
  {
    name: 'Kimi K2 Chutes 1',
    cleanFunction: cleanMarkdownKimiK2Chutes1,
    outputPath: './model-responses/kimi-k2-chutes-1.md',
  },
  {
    name: 'Kimi K2 Chutes 2',
    cleanFunction: cleanMarkdownKimiK2Chutes2,
    outputPath: './model-responses/kimi-k2-chutes-2.md',
  },
  {
    name: 'Kimi K2 Chutes 3',
    cleanFunction: cleanMarkdownKimiK2Chutes3,
    outputPath: './model-responses/kimi-k2-chutes-3.md',
  },
  {
    name: 'Kimi K2 Moonshot AI API 1',
    cleanFunction: cleanMarkdownKimiK2MoonshotAiApi1,
    outputPath: './model-responses/kimi-k2-moonshot-ai-api-1.md',
  },
  {
    name: 'Kimi K2 Moonshot AI API 2',
    cleanFunction: cleanMarkdownKimiK2MoonshotAiApi2,
    outputPath: './model-responses/kimi-k2-moonshot-ai-api-2.md',
  },
  {
    name: 'Kimi K2 Moonshot AI API 3',
    cleanFunction: cleanMarkdownKimiK2MoonshotAiApi3,
    outputPath: './model-responses/kimi-k2-moonshot-ai-api-3.md',
  },
  {
    name: 'Qwen3 Coder or Alibaba Plus 1',
    cleanFunction: cleanMarkdownQwen3CoderOrAlibabaPlus1,
    outputPath: './model-responses/qwen3-coder-or-alibaba-plus-1.md',
  },
  {
    name: 'Qwen3 Coder or Alibaba Plus 2',
    cleanFunction: cleanMarkdownQwen3CoderOrAlibabaPlus2,
    outputPath: './model-responses/qwen3-coder-or-alibaba-plus-2.md',
  },
  {
    name: 'Qwen3 Coder or Alibaba Plus 3',
    cleanFunction: cleanMarkdownQwen3CoderOrAlibabaPlus3,
    outputPath: './model-responses/qwen3-coder-or-alibaba-plus-3.md',
  },
  {
    name: 'Horizon Alpha 1',
    cleanFunction: cleanMarkdownHorizonAlpha1,
    outputPath: './model-responses/horizon-alpha-1.md',
  },
  {
    name: 'Horizon Alpha 2',
    cleanFunction: cleanMarkdownHorizonAlpha2,
    outputPath: './model-responses/horizon-alpha-2.md',
  },
  {
    name: 'Horizon Alpha 3',
    cleanFunction: cleanMarkdownHorizonAlpha3,
    outputPath: './model-responses/horizon-alpha-3.md',
  },
  {
    name: 'Horizon Alpha 4',
    cleanFunction: cleanMarkdownHorizonAlpha4,
    outputPath: './model-responses/horizon-alpha-4.md',
  },
  {
    name: 'Horizon Alpha 5',
    cleanFunction: cleanMarkdownHorizonAlpha5,
    outputPath: './model-responses/horizon-alpha-5.md',
  },
  {
    name: 'GPT-OSS 120B Cerebras 1',
    cleanFunction: cleanMarkdownGptOss120bCerebras1,
    outputPath: './model-responses/gpt-oss-120b-cerebras-1.md',
  },
  {
    name: 'GPT-OSS 120B Cerebras 2',
    cleanFunction: cleanMarkdownGptOss120bCerebras2,
    outputPath: './model-responses/gpt-oss-120b-cerebras-2.md',
  },
  {   
    name: 'GPT-OSS 120B Cerebras 3',
    cleanFunction: cleanMarkdownGptOss120bCerebras3,
    outputPath: './model-responses/gpt-oss-120b-cerebras-3.md',
  },
];

models.forEach(model => testModel(model, inputText, expectedOutputText));