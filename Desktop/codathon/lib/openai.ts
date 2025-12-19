import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Question {
  question: string;
  modelAnswer: string;
  tags: string[];
}

export interface GenerateQuestionsResponse {
  questions: Question[];
}

/**
 * Generate interview questions using OpenAI
 * 
 * Prompt engineering strategy:
 * - Single pass generation for efficiency
 * - Structured JSON output for easy parsing
 * - Clear instructions for role, difficulty, and output format
 */
export async function generateQuestions(
  role: string,
  difficulty: 'Junior' | 'Mid' | 'Senior'
): Promise<Question[]> {
  const prompt = `You are an expert interview question generator. Generate exactly 10 interview questions for a ${role} position at ${difficulty} level.

For each question, provide:
1. The question text (clear and specific)
2. A concise model answer (2-3 sentences that demonstrate expected knowledge)
3. Relevant tags (skills, topics, and difficulty level)

Return the response as a JSON array with this exact structure:
[
  {
    "question": "Question text here",
    "modelAnswer": "Expected answer here (2-3 sentences)",
    "tags": ["skill1", "skill2", "topic", "${difficulty}"]
  },
  ...
]

Ensure questions are:
- Relevant to the ${role} role
- Appropriate for ${difficulty} level
- Cover different aspects (technical, behavioral, problem-solving)
- Include tags that reflect skills, technologies, and topics`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates interview questions in JSON format. Always return valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const parsed = JSON.parse(content);
    
    // Handle both {questions: [...]} and [...] formats
    const questions = parsed.questions || parsed;
    
    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error(`Expected 10 questions, got ${questions.length}`);
    }

    // Validate structure
    return questions.map((q: any, index: number) => ({
      question: q.question || `Question ${index + 1}`,
      modelAnswer: q.modelAnswer || 'No answer provided',
      tags: Array.isArray(q.tags) ? q.tags : [q.tags || difficulty],
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

