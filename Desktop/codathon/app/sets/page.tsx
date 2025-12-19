'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface QuestionSet {
  id: number;
  role: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | string;
  created_at: string;
}

export default function SetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchSets = async () => {
      try {
        setLoading(true);
        setError('');

        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        const res = await fetch(`/api/sets${params}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load question sets');
        } else {
          setSets(data.sets || []);
        }
      } catch (err) {
        setError('An error occurred while loading question sets');
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, [status, search]);

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

  const handleExport = (id: number) => {
    window.open(`/api/sets/${id}/export`, '_blank');
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
              <span className="text-gray-600">{session?.user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              My Question Sets
            </h2>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role or difficulty"
                className="flex-1 md:w-72 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <Link
                href="/generate"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Set
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-gray-600">Loading sets...</div>
          ) : sets.length === 0 ? (
            <div className="py-8 text-center text-gray-600">
              No question sets found.{' '}
              <Link href="/generate" className="text-blue-600 hover:text-blue-800">
                Generate your first set.
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Difficulty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sets.map((set) => (
                    <tr key={set.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {set.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {set.difficulty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(set.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link
                          href={`/sets/${set.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleExport(set.id)}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Export CSV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


