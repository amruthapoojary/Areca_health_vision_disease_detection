import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("userLang", lang); // Persist selection
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("hi")}>हिंदी</button>
      <button onClick={() => changeLanguage("kn")}>ಕನ್ನಡ</button>
    </div>
  );
};

export default LanguageSelector;