import React, { useState } from "react";
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import EvaluationBar from "./EvaluationBar";
import { useEffect } from "react";
import Mychart from "../Mychart";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function Analysis()
{
   const [moves,setmoves] = useState(0);
   const [text,settext] = useState("");
   const [currentMove,setCurrentMove] = useState(0);
   const [game, setGame] = useState(new Chess());
   const [evaldata,seteval] = useState(null);  
   const [evaluations, setEvaluations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [showchart,setshowchart] = useState(false);
   const fetcheval = async (fen) => {
      try {
        const response = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({fen}),
        });
        if (!response.ok) throw new Error("Failed to fetch evaluation");
        const evaldata = await response.json();
        seteval(evaldata);
        console.log(evaldata);
        if (evaldata?.eval !== undefined && evaldata?.eval !== null) {
      const parsed = evaldata?.eval;
      if (!isNaN(parsed)) {
        setEvaluations((prev) => [...prev, parsed]); 
      }
    }
    console.log("Evaluations Array:", evaluations);
    console.log("Evaluation Data:", evaldata);
    }catch(error)
    {
      console.error("Error fetching evaluation:", error);
    }
  };
  useEffect(() => {
     const str = text.split(" ");
     console.log("input",str);
     setmoves(str);
     console.log("Moves Array:",str);
  },[text])
  
   const gottomove = (moveIndex) => {
    const chess = new Chess();
    console.log(moveIndex)
   for(let i = 0;i<moveIndex;i++)
   {
      try{
      console.log("Moves made",moves[i])
       chess.move(moves[i]);
      }catch(error)
      {
      console.error("Invalid move skipped:", moves[i], error);
      }
   }
      setGame(chess);
      console.log("Moves Length",moves.length);
      fetcheval(chess.fen());
      setCurrentMove(moveIndex);
  
   };
    const gotochart = () => {
    setshowchart(true); // Just toggle to show chart
  };

   return(
      <div>
    
     <div className = "container">
      <textarea
   value={text}
   onChange={(e) => settext(e.target.value)}
      placeholder= "Enter  your analysis here..."
      rows={5}
      style={{
         width: "100%",
         padding: "10px",
         fontSize: "16px"
            }}
            />
      </div>
      <div className = "container">
        <div className = "container">
          <div className =  "board-wrapper">
           <div className = "shadow">
            <Chessboard
          position={game.fen()}
         />
          </div>
          </div>
          <div className = "two" > <EvaluationBar value={parseFloat(evaldata?.eval)} /></div>
         </div>
      </div>
      <div className = "button-row">
       <button className = "button"onClick={() => {gottomove(currentMove-1)}} disabled = {currentMove === 0}>Previous Move</button>
      <button className = "button"onClick={() => gottomove(currentMove+1)} disabled = {currentMove >= moves.length}>Next Move</button>
      </div>
    <Mychart evaluation={evaluations}movesarray={moves} />

      </div>
   );
}
export default  Analysis;