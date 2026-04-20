import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
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
      <Routes>
        <Route
          path="/"
          element={<Home loading={loading} setLoading={setLoading} />}
        />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/rent_equipment" element={<Equipment />} />
        {/* <Route path="/tours/find_on_map" element={<FindOnMap />} /> */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/tour/:id" element={<TourPage />} />
        <Route path="/tours/:category" element={<ToursPage />} />
        <Route path="/team" element={<AboutUs />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
    // <div className="construction">
    //   <div className="flex">
    //       <img
    //         className="brand_logo"
    //         src={Logo}
    //         alt="PinGeorgia.ge - Adventures Around Georgia"
    //       />
    //         <h1>
    //           <strong>PINGEORGIA</strong>
    //         </h1>
    //     </div>
    //     <br/>
    //     <div className="flex">
    //   <MdOutlineConstruction size="36px" color="black"/>
    //   <h2>Website under construction. Send us a mail pingeorgiatravel@gmail.com</h2>
    //   </div>
    // </div>
  );
}

export default App;
