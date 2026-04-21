import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="brand_logo">
        <Link to="/" className="link">
          <img
            src="https://res.cloudinary.com/dvngcbhqt/image/upload/c_crop,w_800,h_550,y_200/v1776791790/c852d45d-2caf-4820-895b-2786a890c0d7_vahkoq.png"
            alt="Atlant Logistics"
            className="logo-img"
          />
        </Link>
      </div>
      <div className="flex">
        <Link className="link" to="/">
          Home
        </Link>

        <Link className="link" to="about">
          About Us
        </Link>

        <Link className="link" to="/contact">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default Header;
