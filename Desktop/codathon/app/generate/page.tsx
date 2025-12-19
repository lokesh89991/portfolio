'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  question: string;
  modelAnswer: string;
  tags: string[];
}

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Junior');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please enter a role');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate questions');
      } else {
        setQuestions(data.questions || []);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      setError('No questions to save');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, difficulty, questions }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save question set');
      } else {
        alert('Question set saved successfully!');
        router.push('/sets');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleAnswer = (index: number) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAnswers(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Interview Question Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sets" className="text-gray-700 hover:text-gray-900">
                My Question Sets
              </Link>
              <span className="text-gray-600">{session?.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Interview Questions</h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Software Developer, Mobile App Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Junior' | 'Mid' | 'Senior')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Generating Questions...' : 'Generate Questions'}
            </button>
          </form>
        </div>

        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Generated Questions ({questions.length})
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Question Set'}
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">
                      Question {index + 1}: {q.question}
                    </h4>
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
                        <p className="text-gray-700">{q.modelAnswer}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {q.tags.map((tag, tagIndex) => (
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
          </div>
        )}
      </main>
    </div>
  );
}

