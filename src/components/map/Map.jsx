import React, { useState, useRef, useEffect } from "react";
import "./Map.css";

const Map = () => {
  const [xPosition, setXPosition] = useState(0);
  const [yPosition, setYPosition] = useState(0);
  const [translate3dValue, setTranslate3dValue] = useState("");
  const [travelTime, setTravelTime] = useState();

  // Refs to store previous x and y positions
  let prevXPosition;
  let prevYPosition;

  const getClickPosition = (e) => {
    const newXPosition = e.clientX - 25;
    const newYPosition = e.clientY - 25;

    setXPosition(newXPosition);
    setYPosition(newYPosition);

    // Store previous positions before updating
    prevXPosition = xPosition;
    prevYPosition = yPosition;

    setTravelTime(
      Math.abs(newXPosition - prevXPosition + newYPosition - prevYPosition) / 5
    );

    setTranslate3dValue(`translate3d(${newXPosition}px, ${newYPosition}px, 0)`);
  };

  return (
    <div className="map" onClick={(e) => getClickPosition(e)}>
      <div
        style={{
          transform: translate3dValue,
          transition: `1s transform ease`, // Smooth transition
        }}
        className="character"
      ></div>
      <div>
        <p>
          Current Position: ({xPosition}, {yPosition})
        </p>
        <p>
          Previous Position: {prevXPosition}, {prevYPosition}
        </p>
        <p>TravelTime: {travelTime} s</p>
      </div>
    </div>
  );
};

export default Map;
