import React, { useState } from "react";
import "./SlotMachine.css";

const symbols = ["🍒", "🍋", "⭐", "🔔", "🍉"]; // Example symbols

const SlotMachine = () => {
  const [reels, setReels] = useState([
    ["?", "?", "?"],
    ["?", "?", "?"],
    ["?", "?", "?"],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinReels = () => {
    if (isSpinning) return; // Prevent multiple spins
    setIsSpinning(true);

    // Randomize the reels
    const newReels = Array.from({ length: 5 }, () =>
      Array.from(
        { length: 3 },
        () => symbols[Math.floor(Math.random() * symbols.length)]
      )
    );

    const calculatePayout = (reels) => {
      // Example logic: Check if all symbols in the middle row are the same
      const middleRow = reels.map((reel) => reel[2]);
      const uniqueSymbols = new Set(middleRow);
      if (uniqueSymbols.size === 1) {
        return `You win! ${middleRow[0]} payout!`;
      }
      return "Try again!";
    };

    setTimeout(() => {
      setReels(newReels);
      setIsSpinning(false);
      calculatePayout();
    }, 1000); // Simulate spinning duration
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>NikushaBet</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {reels.map((reel, index) => (
          <div key={index} style={{ margin: "0 10px" }}>
            {reel.map((symbol, i) => (
              <div
                key={i}
                style={{
                  fontSize: "2rem",
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "5px",
                }}
              >
                {symbol}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={spinReels} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

export default SlotMachine;
