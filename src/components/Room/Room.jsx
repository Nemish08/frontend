import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useState } from "react";

const avatars = [
  "monkey.jpg",
  "monkey1.jpg",
  "monkey4.png",
  "monkey3.jpg",
];

export default function TypingTestPage() {

  const {username, setUsername, userAvatar, setUserAvatar, groupId, createGroup, gameMode, setGameMode} = useUser();
  const isStartEnabled = username.trim() !== "" && gameMode !== null;
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-mono">
      <h1 className="text-4xl font-bold mb-6 tracking-widest text-[#00ff99]">
        Typing Test
      </h1>

      {/* Avatar Selection */}
      <div className="mb-8 text-center">
        <h2 className="text-lg mb-3 text-gray-300">Choose Your Avatar</h2>
        <div className="flex gap-4">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`w-16 h-16 rounded-full cursor-pointer transition-all duration-200 object-cover border-2 ${
                userAvatar === avatar
                  ? "border-[#00ff99] scale-110 shadow-lg shadow-[#00ff99]"
                  : "border-gray-700 hover:scale-105"
              }`}
              onClick={() => setUserAvatar(avatar)}
            />
          ))}
        </div>
      </div>

       {/* Username Input */}
       <div className="mb-6 w-full max-w-md">
        <label className="block text-lg mb-2 text-gray-300">Enter Your Name</label>
        <input
          type="text"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-[#00ff99] border border-gray-600 focus:outline-none focus:border-[#00ff99] transition-all placeholder-gray-500"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Game Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-6 bg-gray-900 rounded-md text-center cursor-pointer border-2 transition-all duration-200 ${
            gameMode === "solo"
              ? "border-[#00ff99] scale-105 shadow-md shadow-[#00ff99]"
              : "border-gray-700 hover:border-gray-500"
          }`}
          onClick={() => setGameMode("solo")}
        >
          <h2 className="text-xl font-semibold text-[#00ff99]">Solo Play</h2>
          <p className="text-gray-400 text-sm">Practice at your own pace.</p>
        </div>

        <div
          className={`p-6 bg-gray-900 rounded-md text-center cursor-pointer border-2 transition-all duration-200 ${
            gameMode === "group"
              ? "border-[#ffcc00] scale-105 shadow-md shadow-[#ffcc00]"
              : "border-gray-700 hover:border-gray-500"
          }`}
          onClick={() => setGameMode("group")}
        >
          <h2 className="text-xl font-semibold text-[#ffcc00]">Group Play</h2>
          <p className="text-gray-400 text-sm">Compete with friends.</p>
        </div>
      </div>

      {/* Start Button */}
      <button
        className={`mt-8 px-6 py-3 rounded-md text-lg font-semibold tracking-widest transition-all duration-200 border-2 ${
          isStartEnabled
            ? "bg-[#00ff99] text-gray-900 border-[#00ff99] hover:bg-transparent hover:text-[#00ff99]"
            : "bg-gray-600 text-gray-400 cursor-not-allowed border-gray-600"
        }`}
        disabled={!isStartEnabled}
        onClick={() => {
          if (gameMode === "solo") {
            nav("/home");
          } else if (gameMode === "group") {
            nav("/group");
          }
        }}
      >
        Start {gameMode === "solo" ? "Solo" : "Group"} Game
      </button>
    </div>
  );
}
