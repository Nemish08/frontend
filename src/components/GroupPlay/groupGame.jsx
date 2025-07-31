

import React, { useState, useRef, useEffect } from "react";
import typing_data from "../../utils/wpm";
import ProgressBarCom from "../ui/progress";
import { useUser } from "../../context/UserContext";
import { io } from "socket.io-client";

const socket = io("https://backend-typewritter.onrender.com"); // Change to your backend URL
const { data } = typing_data[0];

function GroupGame() {
  const { username, userAvatar, groupId } = useUser(); // Get user details
  const [inputData, setInputData] = useState("");
  const [len, setLen] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const [players, setPlayers] = useState([]); // Store all players in the room
  const [countdown, setCountdown] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const myProgress = useRef(0);

  useEffect(() => {
    if (groupId) {
      socket.emit("joinRoom", { username, avatar: userAvatar, roomId: groupId });

      socket.on("roomUsers", (users) => {
        setPlayers(users);
      });

      socket.on("updateTyping", ({ playerId, progress, wpm }) => {
        setPlayers((prev) =>
          prev.map((player) =>
            player.id === playerId ? { ...player, progress, wpm } : player
          )
        );
      });

      socket.on("gameCompleted", ({ playerId, username, wpm, timeElapsed }) => {
        // Add player to leaderboard when they finish typing
        setLeaderboard((prev) => [...prev, { playerId, username, wpm, timeElapsed }]);
      });

      socket.on("startCountdown", (count) => {
        setCountdown(count);
        if (count === 0) {
          setGameActive(true);
          startTimeRef.current = Date.now();
          if (inputRef.current) inputRef.current.focus();
          
          // Start timer to update WPM every second
          timerIntervalRef.current = setInterval(() => {
            if (len > 0) {
              const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
              const calculatedWpm = Math.round((len / 5) / elapsedMinutes); // Using standard 5 chars per word
              setWpm(calculatedWpm);
              
              // Only emit if progress has changed
              const currentProgress = (len / data.length) * 100;
              if (currentProgress !== myProgress.current) {
                myProgress.current = currentProgress;
                
                // Emit typing progress to other players
                socket.emit("typing", { 
                  roomId: groupId, 
                  playerId: socket.id, 
                  progress: currentProgress, 
                  wpm: calculatedWpm 
                });
              }
            }
          }, 1000);
        }
      });

      socket.on("allPlayersReady", () => {
        setAllPlayersReady(true);
      });
    }

    return () => {
      socket.off("roomUsers");
      socket.off("updateTyping");
      socket.off("gameCompleted");
      socket.off("startCountdown");
      socket.off("allPlayersReady");
      clearInterval(timerIntervalRef.current);
    };
  }, [groupId, username, userAvatar]);

  // Update progress whenever len changes
  useEffect(() => {
    if (gameActive && len > 0) {
      const currentProgress = (len / data.length) * 100;
      myProgress.current = currentProgress;
      
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const calculatedWpm = Math.round((len / 5) / elapsedMinutes);
      
      // Update local WPM
      setWpm(calculatedWpm);
      
      // Emit progress update
      socket.emit("typing", { 
        roomId: groupId, 
        playerId: socket.id, 
        progress: currentProgress, 
        wpm: calculatedWpm 
      });
    }
  }, [len, gameActive, groupId]);

  const handleInput = (e) => {
    if (!gameActive) return;
    
    const value = e.target.value;
    const correctSoFar = data.substring(0, value.length);
    
    // Check if current input matches the text
    if (value === correctSoFar) {
      setInputData(value);
      setLen(value.length);
      
      // Check if player completed the typing test
      if (value.length === data.length) {
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const finalWpm = Math.round((data.length / 5) / (timeElapsed / 60));
        
        setGameActive(false);
        setGameEnded(true);
        clearInterval(timerIntervalRef.current);
        
        // Emit completion to server
        socket.emit("gameComplete", { 
          roomId: groupId, 
          timeElapsed, 
          wpm: finalWpm
        });
      }
    }
  };

  const handleReady = () => {
    socket.emit("playerReady", { roomId: groupId });
  };

  const handleStartGame = () => {
    socket.emit("startGame", { roomId: groupId });
  };

  const resetGame = () => {
    setInputData("");
    setLen(0);
    setWpm(0);
    setGameActive(false);
    setGameEnded(false);
    setLeaderboard([]);
    myProgress.current = 0;
    clearInterval(timerIntervalRef.current);
  };

  // Sort leaderboard by WPM (highest first)
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.wpm - a.wpm);
  
  // Calculate my current progress
  const myCurrentProgress = (len / data.length) * 100;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* User Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <img src={userAvatar} alt="User Avatar" className="w-16 h-16 rounded-full border-4 border-blue-500" />
        <h2 className="text-2xl font-semibold">{username}</h2>
      </div>

      {/* Room Info */}
      <div className="mb-4">
        <h3 className="text-xl text-blue-400">Room ID: {groupId}</h3>
        <p className="text-gray-400">Players: {players.length}</p>
      </div>

      {/* Game Status */}
      {countdown !== null && (
        <div className="text-4xl font-bold text-yellow-400 mb-4">
          {countdown > 0 ? `Starting in: ${countdown}` : "GO!"}
        </div>
      )}

      {/* Multiplayer Players Progress */}
      <div className="mb-4 w-full max-w-md">
        <h3 className="text-lg text-blue-400 mb-2">Players Progress:</h3>
        {players.map((player, index) => {
          // Find if current player is me
          const isMe = player.id === socket.id;
          // Use the most up-to-date progress value for current player
          const progressValue = isMe ? myCurrentProgress : (player.progress || 0);
          
          return (
            <div key={index} className="flex items-center gap-2 mb-2">
              <img src={player.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-gray-500" />
              <span className="text-white">{player.username} {isMe ? "(You)" : ""}</span>
              <div className="flex-grow">
                <ProgressBarCom progress={Math.round(progressValue)} />
              </div>
              <span className="text-gray-400 text-sm ml-2 w-20 text-right">{isMe ? wpm : (player.wpm || 0)} WPM</span>
            </div>
          );
        })}
      </div>

      {/* Leaderboard when game is finished */}
      {gameEnded && leaderboard.length > 0 && (
        <div className="mb-6 w-full max-w-md">
          <h3 className="text-2xl text-yellow-400 mb-3">🏆 Leaderboard 🏆</h3>
          {sortedLeaderboard.map((player, index) => (
            <div key={index} className="flex items-center gap-3 mb-2 p-2 bg-gray-800 rounded">
              <span className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}</span>
              <span className="text-white font-medium">{player.username}</span>
              <span className="text-green-400 font-bold">{player.wpm} WPM</span>
              <span className="text-gray-400 text-sm ml-auto">{player.timeElapsed.toFixed(1)}s</span>
            </div>
          ))}
          
          <button 
            onClick={resetGame} 
            className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Play Again
          </button>
        </div>
      )}

      {/* Only show typing area if game hasn't ended */}
      {!gameEnded && (
        <>
          {/* Personal Typing Progress */}
          <div className="w-full max-w-md mb-2 mt-4">
            {/* <div className="flex justify-between text-sm mb-1">
              <span>Your Progress:</span>
              <span>{Math.round(myCurrentProgress)}%</span>
            </div> */}
            {/* <ProgressBarCom progress={Math.round(myCurrentProgress)} /> */}
          </div>
          
          <div className="p-4 bg-gray-800 rounded w-full max-w-2xl mb-4 font-mono text-lg overflow-auto">
            <span className="bg-green-600 text-white">{data.slice(0, len)}</span>
            <span className="text-gray-300">{data.slice(len)}</span>
          </div>

          {/* Typing WPM */}
          <div className="text-xl font-semibold text-blue-300 mb-4">WPM: {wpm}</div>

          {/* Game Controls */}
          {!gameActive && !countdown && (
            <div className="flex gap-4">
              <button 
                onClick={handleReady} 
                className="py-2 px-6 bg-yellow-500 hover:bg-yellow-400 rounded"
              >
                Ready
              </button>
              
              {allPlayersReady && (
                <button 
                  onClick={handleStartGame} 
                  className="py-2 px-6 bg-green-500 hover:bg-green-400 rounded"
                >
                  Start Game
                </button>
              )}
            </div>
          )}

          {/* Typing Input */}
          <input
            ref={inputRef}
            type="text"
            disabled={!gameActive}
            className={`border-2 border-gray-700 py-3 px-4 rounded w-full max-w-md mt-4 bg-gray-800 text-white ${
              !gameActive ? "cursor-not-allowed opacity-50" : "cursor-text"
            }`}
            value={inputData}
            onChange={handleInput}
            placeholder={gameActive ? "Start typing..." : "Waiting to start..."}
          />
        </>
      )}
    </div>
  );
}

export default GroupGame;