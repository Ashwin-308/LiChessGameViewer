const Cell = ({cell,id,go,setgo,cells,setcells,winmsg}) =>{
    const handleClick = (e) =>{
        console.log(e.target)
       
        if(!winmsg)
        { 
            const taken = e.target.firstChild?.classList.contains("circle")||e.target.firstChild?.classList.contains("cross")||e.target.firstChild.classList.contains("cross")
        if(!taken)
        {
            if(go === "circle")
            {
                e.target.firstChild.classList.add("circle")
                handlecellchange("circle")
                setgo("cross")
            }
            else{
                e.target.firstChild.classList.add("cross")
                handlecellchange("cross")
                setgo("circle")
            }
        }
    }
    }
    const handlecellchange = (className) => {const nextcells = cells.map((cell,index) => {
        if(index === id){return className}
        else{
            return cell;
        }
    })
    
    setcells(nextcells)
    }


    return(
    <div className = "square" id = {id} onClick = {handleClick}>
    <div></div>
       

    </div>)
}
export default Cell