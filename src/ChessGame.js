import { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {useParams} from 'react-router-dom';

function LichessGamePlayer() {
  const {username} = useParams();
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [evaluation,setevaluation] = useState(null);
  const [op,newop] = useState("Unknown");
  const [whiteAccuracy, setWhiteAccuracy] = useState("N/A");
 const [blackAccuracy, setBlackAccuracy] = useState("N/A");


  const fetchGame = async () => {
    try {
      const response = await fetch(`https://lichess.org/api/user/${username}/current-game`, {
        headers: { 'Accept': 'application/json' }
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          setGameStatus("no_game");
          return null;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setGameStatus(data.status || null);
      console.log("API Response:", data);
  
      if (!data?.moves || typeof data.moves !== 'string') {
        throw new Error("Moves not found in response.");
      }
      
      const newMoves = data.moves.split(' ');
      setMoves(newMoves);
      if(data.opening)
      {
       newop(data.opening.name);
      }
      else{
        console.log("Not found");
      }
      setCurrentMove(0);
      if(data.moves)
      {
        fetcheval(data.id);
      }

      
      return newMoves;
    } catch (error) {
      console.error("Error fetching game:", error);
      setGameStatus("error");
      return null;
    }
  };

  const fetchPlayerInfo = async () => {
    try {
      const response = await fetch(`https://lichess.org/api/user/${username}`);
      if (!response.ok) throw new Error("Failed to fetch player info");
      const data = await response.json();
      setPlayerInfo(data);
    } catch (error) {
      console.error("Error fetching player info:", error);
    }
  };
  const fetcheval = async (id) => {
    try {
      const response = await fetch(
        `https://lichess.org/game/export/${id}?evals=true&pgnInJson=true&accuracy=1`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch game evaluation");
  
      const data = await response.json();
      console.log("Game Data:", data);
  
      // Extract evaluations
      if (data.analyses && data.analyses.length > 0) {
        const lastEval = data.analyses[data.analyses.length - 1]?.eval;
        setevaluation(lastEval !== undefined ? lastEval : "N/A");
      } else {
        setevaluation("N/A");
      }
  
      // Extract accuracy for both players
      if (data.accuracy) {
        const whiteAccuracy = data.accuracy.white || "N/A";
        const blackAccuracy = data.accuracy.black || "N/A";
  
        console.log(`White Accuracy: ${whiteAccuracy}, Black Accuracy: ${blackAccuracy}`);
  
        setWhiteAccuracy(whiteAccuracy);
        setBlackAccuracy(blackAccuracy);
      } else {
        setWhiteAccuracy("N/A");
        setBlackAccuracy("N/A");
      }
  
    } catch (error) {
      console.error("Error fetching evaluation:", error);
    }
  };
  
  useEffect(() => {
    fetchPlayerInfo();
    fetchGame();
    
    const intervalId = setInterval(() => {
      if (gameStatus === "started") {
        fetchGame();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [username, gameStatus]);

  useEffect(() => {
    if (gameStatus !== "started") return;

    if (currentMove < moves.length) {
      const timer = setTimeout(() => {
        setGame((prevGame) => {
          const newGame = new Chess(prevGame.fen());
          try {
            newGame.move(moves[currentMove]);
            return newGame;
          } catch (error) {
            console.error("Invalid move skipped:", moves[currentMove], error);
            return prevGame;
          }
        });
        setCurrentMove((prevMove) => prevMove + 1);
      }, 0);
  
      return () => clearTimeout(timer);
    } else {
      const refreshTimer = setTimeout(() => {
        setMoves([]);
        setCurrentMove(0);
      }, 0);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [currentMove, moves, gameStatus]);

  const formatGameStatus = (status) => {
    switch (status) {
      case "started": return "Game in progress ";
      case "mate": return "Game over (Checkmate)";
      case "resign": return "Game over (Resignation)";
      case "no_game": return "No active game";
      case "error": return "Error fetching status";
      default: return "Error";
    }
  };
  

  return (
    <div>
      {playerInfo && (
        <div >
          <h2 className = "player">Player: {playerInfo?.username}</h2>
          <p className = "one">Blitz Rating: {playerInfo?.perfs?.blitz?.rating || "N/A"}</p>
          <p className = "one"> Rapid Rating: {playerInfo?.perfs?.bullet?.rating || "N/A"}</p>
          <p className = "one">Games Played: {playerInfo?.count?.all || "N/A"}</p>
          <p className = "one">Opening : {op}</p>
          <p className = "one">Accuracy : {whiteAccuracy}</p>
          <p className = "one">Accuracy : {blackAccuracy}</p>
          
        </div>
      )}
      <div className="one">
        Status: {formatGameStatus(gameStatus)}
      </div>
      <div className = "one">
        Evaluation : {evaluation !== null ? evaluation : "Loading"}
      </div>
      <div className="container">
        <Chessboard position={game.fen()} />
      </div>
    </div>
  );
}

export default LichessGamePlayer;
