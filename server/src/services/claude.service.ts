import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export interface ClaudeMessageOptions {
  system: string;
  userMessage: string;
  maxTokens?: number;
}

export type ProgressCallback = (message: string) => void;

export async function messageWithWebSearch(
  opts: ClaudeMessageOptions,
  onProgress?: ProgressCallback,
): Promise<string> {
  onProgress?.('Connecting to Claude...');

  const stream = await client.messages.stream({
    model: config.claudeModel,
    max_tokens: opts.maxTokens || 16000,
    system: opts.system,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 10,
      } as any,
    ],
    messages: [{ role: 'user', content: opts.userMessage }],
  });

  let searchCount = 0;
  let receivingText = false;

  stream.on('contentBlock', (block: any) => {
    if (block.type === 'server_tool_use' && block.name === 'web_search') {
      searchCount++;
      onProgress?.(`Searching the web (${searchCount})...`);
    }
    if (block.type === 'web_search_tool_result') {
      onProgress?.(`Processing search results (${searchCount})...`);
    }
    if (block.type === 'text' && !receivingText) {
      receivingText = true;
      onProgress?.('Building your personalized digest...');
    }
  });

  const response = await stream.finalMessage();
  const textBlocks = response.content.filter((b) => b.type === 'text');
  return textBlocks.map((b) => (b as any).text).join('\n');
}

export async function message(opts: ClaudeMessageOptions): Promise<string> {
  const response = await client.messages.create({
    model: config.claudeModel,
    max_tokens: opts.maxTokens || 8192,
    system: opts.system,
    messages: [{ role: 'user', content: opts.userMessage }],
  });

  const textBlocks = response.content.filter((b) => b.type === 'text');
  return textBlocks.map((b) => (b as any).text).join('\n');
}
