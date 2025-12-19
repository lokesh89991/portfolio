import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateQuestions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, difficulty } = await request.json();

    if (!role || !difficulty) {
      return NextResponse.json(
        { error: 'Role and difficulty are required' },
        { status: 400 }
      );
    }

    if (!['Junior', 'Mid', 'Senior'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be Junior, Mid, or Senior' },
        { status: 400 }
      );
    }

    // Generate questions using OpenAI
    const questions = await generateQuestions(role, difficulty as 'Junior' | 'Mid' | 'Senior');

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

