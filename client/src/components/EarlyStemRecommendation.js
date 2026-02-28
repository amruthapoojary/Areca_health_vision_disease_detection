import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function EarlyStemRecommendation() {
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
body: JSON.stringify({ disease_type: "stem_bleeding_early" })
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
    title: "Wound Cleaning & Tridemorph Smearing",
    desc: "Immediately chisel out all affected stem tissues at the bleeding site, then smear with 5% Tridemorph (Calixin) or Bordeaux paste. Cover the treated wound with coal tar after 1–2 days for maximum healing.",
    img: "https://www.nichinoindia.com/wp-content/uploads/2021/07/Tridemorph.png",
    link: "https://www.indiamart.com/proddetail/calixin-tridemorph-fungicide-19489249233.html"
  },
  {
    key: "card2",
    title: "Calixin Root Feeding (Tridemorph)",
    desc: "For palms in early stages, root feed with 125 ml of 1.5% Calixin (Tridemorph) solution at quarterly intervals (Jan, April, July, Oct) to arrest internal fungal spread.",
    img: "https://www.indiamart.com/proddetail/calixin-fungicide-15929114597.html",
    link: "https://www.indiamart.com/proddetail/calixin-fungicide-15929114597.html"
  },
  {
    key: "card3",
    title: "Indofil M-45 (Mancozeb) Spray",
    desc: "Foliar spray with Indofil M-45 (3g/L) at monthly intervals from December to May controls early stem lesions and prevents escalation of stem bleeding.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQbcBideIRtNxayAGA2B7KWIS8QJ2Ddn-UiFerA7PCTeHtcC4Ha621WZ7pgVrUzz3-7LlYJe5PK5Vc5TJYf0k4ZJ_qpdC9v3AwBqT0V9lGPLkuLhVDjCoOb",
    link: "https://www.meesho.com/pack-of-100-gm-carbendazim-12-mancozeb-63-wp-a-proven-classic-fungicide-with-systemic-contact-action/p/4lpu5o"
  },
  {
    key: "card4",
    title: "Trichoderma harzianum Paste Smearing",
    desc: "Prepare a talc-based paste of Trichoderma harzianum and smear directly onto early bleeding patches of the stem, then repeat soil application (50–100g/palm) to promote biocontrol inside tissues.",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSsdVWVT98gXaMC7myVnbvl9QTsrESpai5UJjaypIn7wKL6e4IfY8_ofwW1QeFyN-_wvNn7HlIoUIO3yLQBTwb8J-KeAuvmXSgrShixoS0JHP9KaW9iYeYv",
    link: "https://www.flipkart.com/wesfra-bio-organic-trichoderma-viride-liquid-manure/p/itm4be7010a87146"
  },
  {
    key: "card5",
    title: "AMC (Arka Microbial Consortium)",
    desc: "Soil apply 50g of AMC per palm at the start of pre-monsoon, mix with compost for root health and stem protection; increase to half yearly if symptoms appear.",
    img: "https://5.imimg.com/data5/SELLER/Default/2021/8/SV/ND/BN/1279380/arka-microbial-consortium-100-gm-500x500.jpg",
    link: "https://agribegri.com/products/arka-microbial-consortium-amc.php"
  },
  {
    key: "card6",
    title: "Neem Cake + Boric Acid Basal Application",
    desc: "Incorporate 2kg/palm neem cake and 50g boric acid into the soil around palm basin in early rains; reduces initial fungal activity and secondary pest entry.",
    img: "https://plantcare.co.in/wp-content/uploads/2021/09/NEEM-CAKE.jpeg",
    link: "https://plantcare.co.in/product/plant-care-organic-neem-cake/?attribute_weight=500+GRAMS"
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


  <h2>{t("stem_bleeding.title")}: Early Stage</h2>

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

export default EarlyStemRecommendation;
