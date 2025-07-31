import React, { useState, useRef } from "react";
import typing_data from "../../utils/wpm";
import ProgressBarCom from "../ui/progress";
import { useUser } from "../../context/UserContext";

const { data } = typing_data[1];

function Home() {
  const [inputData, setInputData] = useState("");
  const [len, setLen] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [flag, setFlag] = useState(true);
  const [pera,setPera] = useState(data);
  const inputRef = useRef(null);
  const startTimeRef = useRef(null);

  const {username,userAvatar} = useUser()
  const handleInput = (e) => {
    if(len != pera.length){
        setWpm(parseInt(Math.round((len / 4) / (Date.now() - startTimeRef.current) * 60000)));
    }
    
    const value = e.target.value;
    const lastChar = value[value.length - 1];

    if (lastChar !== pera[len]) return;

    if (value.length <= pera.length) {
      setInputData(lastChar === " " ? "" : value);
      if (lastChar === pera[len]) setLen((prev) => prev + 1);
    }

    if (len === pera.length) {
      setInputData("");
      setLen(0);
    }
  };

  const handleStart = () => {
    setPera(()=>{
      return typing_data[Math.floor(Math.random() * typing_data.length)].data
    })
    setInputData("");
    setFlag(false);
    setLen(0);
    startTimeRef.current = Date.now();
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-mono">

            {/* Avatar and Username */}
            <div className="flex flex-col items-center mb-6">
        <img
          src={userAvatar || "monkey.jpg"}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border-4 border-[#00ff99]"
        />
        <h2 className="text-xl text-[#00ff99] mt-2">{username || "Player"}</h2>
      </div>


      {/* Progress Bar */}
      <ProgressBarCom progress={parseInt((len / pera.length) * 100)} />

      {/* Typing Text Display */}
      <p className="p-8 text-xl tracking-wide text-center leading-8">
        <span className="text-[#00ff99] bg-gray-800 ">
          {pera.slice(0, len)}
        </span>
        <span className="text-gray-400 "> {pera.slice(len)}</span>
      </p>

      {/* WPM Counter */}
      <div className="mt-4 text-lg text-[#00ff99] bg-gray-800 px-4 py-2 rounded-md border border-gray-700">
        WPM: {wpm}
      </div>

      {/* Start Button */}
      <div className="mt-6">
        <button
          onClick={handleStart}
          className="cursor-pointer px-6 py-3 text-lg font-semibold rounded-md transition-all duration-200 border-2 bg-[#00ff99] text-gray-900 border-[#00ff99] hover:bg-transparent hover:text-[#00ff99]"
        >
          Start Test
        </button>
      </div>

      {/* Typing Input Field */}
      <div className="mt-6 w-full max-w-lg">
        <input
          ref={inputRef}
          type="text"
          disabled={flag}
          className={`w-full text-lg px-4 py-3 rounded-md bg-gray-900 border-2 border-gray-700 text-[#00ff99] placeholder-gray-500 focus:outline-none transition-all ${
            flag ? "cursor-not-allowed opacity-50" : "cursor-text focus:border-[#00ff99] shadow-md"
          }`}
          value={inputData}
          onChange={handleInput}
        />
      </div>
    </div>
  );
}

export default Home;
