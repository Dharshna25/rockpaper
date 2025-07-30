import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

const Game = () => {
  const [playerName, setPlayerName] = useState('');
  const [userChoice, setUserChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const choices = [
    { name: 'Rock', emoji: '🪨', color: 'from-gray-500 to-gray-700 p-2 m-4' },
    { name: 'Paper', emoji: '📄', color: 'from-blue-500 to-blue-700 p-2 m-5' },
    { name: 'Scissors', emoji: '✂️', color: 'from-red-500 to-red-700 p-2' }
  ];

  const backgroundColors = [
    'from-purple-600 via-pink-600 to-blue-600',
    'from-green-400 via-blue-500 to-purple-600',
    'from-pink-500 via-red-500 to-yellow-500',
    'from-blue-600 via-purple-600 to-indigo-800'
  ];

  const [bgColor, setBgColor] = useState(backgroundColors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgColor(prev => {
        const currentIndex = backgroundColors.indexOf(prev);
        return backgroundColors[(currentIndex + 1) % backgroundColors.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getChoiceByName = (name) => choices.find(choice => choice.name === name);

  const simulateGame = () => {
    const computerChoices = choices.map(c => c.name);
    const randomChoice = computerChoices[Math.floor(Math.random() * computerChoices.length)];

    let gameResult;
    if (userChoice === randomChoice) {
      gameResult = "It's a tie! 🤝";
    } else if (
      (userChoice === 'Rock' && randomChoice === 'Scissors') ||
      (userChoice === 'Paper' && randomChoice === 'Rock') ||
      (userChoice === 'Scissors' && randomChoice === 'Paper')
    ) {
      gameResult = "You win! 🎉";
      setPlayerScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      gameResult = "Computer wins! 🤖";
      setComputerScore(prev => prev + 1);
      setStreak(0);
    }

    setComputerChoice(randomChoice);
    setResult(gameResult);
  };

  const handlePlay = async (choice) => {
  if (!playerName.trim()) {
    setError('Please enter your name first! 😊');
    return;
  }

  setUserChoice(choice);
  setError('');
  setIsPlaying(true);
  setShowResult(false);

  try {
    const response = await fetch('http://localhost:5000/api/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player_name: playerName,
        user_choice: choice,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setComputerChoice(data.computer_choice);
      setResult(
        data.result === 'Draw'
          ? "It's a tie! 🤝"
          : data.result === 'Win'
          ? "You win! 🎉"
          : "Computer wins! 🤖"
      );
      if (data.result === 'Win') {
        setPlayerScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else if (data.result === 'Lose') {
        setComputerScore((prev) => prev + 1);
        setStreak(0);
      }
    } else {
      setError(data.error || 'Server error');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError('Something went wrong with the server 😢');
  } finally {
    setIsPlaying(false);
    setShowResult(true);
  }
};

  const startGame = () => {
    if (!playerName.trim()) {
      setError('Please enter your name! 😊');
      return;
    }
    setGameStarted(true);
    setError('');
  };

  const resetGame = () => {
    setUserChoice('');
    setComputerChoice('');
    setResult('');
    setShowResult(false);
    setIsPlaying(false);
    setPlayerScore(0);
    setComputerScore(0);
    setStreak(0);
    setGameStarted(false);
    setPlayerName('');
  };

  const getResultEmoji = () => {
    if (result.includes('win')) return '🎉';
    if (result.includes('Computer')) return '😅';
    return '🤝';
  };

  if (!gameStarted) {
    return (
      <div className={`min-vh-100 d-flex align-items-center justify-content-center bg-gradient-to-br bgColor-pink transition-all duration-1000`}>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-5 animate-bounce p-3">
              <i>🎮 Rock Paper Scissors</i>
            </h1><i>
            <p className="text-black/80 mb-5 text-lg">Ready to play the ultimate game?</p></i>

            <div className="space-y-6 mb-3">
              <input
                type="text"
                placeholder="Enter your name ✨"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-black/20 backdrop-blur-sm border mb-5 border-black/30 text-black placeholder-white/70 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />

              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-gray font-bold py-4 px-8 rounded-2xl text-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Playing 🚀
              </button>
            </div>

            {error && (
              <p className="text-red-300 mt-4 animate-pulse text-lg">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 bg-gradient-to-br ${bgColor} transition-all duration-1000 py-4`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
            🎮 Rock Paper Scissors
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 inline-block border border-white/20">
            <p className="text-white text-xl">
              Welcome, <span className="font-bold text-yellow-300">{playerName}</span>! 👋
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex space-x-8 text-center">
              <div className="text-white">
                <p className="text-lg opacity-80">You</p>
                <p className="text-3xl font-bold text-green-300">{playerScore}</p>
              </div>
              <div className="text-black text-2xl self-center">VS</div>
              <div className="text-white">
                <p className="text-lg opacity-80">Computer</p>
                <p className="text-3xl font-bold text-red-300">{computerScore}</p>
              </div>
            </div>
            {streak > 0 && (
              <div className="mt-4 text-center">
                <p className="text-yellow-300 font-bold animate-bounce">
                  🔥 {streak} Win Streak!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
            {choices.map((choice) => (
              <button
                key={choice.name}
                onClick={() => handlePlay(choice.name)}
                disabled={isPlaying}
                className={`bg-gradient-to-br ${choice.color} hover:scale-110 transform transition-all duration-300 rounded-3xl p-8 shadow-2xl border-4 border-white/30 hover:border-white/60 disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                <div className="text-center text-black">
                  <div className="text-6xl mb-4 group-hover:animate-bounce">{choice.emoji}</div>
                  <p className="text-2xl font-bold">{choice.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {isPlaying && (
          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-4 animate-spin">⚡</div>
              <p className="text-white text-xl animate-pulse">
                Battle in progress...
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {showResult && !isPlaying && (
          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto shadow-2xl animate-fadeIn">
              <div className="text-8xl mb-6 animate-bounce">{getResultEmoji()}</div>

              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <p className="text-white text-lg mb-2">You chose:</p>
                  <div className="bg-white/20 rounded-2xl p-4">
                    <div className="text-4xl">{getChoiceByName(userChoice)?.emoji}</div>
                    <p className="font-bold mt-2">{userChoice}</p>
                  </div>
                </div>

                <div className="text-4xl self-center animate-pulse">⚔️</div>

                <div className="text-center">
                  <p className="text-white text-lg mb-2">Computer chose:</p>
                  <div className="bg-white/20 rounded-2xl p-4">
                    <div className="text-4xl">{getChoiceByName(computerChoice)?.emoji}</div>
                    <p className="text-white font-bold mt-2">{computerChoice}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-white mb-6 animate-pulse">
                {result}
              </h2>

              <button
                onClick={() => setShowResult(false)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold py-3 px-8 rounded-2xl text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Play Again! 🎯
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-300 text-xl animate-pulse bg-red-500/20 backdrop-blur-sm rounded-2xl py-4 px-6 inline-block border border-red-300/30">
              {error}
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500  font-bold py-3 px-8 rounded-2xl text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            New Game 🔄
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
