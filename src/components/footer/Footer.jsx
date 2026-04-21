import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { RiFacebookCircleFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { CiMail } from "react-icons/ci";

const Footer = () => {
  return (
    <footer>
      <div>
        <h2>
          <strong style={{ fontSize: "30px" }}>Atlant Logistics</strong>
        </h2>
        <div style={{ color: "white" }}>
          <br /> ​Tel: +995 500 05 21 56
          <br />
          ​Email: info@atlantlogistics.ge
          <br />
          <br /> © www.Atlantlogistics.ge
        </div>
      </div>
    </footer>
  );
};

export default Footer;
