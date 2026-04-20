// Header.jsx
import React, { useEffect, useState } from "react";
import "./Header.css";

import { IoMailOpenOutline } from "react-icons/io5";
import { FaPhoneSquareAlt } from "react-icons/fa";

const Header = ({ homePage }) => {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (!contactOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [contactOpen]);

  return (
    <div>
      <header className={homePage ? "header home_page_header" : "header"}>
        <div className="flex"></div>
        <br />
        <br />
        <br />
        <br />

        {/* ONLY CONTACT BUTTON */}
        <nav className="desktop_menu">
          <button
            style={{
              background: "goldenrod",
              borderRadius: "15px",
              padding: "10px",
            }}
            type="button"
            className="contact_btn"
            onClick={() => setContactOpen(true)}
          >
            <h2 style={{ color: "black" }}>Contact</h2>
          </button>
        </nav>

        {/* CONTACT MODAL */}
        {contactOpen && (
          <div
            className="modal_overlay"
            onClick={() => setContactOpen(false)}
            role="presentation"
          >
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Contact"
            >
              <button
                type="button"
                className="modal_close"
                onClick={() => setContactOpen(false)}
                aria-label="Close"
                style={{ color: "white" }}
              >
                ✕
              </button>

              <h3 className="modal_title" style={{ color: "white" }}>
                Contact
              </h3>

              <div className="modal_body">
                <div className="flex">
                  <IoMailOpenOutline color="white" size="24px" />
                  <p>
                    <b style={{ color: "white" }}>info@atlantlogistics.ge</b>
                  </p>
                </div>

                <br />

                <div className="flex">
                  <FaPhoneSquareAlt color="white" size="24px" />
                  <p>
                    <b style={{ color: "white" }}>+995 500 05 21 56</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
