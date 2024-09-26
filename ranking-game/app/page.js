// app/page.js
'use client';

import { useState } from 'react';

const friends = ['Alice', 'Bob', 'Charlie', 'Dave'];

export default function RankingForm() {
  const [selectedFriend, setSelectedFriend] = useState('');
  const [rankings, setRankings] = useState({});
  const [message, setMessage] = useState('');

  const handleRankingChange = (friend, value) => {
    setRankings({ ...rankings, [friend]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFriend) {
      setMessage('Please select who you are.');
      return;
    }

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
      setSelectedFriend('');
      setRankings({});
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h1>Rank Your Friends</h1>
      <form onSubmit={handleSubmit}>
        <label>Select Who You Are:</label>
        <select
          value={selectedFriend}
          onChange={(e) => setSelectedFriend(e.target.value)}
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
            <div key={friend}>
              <label>{friend}</label>
              <input
                type="number"
                min="1"
                max={friends.length - 1}
                value={rankings[friend] || ''}
                onChange={(e) => handleRankingChange(friend, e.target.value)}
                required
              />
            </div>
          ))}
        <button type="submit">Submit Rankings</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
