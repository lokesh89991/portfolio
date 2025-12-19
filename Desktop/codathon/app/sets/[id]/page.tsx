'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuestionSet {
  id: number;
  role: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | string;
  created_at: string;
}

interface Question {
  question: string;
  modelAnswer: string;
  tags: string[];
  questionNumber: number;
}

export default function QuestionSetDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();

  const [setInfo, setSetInfo] = useState<QuestionSet | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch question set details
  useEffect(() => {
    if (status !== 'authenticated') return;
    const id = params?.id;
    if (!id) return;

    const fetchSet = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`/api/sets/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load question set');
        } else {
          setSetInfo(data.set);
          setQuestions(data.questions || []);
        }
      } catch (err) {
        setError('An error occurred while loading the question set');
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [status, params]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleExport = () => {
    if (!setInfo) return;
    window.open(`/api/sets/${setInfo.id}/export`, '_blank');
  };

  const toggleAnswer = (index: number) => {
    const next = new Set(expandedAnswers);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedAnswers(next);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Interview Question Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/generate" className="text-gray-700 hover:text-gray-900">
                Generate Questions
              </Link>
              <Link href="/sets" className="text-gray-700 hover:text-gray-900">
                My Question Sets
              </Link>
              <span className="text-gray-600">{session?.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading || !setInfo ? (
            <div className="py-8 text-center text-gray-600">
              {loading ? 'Loading question set...' : 'Question set not found'}
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {setInfo.role}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Difficulty: <span className="font-medium">{setInfo.difficulty}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Created at:{' '}
                    <span className="font-medium">
                      {new Date(setInfo.created_at).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Export CSV
                  </button>
                </div>
              </div>

              {questions.length === 0 ? (
                <div className="py-8 text-center text-gray-600">
                  No questions found for this set.
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          Question {q.questionNumber ?? index + 1}: {q.question}
                        </h3>
                      </div>

                      <div className="mb-2">
                        <button
                          onClick={() => toggleAnswer(index)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {expandedAnswers.has(index) ? 'Hide' : 'Show'} Model Answer
                        </button>
                        {expandedAnswers.has(index) && (
                          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                            <p className="text-gray-700 whitespace-pre-line">
                              {q.modelAnswer}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {q.tags?.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}


