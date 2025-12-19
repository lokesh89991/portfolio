import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

// GET - List all question sets for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let query = 'SELECT * FROM question_sets WHERE user_id = ?';
    const params: any[] = [userId];

    if (search) {
      query += ' AND (role LIKE ? OR difficulty LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC';

    const sets = db.prepare(query).all(...params) as Array<{
      id: number;
      user_id: number;
      role: string;
      difficulty: string;
      created_at: string;
    }>;

    return NextResponse.json({ sets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching question sets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Save a new question set
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role, difficulty, questions } = await request.json();

    if (!role || !difficulty || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Role, difficulty, and questions array are required' },
        { status: 400 }
      );
    }

    if (questions.length !== 10) {
      return NextResponse.json(
        { error: 'Exactly 10 questions are required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Insert question set
    const setResult = db
      .prepare('INSERT INTO question_sets (user_id, role, difficulty) VALUES (?, ?, ?)')
      .run(userId, role, difficulty);

    const questionSetId = setResult.lastInsertRowid;

    // Insert questions
    const insertQuestion = db.prepare(
      'INSERT INTO questions (question_set_id, question_text, model_answer, tags, question_number) VALUES (?, ?, ?, ?, ?)'
    );

    const insertMany = db.transaction((questions: any[]) => {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        insertQuestion.run(
          questionSetId,
          q.question,
          q.modelAnswer,
          JSON.stringify(q.tags),
          i + 1
        );
      }
    });

    insertMany(questions);

    return NextResponse.json(
      { message: 'Question set saved successfully', setId: questionSetId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving question set:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

