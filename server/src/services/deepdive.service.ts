import { v4 as uuid } from 'uuid';
import { message } from './claude.service';
import { UserProfile, DigestItem, DeepDive } from '../types';

function buildSystemPrompt(profile: UserProfile): string {
  return `You are DevCoach, generating an in-depth technical deep dive for a developer.

User profile:
- Stack: ${profile.stack.join(', ')}
- Primary language: ${profile.primaryLanguage}
- Experience level: ${profile.experienceLevel}

Generate a comprehensive deep dive that includes:
1. **What it is**: Clear explanation of the topic/technology
2. **Stack relationship**: How this relates to and impacts the user's specific stack
3. **Code examples**: Practical code examples in ${profile.primaryLanguage} (or the most relevant language)
4. **Adoption verdict**: Using the Thoughtworks Technology Radar scale (Hold, Assess, Trial, Adopt)

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "whatItIs": "Detailed explanation...",
  "stackRelationship": "How it relates to their stack...",
  "codeExamples": [
    {
      "language": "typescript",
      "title": "Example title",
      "code": "// code here",
      "explanation": "What this demonstrates"
    }
  ],
  "adoptionVerdict": {
    "stage": "Assess",
    "reasoning": "Why this rating..."
  }
}`;
}

export async function generateDeepDive(
  item: DigestItem,
  profile: UserProfile,
): Promise<DeepDive> {
  const response = await message({
    system: buildSystemPrompt(profile),
    userMessage: `Generate a deep dive on: "${item.title}"\n\nSummary: ${item.summary}\n\nSource URL: ${item.url}\n\nTopics: ${item.topics.join(', ')}`,
    maxTokens: 8192,
  });

  let jsonStr = response;
  const fenceMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    id: uuid(),
    digestItemId: item.id,
    title: item.title,
    whatItIs: parsed.whatItIs || '',
    stackRelationship: parsed.stackRelationship || '',
    codeExamples: parsed.codeExamples || [],
    adoptionVerdict: parsed.adoptionVerdict || {
      stage: 'Assess',
      reasoning: '',
    },
    generatedAt: new Date().toISOString(),
  };
}
