import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { createObjectCsvWriter } from 'csv-writer';

// GET - Export question set as CSV
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

    // Prepare CSV data
    const csvData = questions.map((q) => ({
      'Question Number': q.question_number,
      Question: q.question_text,
      'Model Answer': q.model_answer,
      Tags: JSON.parse(q.tags).join(', '),
    }));

    // Generate CSV
    const csvWriter = createObjectCsvWriter({
      path: '/tmp/export.csv',
      header: [
        { id: 'Question Number', title: 'Question Number' },
        { id: 'Question', title: 'Question' },
        { id: 'Model Answer', title: 'Model Answer' },
        { id: 'Tags', title: 'Tags' },
      ],
    });

    await csvWriter.writeRecords(csvData);

    // Read CSV file
    const fs = await import('fs');
    const csvContent = fs.readFileSync('/tmp/export.csv', 'utf-8');

    // Return CSV as response
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="question-set-${setId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting question set:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

