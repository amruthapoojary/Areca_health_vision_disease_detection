import React from "react";
// ✅ Correct (files are already in the same folder)
import Navbar from './Navbar';
import Carousel from './Carousel';
import Footer from './Footer';
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

function HomePage() {
    
  const { t } = useTranslation();
  return (
   
    <div>
       
      <Carousel />
      <Footer />
    </div>
  );
}

export default HomePage;