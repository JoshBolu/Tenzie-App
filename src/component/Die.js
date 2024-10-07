import React from "react";

function Die(props){    
    return(
        <div 
            className={`die-face flex-all-centered ${props.isHeld? "is-held": ""}`} 
            onClick={()=> props.holdFunc(props.id)}
        >
            <h1 className="dice-num">{props.value}</h1>
        </div>
        
    )
}

export default Die