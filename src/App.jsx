import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChessGame from "./components/ChessGame";
import UsernameForm from './components/Username'
import Usergames from './components/Usergames';
import GameTracker from './GameTracker';
import { useState, useEffect } from "react";
import Test from './Test';

function App()
{
  
  return(
    
<Router>
      <Routes>
        <Route path ="/" element  = {<UsernameForm/>}/>
        <Route path =  "/game/:username" element = {<ChessGame  />}/> 
        <Route path = "/usergames/:gameId" element = {<Usergames />}/>
      </Routes>
    </Router>
      
  );
}
export default  App;


