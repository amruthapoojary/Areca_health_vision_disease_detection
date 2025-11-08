import React from "react";
import "../styles/Navbar.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const { t } = useTranslation();

  return React.createElement(
    "nav",
    { className: "navbar" },
    React.createElement("div", { className: "logo" }, t("navbar.logo")),
    React.createElement(
      "ul",
      { className: "nav-links" },
      React.createElement("li", null, React.createElement("a", { href: "/" }, t("navbar.home"))),
      React.createElement("li", null, React.createElement("a", { href: "/gallery" }, t("navbar.gallery"))),
      React.createElement("li", null, React.createElement("a", { href: "/about" }, t("navbar.about"))),
      React.createElement("li", null, React.createElement("a", { href: "/login" }, t("navbar.login")))
    ),
    React.createElement(LanguageSelector)
  );
};

export default Navbar;