import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ModerateStemRecommendation() {
const { t } = useTranslation();
const navigate = useNavigate();
const audioRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);

const toggleAudio = async () => {
try {
if (audioRef.current) {
if (isPlaying) {
audioRef.current.pause();
setIsPlaying(false);
} else {
audioRef.current.play();
setIsPlaying(true);
}
} else {
const response = await fetch("http://localhost:5001/disease_audio", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ disease_type: "stem_bleeding_moderate" })
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
audioRef.current = new Audio(url);
audioRef.current.play();
setIsPlaying(true);
audioRef.current.onended = () => setIsPlaying(false);
}
} catch (error) {
console.error("Error playing audio:", error);
}
};

const cards = [
  {
    key: "card1",
    title: "Hexaconazole Root Feeding",
    desc: "Root feed affected palms with Hexaconazole (2 ml/100 ml water) at three-month intervals (January, April, September) to target moderate internal infections and support palm recovery.",
    img: "https://5.imimg.com/data5/SELLER/Default/2022/9/ND/CF/IR/136921731/hexaconazole-fungicide-500x500.jpg",
    link: "https://www.indiamart.com/proddetail/hexaconazole-fungicide-18528738955.html"
  },
  {
    key: "card2",
    title: "Aureofungin + Copper Sulphate Spraying",
    desc: "Foliar spray a mixture of Aureofungin Sol and Copper Sulphate (0.05 g/L each) monthly during moderate disease progression to suppress fungal spread and heal lesions rapidly.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ35B1x4TXApsAQ6W9yMcKBoosXqYpfbXi2MTrgYiH8wWzg7t_sfdAePlZRmWpUGpLe5SOMHRwQVhv9q_46gWNL8hqUgDWQmmIcXmtq0I-WKoYX4eJoJ7n5",
    link: "https://www.indiamart.com/proddetail/aureofungin-16044183997.html"
  },
  {
    key: "card3",
    title: "Propineb 70% WP Spray",
    desc: "Spray Propineb 0.25% as a contact fungicide on moderate stem bleeding patches and leaf axils to arrest fungal progress and promote rapid healing.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTwOi5x4WHilPfVfhnlNUtuvWeSPnI9mjDVjzlCGptu0KhJuQdcqFoAFrVxALzYeIzOfdVRJuPUkVlC4ttqCIsjhtGHp4Rxmf1knJ2H001q",
    link: "https://agribegri.com/products/propineb-fungicide.php"
  },
  {
    key: "card4",
    title: "Arka Microbial Consortium (AMC)",
    desc: "Apply 50g/tree of AMC at monsoon onset, and mix with farmyard manure at moderate disease stage. Repeat if symptoms persist; boosts root health and biocontrol of fungal pathogens.",
    img: "https://5.imimg.com/data5/SELLER/Default/2021/8/SV/ND/BN/1279380/arka-microbial-consortium-100-gm-500x500.jpg",
    link: "https://agribegri.com/products/arka-microbial-consortium-amc.php"
  },
  {
    key: "card5",
    title: "Carbendazim + Mancozeb (Combo Fungicide)",
    desc: "Use combo fungicide containing Carbendazim 12% and Mancozeb 63% (0.1%) as a spray for moderate stem cankers. Strong efficacy in reducing lesion spread and supporting tissue recovery.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQbcBideIRtNxayAGA2B7KWIS8QJ2Ddn-UiFerA7PCTeHtcC4Ha621WZ7pgVrUzz3-7LlYJe5PK5Vc5TJYf0k4ZJ_qpdC9v3AwBqT0V9lGPLkuLhVDjCoOb",
    link: "https://www.meesho.com/pack-of-100-gm-carbendazim-12-mancozeb-63-wp-a-proven-classic-fungicide-with-systemic-contact-action/p/4lpu5o"
  },
  {
    key: "card6",
    title: "Bordeaux Paste + Protective Cover",
    desc: "After chiseling infected stem tissue, smear Bordeaux paste and cover wound with protective material (plastic wrap or coal tar). Essential for palm recovery at moderate stage and to protect from secondary infection.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSRhhuSLrDP8Kve7ujZuNHjaUM3eiW1q0HdaI7gf8qxK53nUGUepOEsisI-bdjS9Spz2l5hXcbERA_cGdQ85cIgqIAv51JPEWJ-2fN_vIfalvsvAzvmtLfK",
    link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
  }
];


return (
<div className="recommendation-container" style={{ padding: "20px" }}>
<button
style={{
position: "fixed",
top: "20px",
right: "20px",
backgroundColor: "green",
color: "white",
border: "none",
padding: "10px 20px",
borderRadius: "8px",
cursor: "pointer",
fontSize: "16px",
fontWeight: "bold",
boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
}}
onClick={() => navigate("/scan")}
>
{t("back")} </button>


  <h2>{t("stem_bleeding.title")}: Moderate Stage</h2>

  <button
    onClick={toggleAudio}
    style={{
      margin: "20px 0",
      padding: "10px 20px",
      backgroundColor: isPlaying ? "#B22222" : "#006400",
      color: "white",
      borderRadius: "8px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
    }}
  >
    {isPlaying ? t("audio.pause") : t("audio.play")}
  </button>

  <div className="card-grid">
    {cards.map((card) => (
      <div key={card.key} className="recommendation-card">
        <img src={card.img} alt={card.title} />
        <h3>{card.title}</h3>
        <p>{card.desc}</p>
        <a href={card.link} target="_blank" rel="noopener noreferrer">
          Buy Now
        </a>
      </div>
    ))}
  </div>
</div>


);
}

export default ModerateStemRecommendation;
