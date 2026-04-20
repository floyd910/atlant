import React from "react";
import { useState } from "react";
import "./SummerWinter.css";

const SummerWinter = () => {
  const [active, setActive] = useState("summer");
  return (
    <div className="summer_winter">
      <button
        className="summer"
        onMouseEnter={() => setActive("summer")}
        // onMouseLeave={() => setHovered(false)}
      >
        <h3>Summer</h3>
        {active === "summer" ? null : (
          <div className="layer_summer layer"></div>
        )}
      </button>
      <button
        className="winter"
        onMouseEnter={() => setActive("winter")}
        // onMouseLeave={() => setHovered(false)}
      >
        <h3>Winter</h3>
        {active === "winter" ? null : (
          <div className="layer_winter layer"></div>
        )}
      </button>
    </div>
  );
};

export default SummerWinter;
