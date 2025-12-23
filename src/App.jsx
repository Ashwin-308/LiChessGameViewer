import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChessGame from "./components/ChessGame";
import UsernameForm from './components/Username'
import Usergames from './components/Usergames';
import GameTracker from './GameTracker';
import { useState, useEffect } from "react";
import Test from './Test';
import Mychart from './Mychart';
import Analysis from './components/Analysis';
function App()
{
  
  return(
    
<Router>
      <Routes>
        <Route path ="/" element  = {<UsernameForm/>}/>
        <Route path =  "/game/:username" element = {<ChessGame  />}/> 
        <Route path = "/usergames/:gameId" element = {<Usergames />}/>
        <Route path = "/chart/" element = {<Mychart />}/>
        <Route path = "/analyze/" element = {<Analysis />}/>
      </Routes>
    </Router>
      
  );
}
export default  App;


