import { v4 as uuid } from 'uuid';
import { messageWithWebSearch, ProgressCallback } from './claude.service';
import { extractJSON } from './parse-json';
import { UserProfile, Digest, DigestItem } from '../types';

function buildSystemPrompt(profile: UserProfile): string {
  return `You are DevCoach, a personal developer intelligence assistant. Your job is to generate a daily developer news digest personalized for the user.

User profile:
- Name: ${profile.name}
- Stack: ${profile.stack.join(', ')}
- Primary language: ${profile.primaryLanguage}
- Experience level: ${profile.experienceLevel}
- Interests: ${profile.interests.join(', ')}

Generate exactly 9 digest items across 3 layers:
1. **Niche** (3 items): Deep, specialized content directly related to the user's stack and interests. Things only someone in their niche would care about.
2. **Core Stack** (3 items): Important updates, best practices, or notable developments in their core technologies.
3. **Wildcard** (3 items): Surprising, cross-disciplinary, or emerging tech that broadens their perspective.

For each item, search the web for REAL, CURRENT articles published recently. Each item must have an actual URL to a real article.

For each item, include a personalized "why it matters" explanation that connects the news to the user's specific stack and experience level.

Respond with ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "items": [
    {
      "title": "Article title",
      "summary": "2-3 sentence summary",
      "url": "https://actual-article-url.com",
      "source": "Source name",
      "layer": "niche|core-stack|wildcard",
      "whyItMatters": "Personalized explanation of relevance",
      "topics": ["topic1", "topic2"]
    }
  ]
}`;
}

function buildUserMessage(): string {
  const today = new Date().toISOString().split('T')[0];
  return `Generate my developer news digest for ${today}. Search for the latest and most relevant developer news, articles, and announcements from the past few days.`;
}

function parseDigestResponse(text: string, date: string): Digest {
  const parsed = extractJSON(text);
  const items: DigestItem[] = (parsed.items || []).map((item: any) => ({
    id: uuid(),
    title: item.title || 'Untitled',
    summary: item.summary || '',
    url: item.url || '',
    source: item.source || 'Unknown',
    layer: item.layer || 'wildcard',
    whyItMatters: item.whyItMatters || '',
    topics: item.topics || [],
  }));

  return {
    date,
    items,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateDigest(
  profile: UserProfile,
  onProgress?: ProgressCallback,
): Promise<Digest> {
  const today = new Date().toISOString().split('T')[0];

  const response = await messageWithWebSearch(
    {
      system: buildSystemPrompt(profile),
      userMessage: buildUserMessage(),
      maxTokens: 16000,
    },
    onProgress,
  );

  onProgress?.('Parsing digest...');
  return parseDigestResponse(response, today);
}
