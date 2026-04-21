import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import Details from "./pages/details/Details";
import Equipment from "./pages/equipment/Equipment";
import AboutUs from "./pages/aboutUs/AboutUs";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header"; // Added Header import
import "./App.css";
import ScrollToTop from "./components/scrollTop/ScrollTop";
import { MdOutlineConstruction } from "react-icons/md";
import Logo from "./assets/pin-new-logo.png";
import Admin from "./pages/admin/Admin";
import FindOnMap from "./pages/findOnMap/FindOnMap";
import TourPage from "./pages/tourPage/TourPage";
import ToursPage from "./pages/toursPage/ToursPage";

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home loading={loading} setLoading={setLoading} />}
        />
        <Route path="/contact" element={<Contact />} />

        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
