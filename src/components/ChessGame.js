import { useState, useEffect, use } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {useParams} from 'react-router-dom';
import EvaluationBar from "./EvaluationBar";
import GameTracker from "../GameTracker";
import Celebrations from "../Celebrations";
import Mychart from "../Mychart";
import { useNavigate } from "react-router-dom";
function LichessGamePlayer() {
  const {username} = useParams();
  const [game, setGame] = useState(new Chess());
  const [moves, setMoves] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [showeval,setshoweval] = useState(false);
  const [bg,setbg] = useState("white");
  const [op,newop] = useState("Unknown");
  const [prevcolor,setprecolor] = useState();
  const [compbg,setcompbg] = useState("aliceblue");
  const [arrows, setArrows] = useState([ ["",""]]);
  const [board,setboard] = useState("white");
  const [evaldata,seteval] = useState(null);  
  const [evaluations, setEvaluations] = useState([]);
  const [moveslen,setmoveslen] = useState(0);
 
  const navigate = useNavigate();

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
      const chess = new Chess();
      newMoves.forEach(move => {chess.move(move);});
      setGame(chess);
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
      
      return newMoves;
    } catch (error) {
      console.error("Error fetching game:", error);
      setGameStatus("error");
      return null;
    }
  };
  const gotochart = () => {
   
    navigate("/chart",{state:{evaluation:evaluations,movesarray:moves.length}});
    
  };
  const flipboard = (board) => {
    const newboard = board === "white" ? "black" : "white";
    setboard(newboard);
  }
 const changeBg = (color) => {
  const bgcolor = color=="white"? "#1e0e2a":"white";
   setbg(bgcolor);
   changecompbg(bg);
 }
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
  
 console.log()
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
  console.log("Moves Length",moves.length);
  fetcheval(chess.fen());
  setCurrentMove(moveIndex);
  
};
const changecompbg =  (color) => {
  const compbgcolor = color =="white" ?"#62b78e":"aliceblue";
  setcompbg(compbgcolor);

}


useEffect(() => {
  let start = null;
  let end = null;
  let str = "";
  if(evaldata?.text !== undefined){
   str = evaldata?.text.split(' ');
  }
  
  if (evaldata?.text && str != undefined) {
    
      start = str[1]; 
      end = str[3]; 
    
    setArrows([[start, end]]); 
  }
   console.log("data",str);
}, [evaldata]);




  return (

    <div style = {{backgroundColor:bg}} className = "celeb" >
      <div>
      {playerInfo && (
        <div >
          <h2 className = "player" style = {{backgroundColor:compbg}}>Player: {playerInfo?.username}</h2>
          <p className = "one" style = {{backgroundColor:compbg}}>Blitz Rating: {playerInfo?.perfs?.blitz?.rating || "N/A"}</p>
          <p className = "one" style = {{backgroundColor:compbg}}> Bullet Rating: {playerInfo?.perfs?.bullet?.rating || "N/A"}</p>
          <p className = "one" style = {{backgroundColor:compbg}}>Games Played: {playerInfo?.count?.all || "N/A"}</p>
          <p className = "one" style = {{backgroundColor:compbg}}>Opening : {op}</p>
          
          <p className = "one" style = {{backgroundColor:compbg}}>Best Continuation :{evaldata?.bestmove}</p>
          
        </div>
      )}
      </div>
      <div className="one" style = {{backgroundColor:compbg}}>
        Status: {formatGameStatus(gameStatus)}
      </div>
      <div className = "one" style = {{backgroundColor:compbg}}>
          <div className = "eval-row">
        <GameTracker isOn = {showeval} onToggle = {setshoweval}/>{showeval ? "Hide Evaluation" : "Show Evaluation"}
        {showeval && (<p>Evaluation : {evaldata?.eval != null?evaldata?.eval:(evaldata?.mate != null?evaldata.mate:null)}</p>)}
        </div>
      </div>
      <div><Celebrations isstatus = {gameStatus}/></div>
      
         <div className = "container">
          <div className =  "board-wrapper">
           <div className = "shadow">
            <Chessboard
          position={game.fen()}
          customArrows = {arrows}
          boardOrientation = {board}
         />
          </div>
          </div>
          
          <div className = "two" style = {{color:bg === "white"?"black":"yellow"}}> <EvaluationBar value={parseFloat(evaldata?.eval)} /></div>
           <button className = "button-one" onClick = {() => flipboard(board)}>Flip Board</button>
         </div>
          <Celebrations isstatus={gameStatus} />
                    
        <div className = "button-row">
      <button className = "button"onClick={() => gottomove(currentMove-1)} disabled = {currentMove === 0}>Previous Move</button>
      <button className = "button"onClick={() => gottomove(currentMove+1)} disabled = {currentMove >= moves.length}>Next Move</button>
      <button className = "button" onClick = {() => changeBg(bg)}>Change Background</button>
      <button className = "button" onClick = {gotochart}>Chart</button>
      </div>
      
      
      
    </div>
    
  );
}


export default LichessGamePlayer;