import React, { useState } from "react";

import { useUser } from "../../context/UserContext"
import { useNavigate } from "react-router-dom";


export default function GroupPlayPage() {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  
  const {groupId, setGroupId, username, setUsername, userAvatar} = useUser();
    const nav = useNavigate()
  const handleCreateGroup = () => {
    const newGroupId =  Math.random().toString(36).substr(2, 6).toUpperCase() // Shortened UUID
    setGroupId(newGroupId);
    setIsCreatingGroup(true);
    navigator.clipboard.writeText(newGroupId); // Auto copy to clipboard

   
    
  };

  const handleJoinGroup = () => {
    if (!groupId || !username) return alert("Enter a username and group ID!");
    // socket.emit("joinRoom", { username, avatar: userAvatar, roomId: groupId });
    setIsInRoom(true);
    nav('/groupGame')

  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-mono">
      <h1 className="text-4xl font-bold mb-6 tracking-widest text-[#00ff99]">
        Group Play
      </h1>

      {!isCreatingGroup && !isJoiningGroup ? (
        // Group Selection Options
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Group Option */}
          <div
            className="p-6 bg-gray-800 rounded-xl text-center cursor-pointer transition-all border-2 border-transparent hover:border-[#00ff99] hover:scale-105"
            onClick={handleCreateGroup}
          >
            <h2 className="text-xl font-semibold text-[#00ff99]">Create Group</h2>
            <p className="text-gray-400 text-sm mt-2">Generate a unique room ID and invite friends.</p>
          </div>

          {/* Join Group Option */}
          <div
            className="p-6 bg-gray-800 rounded-xl text-center cursor-pointer transition-all border-2 border-transparent hover:border-[#00ff99] hover:scale-105"
            onClick={() => setIsJoiningGroup(true)}
          >
            <h2 className="text-xl font-semibold text-[#00ff99]">Join Group</h2>
            <p className="text-gray-400 text-sm mt-2">Enter an existing room ID to join.</p>
          </div>
        </div>
      ) : isCreatingGroup ? (
        // Created Group Display
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-300 mb-2">Share this Group ID:</p>
          <div className="flex items-center bg-gray-800 border border-gray-600 rounded-md px-4 py-2">
            <input
              type="text"
              className="w-full bg-transparent text-[#00ff99] focus:outline-none"
              value={groupId}
              readOnly
            />
            <button
              className="ml-4 px-3 py-1 bg-[#00ff99] text-gray-900 font-bold rounded-md hover:bg-transparent hover:text-[#00ff99] border border-[#00ff99] transition-all"
              onClick={() => navigator.clipboard.writeText(groupId)}
            >
              Copy
            </button>
          </div>
          <button onClick={()=>nav('/groupGame')}
            className="mt-4 px-6 py-3 rounded-md text-lg font-semibold tracking-widest transition-all duration-200 border-2 bg-[#00ff99] text-gray-900 border-[#00ff99] hover:bg-transparent hover:text-[#00ff99]"
          >
            Start Game
          </button>
        </div>
      ) : (
        // Join Group Input Field
        <div className="mt-6 text-center">
          <p className="text-lg text-gray-300 mb-2">Enter Group ID:</p>
          <input
            type="text"
            className="w-full max-w-xs px-4 py-3 rounded-md bg-gray-900 border-2 border-gray-700 text-[#00ff99] placeholder-gray-500 focus:outline-none focus:border-[#00ff99] transition-all"
            placeholder="Enter Group ID"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
          <button
            onClick={handleJoinGroup}
            className="mt-4 px-6 py-3 rounded-md text-lg font-semibold tracking-widest transition-all duration-200 border-2 bg-[#00ff99] text-gray-900 border-[#00ff99] hover:bg-transparent hover:text-[#00ff99]"
          >
            Join Group
          </button>
        </div>
      )}
    </div>
  );
}
