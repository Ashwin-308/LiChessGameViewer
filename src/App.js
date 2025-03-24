import logo from './logo.svg';
import Cell from "./components/Cell"
import {useState,useEffect} from "react"

const  App= () =>{
  const [cells,setcells] = useState(["","","","","","","","",""])
  const [winmsg,setmsg] = useState(null)
  const [go,setgo] = useState("circle")
  const msg = "it is now " +go +"'s turn "
  const checkscore = () => { const wincombos =  [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    wincombos.forEach(array => {
       let circlewins = array.every(cell =>cells[cell] === "circle")
       if(circlewins)
       {
        setmsg("circle wins")
        return 
       }
       
      }
    )

    wincombos.forEach(array => {
      let crosswins = array.every(cell =>cells[cell] === "cross")
      if(crosswins)
      {
       setmsg("cross wins")
       return 
      }
    }
  )
      
    

    
  }
  useEffect(() => { checkscore()})
  return (
    <div className="App">
      <div className = "gameboard">
           {cells.map((cell,index) => <Cell  key = {index} id = {index} cell = {cell}  go = {go} setgo = {setgo} cells = {cells} setcells = {setcells} winmsg = {winmsg}/>)}
      </div>
      <p>{winmsg || setmsg}</p>
      <div>{msg}</div>
    </div>
    
  );
}

export default App;
