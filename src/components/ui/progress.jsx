import { useState, useEffect } from "react";

export default function ProgressBarCom({ progress }) {
  return (
    <div className="w-full max-w-md bg-[#51ffb9] rounded-full h-2 relative overflow-hidden shadow-md">
      <div
        className="h-full bg-[#087d4e] text-white text-xs flex items-center justify-center transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
       
      </div>
    </div>
  );
}

// Example Usage
export function ProgressDemo() {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <ProgressBarCom progress={progress} />
    </div>
  );
}
