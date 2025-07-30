import React, { useState } from "react";
import rockImg from "../assets/rock.jpg";
import paperImg from "../assets/paper.jpg";
import scissorImg from "../assets/scissor.jpg";

const choices = {
  rock: rockImg,
  paper: paperImg,
  scissors: scissorImg,
};

const Game = () => {
  const [name, setName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleStart = () => {
    if (name.trim() !== "") setGameStarted(true);
  };

  const handleChoice = (choice) => {
    if (hasPlayed) return; // Prevent replay before choosing "Play Again"
    const options = ["rock", "paper", "scissors"];
    const compChoice = options[Math.floor(Math.random() * 3)];
    setUserChoice(choice);
    setComputerChoice(compChoice);
    const outcome = getResult(choice, compChoice);
    setResult(outcome);
    setHasPlayed(true);

    fetch("https://your-backend-url.onrender.com/play", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        user_choice: choice,
        computer_choice: compChoice,
        result: outcome,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Saved:", data))
      .catch((err) => console.error("Error:", err));
  };

  const getResult = (user, comp) => {
    if (user === comp) return "Draw";
    if (
      (user === "rock" && comp === "scissors") ||
      (user === "scissors" && comp === "paper") ||
      (user === "paper" && comp === "rock")
    )
      return "You Win!";
    return "You Lose!";
  };

  const handlePlayAgain = () => {
    setUserChoice("");
    setComputerChoice("");
    setResult("");
    setHasPlayed(false);
  };

  const handleNewMatch = () => {
    setName("");
    setGameStarted(false);
    setUserChoice("");
    setComputerChoice("");
    setResult("");
    setHasPlayed(false);
  };

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(to right, #5f2c82, #49a09d)",
    color: "white",
    fontFamily: "Arial",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  };

  const boxStyle = {
    textAlign: "center",
    padding: "30px",
    borderRadius: "15px",
    backgroundColor: "rgba(0,0,0,0.3)",
    maxWidth: "700px",
    width: "100%",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    width: "70%",
    margin: "20px 0",
    borderRadius: "8px",
    border: "none",
  };

  const buttonStyle = {
    padding: "10px 25px",
    fontSize: "18px",
    backgroundColor: "#00b894",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px",
  };

  const imageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid white",
    cursor: hasPlayed ? "not-allowed" : "pointer",
    margin: "10px",
    opacity: hasPlayed ? 0.5 : 1,
  };

  return (
    <div style={containerStyle}>
      {!gameStarted ? (
        <div style={boxStyle}>
          <h1>Rock Paper Scissors</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <br />
          <button onClick={handleStart} style={buttonStyle}>
            Start Game
          </button>
        </div>
      ) : (
        <div style={boxStyle}>
          <h2>Welcome, {name}!</h2>
          {!hasPlayed && <p>Choose your move:</p>}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {Object.entries(choices).map(([key, value]) => (
              <img
                key={key}
                src={value}
                alt={key}
                onClick={() => handleChoice(key)}
                style={imageStyle}
              />
            ))}
          </div>

          {hasPlayed && (
            <div>
              <h3>Battle Results:</h3>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p>You:</p>
                  <img src={choices[userChoice]} style={{ width: "100px" }} />
                </div>
                <div>
                  <p>Computer:</p>
                  <img
                    src={choices[computerChoice]}
                    style={{ width: "100px" }}
                  />
                </div>
              </div>
              <h2 style={{ marginTop: "20px", color: "#ffeaa7" }}>{result}</h2>
              <button style={buttonStyle} onClick={handlePlayAgain}>
                Play Again
              </button>
              <button style={{ ...buttonStyle, backgroundColor: "#6c5ce7" }} onClick={handleNewMatch}>
                New Match
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
