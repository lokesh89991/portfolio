import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

// GET - Get a specific question set with all questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const setId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Get question set
    const questionSet = db
      .prepare('SELECT * FROM question_sets WHERE id = ? AND user_id = ?')
      .get(setId, userId) as {
      id: number;
      user_id: number;
      role: string;
      difficulty: string;
      created_at: string;
    } | undefined;

    if (!questionSet) {
      return NextResponse.json(
        { error: 'Question set not found' },
        { status: 404 }
      );
    }

    // Get questions
    const questions = db
      .prepare('SELECT * FROM questions WHERE question_set_id = ? ORDER BY question_number')
      .all(setId) as Array<{
      id: number;
      question_set_id: number;
      question_text: string;
      model_answer: string;
      tags: string;
      question_number: number;
    }>;

    return NextResponse.json({
      set: questionSet,
      questions: questions.map((q) => ({
        question: q.question_text,
        modelAnswer: q.model_answer,
        tags: JSON.parse(q.tags),
        questionNumber: q.question_number,
      })),
    });
  } catch (error) {
    console.error('Error fetching question set:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

