import React from "react";
import Die from "./component/Die";
import {nanoid} from "nanoid";
import Confetti from "react-confetti"

function App(){
    const [dieNumbers, setDieNumbers] = React.useState(allNewDice());
    const [tenzies, setTenzies] = React.useState(false)

    //stop watch React Use state
    const [seconds, setSeconds] = React.useState(0); // State to keep track of time
    const [timer, setTimer] = React.useState(null); // State to store the interval ID
    const [isRunning, setIsRunning] = React.useState(true); // State to track if the timer is running

    //Store to locale storage
    const [bestTime, setBestTime] = React.useState(() => parseInt(localStorage.getItem("bestTime")) || 0);
    
    // localStorage.clear()
    React.useEffect(()=>{
        // .every array method takes in a codition as it's parameter and reurn true only if all the items in the array meet that condition
        const allHeld = dieNumbers.every(items => items.isHeld);
        const firstValue = dieNumbers[0].value
        const sameValue = dieNumbers.every(items => items.value === firstValue);

        if(allHeld && sameValue){
            setTenzies(true);
            stopTimer();
            checkTime();
        }
        else{
            setTenzies(false);
        }
    }, [dieNumbers]);

    function checkTime() {
        setBestTime((prevTime) => {
          if (prevTime === 0 || seconds < prevTime) {
            // Update best time only if it's the first game or the new time is better
            localStorage.setItem("bestTime", seconds.toString()); // Store the new best time
            return seconds; // Update state with the new best time
          }
          else{
            return prevTime; // Keep the previous best time if no update is needed
          }
          
        });
    }

    // localStorage.clear()


    //------- STOP WATCH FUNCTION -------\

    // Function to format time as HH:MM:SS
    function formatTime(seconds){
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    //Use effect for stopwatch
    React.useEffect(() => {
        if(isRunning) {
          const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
          }, 1000);
          
          setTimer(interval); // Save the interval ID
    
          // Cleanup function to clear the interval when the component unmounts
          return () => clearInterval(interval);
        }
    }, [isRunning]); 

    // Function to reset the timer
    function resetTimer(){
        clearInterval(timer); // Clear the current interval
        setSeconds(0);        // Reset the seconds to 0
        setIsRunning(true);   // Make sure the timer restarts
    };
    // Function to stop the timer
    function stopTimer(){
        clearInterval(timer); // Stop the interval from running
        setIsRunning(false);  // Set the running state to false
    };

    function allNewDice(){
        let diceArray =[];
        for(let i = 0; i < 10; i++){
            const dieObject = {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                rolls: 0,
                id: nanoid()
            }
            // let randomNum = Math.ceil(Math.random() * 6)
            diceArray.push(dieObject)
        }
        return diceArray
    }

    function rollDice(){
        setDieNumbers(oldDieState => oldDieState.map(eachDie => {
            if(!eachDie.isHeld){
                const newObject ={
                    ...eachDie,
                    value: Math.ceil(Math.random() * 6),
                    rolls: eachDie.rolls + 1
                }
                return newObject
            }
            else{
                return {...eachDie, rolls: eachDie.rolls+1}
            }
        }));
    }

    function hold(id){
        setDieNumbers(oldDieState => oldDieState.map(eachDie => {
            if(eachDie.id === id){
                const newObject = {
                    ...eachDie,
                    isHeld: !eachDie.isHeld
                }
                return newObject
            }            
            else{
                return eachDie
            }
        }))
    }

    const displayDice = dieNumbers.map(item => {
        return (<Die
            key={item.id}
            value={item.value}
            isHeld = {item.isHeld}
            id= {item.id}
            holdFunc = {hold}
        />)
    })
    // console.log(bestTime)
    return(
        <main className="flex-all-centered main-cont">
            <div className="timer-cont">
                <h2>New time: {formatTime(seconds)}</h2>
                <h2>Best time: {formatTime(bestTime)}</h2>
            </div>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Freeze each die to freeze it at it's current calue between rolls.</p>

            <div className="die-cont">
                {displayDice}
                
            </div>

            <button className="roll-btn" onClick={tenzies? ()=>{setDieNumbers(allNewDice); resetTimer()}: rollDice}>{tenzies? "New Game": "Roll"}</button>
            {tenzies && <p>You won in {dieNumbers[0].rolls} rolls</p>}
            
        </main>
    )
}

export default App