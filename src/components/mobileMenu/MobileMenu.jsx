import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import "./MobileMenu.css";

export default function MobileMenu() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        background: "#222",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link to="/" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">Home</h2>
        </Link>

        <Link to="/about_us" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">About Us</h2>
        </Link>

        <Link to="/hiking" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">Hiking</h2>
        </Link>

        <Link to="/canyoning" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">Canyoning</h2>
        </Link>

        <Link to="/mountain_biking" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">Mountain Biking</h2>
        </Link>

        <Link
          to="/batumi_hiking_festival_2024"
          className="link mobile_menu_link"
        >
          <h2 className="mobile_nav_item">Winter Tours</h2>
        </Link>

        <Link to="/rent_equipment" className="link mobile_menu_link">
          <h2 className="mobile_nav_item">Rent Equipment</h2>
        </Link>
      </List>
    </Box>
  );

  return (
    <div className="mobile_menu">
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button className="burger" onClick={toggleDrawer(anchor, true)}>
            <RxHamburgerMenu color="white" size="32px" />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
