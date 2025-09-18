import { useState,useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import EvaluationBar from "./EvaluationBar";
import {useParams} from 'react-router-dom';
function Getgames() {
  const {gameId} = useParams();
 const [gamestatus,setgamestatus] = useState(null);
 const [currentMove,setCurrentMove] = useState(0);
  const [showeval,setshoweval] = useState(false);
  const [evaldata,seteval] = useState(null);
  const [moves, setMoves] = useState([]);
 const [game, setGame] = useState(new Chess());
 const [op,newop] = useState(null);
   const fetchgame = async() =>
   {
     try{
        const response = await fetch(`https://lichess.org/game/export/${gameId}`,{ headers: { 'Accept': 'application/json' }}
          
      );
      if(!response.ok)
      {
         if (response.status === 404) {
          setgamestatus("no_game");
          return null;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response);
      const data = await response.json();
      console.log("API response",data);
      setgamestatus(data.status || null);
      const newMoves = data.moves.split(' ');
      const chess = new Chess();
      newMoves.forEach(move => {chess.move(move);});
      setGame(chess);
      setgamestatus(data.status || null);
      fetcheval(chess.fen());
      setMoves(newMoves);
      if(data.opening)
      {
        newop(data.opening.name);
      }
      else{
        console.log("Not found");
      }
      setCurrentMove(0);
      
     }catch(error)
     {
      console.error("Error fetching game:", error);
      return null;
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
  useEffect(() => {
    fetchgame();
  });
   const gottomove = (moveIndex) => {
     const chess = new Chess();
     for(let i = 0;i<moveIndex;i++)
     {
       try{
         chess.move(moves[i]);
       }catch(error)
       {
         console.error("Invalid move skipped:", moves[i], error);
       }
     }
     setGame(chess);
     fetcheval(chess.fen());
     setCurrentMove(moveIndex);
   };
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
return(
    <div>
   
      <div className = "one">Opening : {op}</div>
      <div className = "one">Status : {formatGameStatus(gamestatus)}</div>
      <div></div>
      <div className = "eval-row">
        <button onClick = {() => setshoweval((prev) => !prev)}>{showeval ? "Hide Evaluation" : "Show Evaluation"}</button>
        {showeval && (<p>Evaluation : {evaldata ?.evaluation}</p>)}
        </div>
         <div className = "container">
        <Chessboard position={game.fen()} />
        <div className = "two"><EvaluationBar value={parseFloat(evaldata?.evaluation)} /></div>
      </div>
        <div className = "button-row">
      <button className = "button"onClick={() => gottomove(currentMove-1)} disabled = {currentMove === 0}>Previous Move</button>
      <button className = "button"onClick={() => gottomove(currentMove+1)} disabled = {currentMove >= moves.length}>Next Move</button>
      </div>
      </div>
);
}
export default Getgames;