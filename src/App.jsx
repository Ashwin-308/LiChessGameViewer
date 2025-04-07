import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChessGame from "./ChessGame";
import UsernameForm from './components/Username'
import { useState, useEffect } from "react";

function App()
{
  
  return(
    <Router>
      <Routes>
        <Route path ="/" element  = {<UsernameForm/>}/>
        <Route path =  "/game/:username" element = {<ChessGame />}/>
      </Routes>
    </Router>
  )
}
export default  App;


