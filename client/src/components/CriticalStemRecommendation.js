import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CriticalStemRecommendation() {
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
body: JSON.stringify({ disease_type: "stem_bleeding_critical" })
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
    title: "Complete Chiseling & Antiseptic Dressing",
    desc: "Remove all necrotic stem tissues up to healthy wood, disinfect thoroughly with 10% sodium hypochlorite or copper oxychloride. Apply antiseptic dressing (coal tar + copper paste) to the wound to prevent reinfection.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQJG4MBBK2FBAw1qpudHSlFWGOCLcMiEzKDeY-dkvvKF7TuE3d53IvoueE8otcE2txqcc1F9-6ibxcS2ghVUiyJ0i_PWEEL3mf4fR-Ey8gZ_SCg5OsKxKRTDg",
    link: "https://agribegri.com/products/gharda-cutox-copper-oxychloride-50-wp-fungicide.php"
  },
  {
    key: "card2",
    title: "Removal and Destruction of Severely Infected Palms",
    desc: "Palms with more than 75% stem circumference affected and rapid deterioration should be removed and destroyed to prevent pathogen spread to neighboring trees.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1eOHtqdyuWDi3m3SRj7u4nrCgYl0reRQb3UU43tMrkA&t=1",
    link: "https://krushidukan.bharatagri.com/products/arecanut-seedlings"
  },
  {
    key: "card3",
    title: "High-Dose Systemic Fungicide Soaking",
    desc: "Soak the critical palm's root zone with Carbendazim (0.2% solution, 10L/palm) or Tricyclazole (0.2%), repeated fortnightly as a salvage attempt for systemic fungus kill-off.",
    img: "https://5.imimg.com/data5/SELLER/Default/2022/6/TV/EF/YK/143481956/tricyclazole-75-wp-1000x1000.jpeg",
    link: "https://www.indiamart.com/proddetail/shree-tricyclazole-75-wp-fungicide-25890460233.html"
  },
  {
    key: "card4",
    title: "Boric Acid and Potassium Application",
    desc: "Increase doses of Boric Acid (up to 100g/palm/year) and Potassium Sulphate (300g/palm/year) to boost emergency recovery potential and strengthen residual tissues.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR0bfHkUYglGyD3K9ySphF-PWouf7ObzO_VDj1spYCrs3DXnPnY6XUB6tQgtpUdev69EBwEJqGI1K5O5kuAiKrqoUoN5fEWd8ZX-q3L56NX64qCUL02FzFvtQ",
    link: "https://www.mystore.in/en/product/0-0-50-potassium-sulphate-1"
  },
  {
    key: "card5",
    title: "Intensive Soil Drenching With AMC + Trichoderma",
    desc: "Apply 100g/palm of Arka Microbial Consortium (AMC) and 50g Trichoderma harzianum, mixed into 20L compost slurry and drenched at the base every 2 weeks.",
    img: "https://5.imimg.com/data5/SELLER/Default/2021/8/SV/ND/BN/1279380/arka-microbial-consortium-100-gm-500x500.jpg",
    link: "https://agribegri.com/products/arka-microbial-consortium-amc.php"
  },
  {
    key: "card6",
    title: "Drainage and Relocation Measures",
    desc: "If waterlogging is present near the palm, install large gravel drains and consider relocating saplings to raised beds after removal of dead palms; essential in critical disease to prevent further outbreaks.",
    img: "https://www.gardensalive.com/product/gravel-drainage-trenches",
    link: "https://www.gardensalive.com/product/gravel-drainage-trenches"
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


  <h2>{t("stem_bleeding.title")}: Critical Stage</h2>

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

export default CriticalStemRecommendation;
