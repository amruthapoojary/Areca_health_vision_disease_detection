import React from "react";
import "../styles/Footer.css";      // In Footer.js

const Footer = () => {
  return React.createElement(
    "footer",
    { className: "footer" },
    
    React.createElement("p", null, "© 2024 Areca Vision. All rights reserved.")
  );
};

export default Footer;
