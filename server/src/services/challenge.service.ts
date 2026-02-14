import { v4 as uuid } from 'uuid';
import { message } from './claude.service';
import { UserProfile, DeepDive, Challenge } from '../types';

function buildSystemPrompt(profile: UserProfile): string {
  return `You are DevCoach, generating a quiz to test understanding of a technical topic.

User profile:
- Experience level: ${profile.experienceLevel}
- Stack: ${profile.stack.join(', ')}

Generate exactly 5 multiple-choice questions calibrated to the user's ${profile.experienceLevel} experience level.
Each question should have exactly 4 options with one correct answer.

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is the correct answer"
    }
  ]
}`;
}

export async function generateChallenge(
  deepDive: DeepDive,
  profile: UserProfile,
): Promise<Challenge> {
  const response = await message({
    system: buildSystemPrompt(profile),
    userMessage: `Generate a quiz based on this deep dive:\n\nTitle: ${deepDive.title}\n\nWhat it is: ${deepDive.whatItIs}\n\nStack relationship: ${deepDive.stackRelationship}`,
    maxTokens: 4096,
  });

  let jsonStr = response;
  const fenceMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1];
  }

  const parsed = JSON.parse(jsonStr.trim());

  return {
    id: uuid(),
    deepDiveId: deepDive.id,
    title: deepDive.title,
    questions: (parsed.questions || []).map((q: any) => ({
      id: uuid(),
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })),
    generatedAt: new Date().toISOString(),
  };
}
