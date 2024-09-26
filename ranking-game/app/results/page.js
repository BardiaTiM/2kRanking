'use client';

import { useState } from 'react';

const friends = ['Alice', 'Bob', 'Charlie', 'Dave'];

export default function RankingForm() {
  const [step, setStep] = useState(1);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [rankings, setRankings] = useState({});
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const handleConfirmIdentity = () => {
    if (!selectedFriend) {
      setMessage('Please select who you are.');
    } else {
      setStep(2);
      setMessage('');
    }
  };

  const handleRankingChange = (friend, value) => {
    setRankings({ ...rankings, [friend]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(rankings).length !== friends.length - 1) {
      setMessage('Please rank all friends except yourself.');
      return;
    }

    try {
      const res = await fetch('/api/submit-ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voter: selectedFriend, rankings }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }

      setMessage('Ranking submitted successfully!');
      setHasVoted(true);
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Rank Your Friends</h1>

        {step === 1 && (
          <>
            <label className="block text-lg font-medium mb-2">Select Who You Are:</label>
            <select
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="">--Select Your Name--</option>
              {friends.map((friend) => (
                <option key={friend} value={friend}>
                  {friend}
                </option>
              ))}
            </select>
            <button
              onClick={handleConfirmIdentity}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Confirm Identity
            </button>
          </>
        )}

        {step === 2 && !hasVoted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {friends
              .filter((friend) => friend !== selectedFriend)
              .map((friend) => (
                <div key={friend} className="flex items-center space-x-4">
                  <label className="flex-1 text-lg">{friend}</label>
                  <input
                    type="number"
                    min="1"
                    max={friends.length - 1}
                    value={rankings[friend] || ''}
                    onChange={(e) => handleRankingChange(friend, e.target.value)}
                    className="w-16 p-2 border border-gray-300 rounded-md text-center"
                    required
                  />
                </div>
              ))}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Submit Rankings
            </button>
          </form>
        )}

        {hasVoted && (
          <p className="text-green-600 font-semibold mt-4 text-center">
            Thank you! You have successfully submitted your rankings.
          </p>
        )}

        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}
