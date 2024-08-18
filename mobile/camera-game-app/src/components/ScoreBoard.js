import React from 'react';
import { useQuery } from 'react-query';

function fetchScore() {
  // Replace with your actual API endpoint
  return fetch('/api/score')
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching score:', error);
      return { score: 0 }; // Default score in case of error
    });
}

function ScoreBoard() {
  // Using react-query to fetch the latest score
  const { data, error, isLoading } = useQuery('gameScore', fetchScore);

  if (isLoading) {
    return <div>Loading score...</div>;
  }

  if (error) {
    return <div>Error loading score</div>;
  }

  return (
    <div style={{ position: 'absolute', top: 20, right: 20 }}>
      <h2>Score: {data.score}</h2>
    </div>
  );
}

export default ScoreBoard;