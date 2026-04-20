import React from "react";
import "./Loader.css";
import Logo from "../../assets/pin-new-logo.png";

export default function Loader() {
  return (
    <div className="loader-overlay">
      {/* <img className="loader_logo" src={Logo} alt="Pingeorgia logo" /> */}
      <h1>Atlant Logistics</h1>
      <div className="loader-bar">
        <div className="loader-fill" />
      </div>
    </div>
  );
}
