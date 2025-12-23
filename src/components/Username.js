import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function UsernameForm({ setUsername }) {
    const [inputValue, setInputValue] = useState('');
    const [username,setusername] = useState('');
    const [gameId,setgameId] = useState('');
    const [analyze,setanalyze] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
     
      navigate(`/game/${inputValue}`); 
    };
    const handleGameIdSubmit = (e) => {
      e.preventDefault();
      navigate(`/usergames/${gameId}`)
    }
    const handleanalyzesubmit = (e) => {
      e.preventDefault();
      navigate("/analyze", {
       state: {
        evaluation: [],  
        movesarray: []
            }
        });
      
    }
   
    return (
        <div>
          <h1 className = "style">Enter Lichess Username</h1>
          <form onSubmit={handleSubmit} className = "form-container">
          
            <input
            className  = "game"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder = "Enter text"
            />
            
            <button type="submit" className = "button">View Game</button>
         
        
          </form>
          <div style =  {{marginTop:"40px"}}></div>
          <div><form onSubmit = {handleGameIdSubmit} className = "form-container">
            <h1 className = "style">Enter Lichess Game ID</h1>
            <input className = "game"
              type="text"
              value={gameId}
              onChange={(e) => setgameId(e.target.value)}
              placeholder = "Enter text"
            />
            <button type="submit" className = "button" >View Game</button>
          </form></div>
          <div style = {{marginTop:"70px"}}></div>  
         <div><form onSubmit = {handleanalyzesubmit} className = "form-container">
          <h1 className = "style">Analyze your game</h1>
          <button type = "submit" className = "button" onClick = {(e) =>setanalyze(e.target.value)}>Analyze</button>
          </form></div>
        </div>
      );
      
  }
  export default UsernameForm;