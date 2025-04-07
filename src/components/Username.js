import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function UsernameForm({ setUsername }) {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
     
      navigate(`/game/${inputValue}`); 
    };
  
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
        </div>
      );
      
  }
  export default UsernameForm;


