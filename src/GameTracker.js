import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chess } from 'chess.js';

const GameTracker = () => {
  const [gameId, setGameId] = useState('');
  const [moves, setMoves] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGameMoves = async () => {
    if (!gameId) {
      setError('Please enter a Lichess game ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setMoves([]);

    try {
      const response = await axios.get(`https://lichess.org/game/export/${gameId}`);
      const gameData = response.data;

      // Extract moves from the PGN (Portable Game Notation)
      const pgnMoves = gameData.split('\n').pop().trim();
      const movesList = pgnMoves.split(/\s+/);
      
      const game = new Chess();
      const moveHistory = [];

      for (let i = 0; i < movesList.length; i++) {
        // Skip move numbers (e.g., '1.', '2.')
        if (movesList[i].includes('.')) {
          continue;
        }

        const moveSan = movesList[i];
        game.move(moveSan);
        
        moveHistory.push({
          moveNumber: Math.ceil((i + 1) / 2),
          player: i % 2 === 0 ? 'White' : 'Black',
          move: moveSan,
          fen: game.fen(),
        });
      }
      setMoves(moveHistory);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch game. Please check the ID or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGameMoves();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Lichess Game Tracker</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Lichess Game ID"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Loading...' : 'Track Game'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {moves.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Game Moves</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={tableHeaderStyle}>Move #</th>
                <th style={tableHeaderStyle}>Player</th>
                <th style={tableHeaderStyle}>Move</th>
                <th style={tableHeaderStyle}>FEN String</th>
              </tr>
            </thead>
            <tbody>
              {moves.map((move, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{move.moveNumber}</td>
                  <td style={tableCellStyle}>{move.player}</td>
                  <td style={tableCellStyle}>{move.move}</td>
                  <td style={{ ...tableCellStyle, fontSize: '12px', wordBreak: 'break-all' }}>{move.fen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const tableHeaderStyle = { padding: '10px', textAlign: 'left', border: '1px solid #ddd' };
const tableCellStyle = { padding: '10px', border: '1px solid #ddd' };

export default GameTracker;