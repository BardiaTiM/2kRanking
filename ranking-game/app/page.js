// app/page.js
'use client';

import { useState, useEffect } from 'react';

const friends = ['Smiff', 'AT', 'Lob', 'Atrain', 'Heez', 'Deevee', 'Shabaz', 'Naz'];

export default function RankingForm() {
  const [selectedFriend, setSelectedFriend] = useState('');
  const [rankings, setRankings] = useState({});
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  // Check for the 'hasVoted' cookie when the component mounts
  useEffect(() => {
    if (document.cookie.includes('hasVoted=true')) {
      setHasVoted(true);
      setMessage('You have already voted.');
    }
  }, []);

  const handleRankingChange = (friend, value) => {
    setRankings({ ...rankings, [friend]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFriend) {
      setMessage('Please select who you are.');
      return;
    }

    // Check if all friends except the selected one have been ranked
    const rankedFriends = friends.filter((friend) => friend !== selectedFriend);
    if (
      rankedFriends.some(
        (friend) => !rankings[friend] || rankings[friend] < 1 || rankings[friend] > friends.length - 1
      )
    ) {
      setMessage('Please rank all friends except yourself.');
      return;
    }

    // Check for duplicate ranks
    const ranks = Object.values(rankings);
    const uniqueRanks = new Set(ranks);

    if (ranks.length !== uniqueRanks.size) {
      setMessage('Each friend must have a unique rank.');
      return;
    }

    // Check if the selected friend is not ranked
    if (rankings[selectedFriend] !== undefined) {
      setMessage('You cannot rank yourself.');
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

      // Set a cookie to indicate that the user has voted
      document.cookie = 'hasVoted=true; max-age=31536000'; // Cookie expires in 1 year

      setMessage('Ranking submitted successfully!');
      setSelectedFriend('');
      setRankings({});
      setHasVoted(true); // Update the state to reflect that the user has voted
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">2K Official Overall MyPlayer Skill Ranking</h1>
        {hasVoted ? (
          <p className="text-red-500 text-center">{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-lg font-medium mb-2 text-black">Select Who You Are:</label>
            <select
              value={selectedFriend}
              onChange={(e) => setSelectedFriend(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black"
              required
            >
              <option value="">--Select Your Name--</option>
              {friends.map((friend) => (
                <option key={friend} value={friend}>
                  {friend}
                </option>
              ))}
            </select>

            {friends
              .filter((friend) => friend !== selectedFriend)
              .map((friend) => (
                <div key={friend} className="flex items-center space-x-4 mb-4">
                  <label className="flex-1 text-lg text-black">{friend}</label>
                  <input
                    type="number"
                    min="1"
                    max={friends.length - 1}
                    value={rankings[friend] || ''}
                    onChange={(e) => handleRankingChange(friend, e.target.value)}
                    className="w-16 p-2 border border-gray-300 rounded-md text-center text-black"
                    required
                  />
                </div>
              ))}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Submit Rankings
            </button>
          </form>
        )}
        {message && !hasVoted && <p className="text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}
