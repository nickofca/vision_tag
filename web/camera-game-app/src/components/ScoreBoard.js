import React from 'react';
import { useQuery } from 'react-query';
import {fetchScore} from "../api";


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