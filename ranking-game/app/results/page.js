'use client';

import { useEffect, useState } from 'react';

export default function Results() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/get-results');
        const data = await res.json();

        if (!res.ok) {
          setError('Error fetching results');
          return;
        }

        setResults(data);
      } catch (error) {
        setError('An unexpected error occurred.');
      }
    };

    fetchResults();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!results) {
    return <p className="text-gray-500 text-center mt-4">Loading results...</p>;
  }

  // Sort the results by average value in ascending order
  const sortedResults = Object.entries(results).sort((a, b) => a[1] - b[1]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Results</h1>
        <ul className="space-y-2">
          {sortedResults.map(([friend, average]) => (
            <li key={friend} className="flex justify-between items-center text-black">
              <span className="text-lg">{friend}:</span>
              <span className="font-semibold">{average.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
