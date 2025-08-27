
"use client";

import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

export function Confetti() {
  const [windowSize, setWindowSize] = useState<{width: number, height: number}>({ width: 0, height: 0 });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
     
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  if (windowSize.width === 0) return null;

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={400}
      tweenDuration={10000}
    />
  );
}
