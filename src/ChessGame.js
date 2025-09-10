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

  const [op,newop] = useState("Unknown");
  const [whiteAccuracy, setWhiteAccuracy] = useState("N/A");
 const [blackAccuracy, setBlackAccuracy] = useState("N/A");
const [evaldata,seteval] = useState(null);

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
      const chess = new Chess();
      newMoves.forEach(move => {
        try {
          chess.move(move);
        } catch (error) {   
          console.error("Invalid move skipped:", move, error);
        }
      });
     const fen = chess.fen();
     fetcheval(fen);
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
  const fetcheval = async (fen) => {
      try {
        const response = await fetch(`https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=15`);
        if (!response.ok) throw new Error("Failed to fetch evaluation");
        const evaldata = await response.json();
        seteval(evaldata);
        console.log(evaldata);
      console.log("Evaluation Data:", evaldata);
    }catch(error)
    {
      console.error("Error fetching evaluation:", error);
    }
  };
        



  return (
    <div>
      {playerInfo && (
        <div >
          <h2 className = "player">Player: {playerInfo?.username}</h2>
          <p className = "one">Blitz Ratin: {playerInfo?.perfs?.blitz?.rating || "N/A"}</p>
          <p className = "one"> Bullet Rating: {playerInfo?.perfs?.bullet?.rating || "N/A"}</p>
          <p className = "one">Games Played: {playerInfo?.count?.all || "N/A"}</p>
          <p className = "one">Opening : {op}</p>
          <p className = "one">Evaluation : {evaldata?.evaluation}</p>
          <p className = "one">Best Continuation :{evaldata?.bestmove}</p>
          
        </div>
      )}
      <div className="one">
        Status: {formatGameStatus(gameStatus)}
      </div>
     
      <div className="container">
        <Chessboard position={game.fen()} />
      </div>
    </div>
  );
}

export default LichessGamePlayer
