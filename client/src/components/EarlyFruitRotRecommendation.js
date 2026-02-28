import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function EarlyFruitRotRecommendation() {
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
body: JSON.stringify({ disease_type: "fruit_rot_early" })
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
    title: "Bordeaux Mixture (1%)",
    desc: "Prophylactic and early curative spray of 1% Bordeaux Mixture is the most recommended and effective treatment. Apply the first spray just after the onset of monsoon and a repeat spray 40-45 days later for maximum protection.",
    img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
    link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
  },
  {
    key: "card2",
    title: "Metalaxyl + Mancozeb (Ridomil Gold)",
    desc: "An effective systemic and contact fungicide recommended for early fruit rot. Use a 0.2% foliar spray at early signs of infection, especially around pre-monsoon and monsoon onset.",
    img: "https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png",
    link: "https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64"
  },
  {
    key: "card3",
    title: "Copper Oxychloride (0.3%)",
    desc: "For early infection, spraying Copper Oxychloride (0.3%) reduces lesion development and prevents initial nut drop. Apply at early symptoms and repeat as needed.",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhuDJP0jeEMdYfreIrKjHInoz_Iews20MAwDCM9vChl6n4evfdmR050KWi8wSy8SbY40wYTLhpdkBJuZl0UYht2n13K2IpCO1_ZyXPKVNVJAbDt6e-58aPPdU",
    link: "https://agribegri.com/products/thyla-p-1-litre.php"
  },
  {
    key: "card4",
    title: "Trichoderma harzianum (Bio-agent)",
    desc: "Apply Trichoderma harzianum (10⁸ cfu/ml) as a bunch dip or in the root zone to suppress Phytophthora and support early biocontrol, reducing initial nut rot and loss.",
    img: "https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg",
    link: "https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X"
  },
  {
    key: "card5",
    title: "Neem Cake (Soil Amendment)",
    desc: "Incorporating 1.5–2 kg neem cake per palm at the start of the rainy season helps check early-stage fruit rot by improving soil health and providing anti-fungal activity.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSYrQx4ATUcC9ejC254wp8LAkQet_wzHjQdj8osFsRGGw3fPrWbAAXiFACSzg1T7clu2--Ip9x9La-UNQS_H1jSqiQmUBydKMW6s0rYS-9I",
    link: "https://agriplexindia.com/products/anshul-maxi-neem-azadiractin-0-03-ec"
  },
  {
    key: "card6",
    title: "Sanitation and Drainage",
    desc: "Regularly collect and destroy fallen infected nuts/leaves, and ensure proper drainage to prevent initial disease spread and pathogen buildup; integrate with chemical sprays for maximum early-stage effect.",
    img: "https://image.shutterstock.com/image-photo/cleaning-fallen-nuts-coconut-farm-260nw-1122420124.jpg",
    link: "https://www.amazon.in/Garden-Leaf-Rake/dp/B07VS45996"
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


  <h2>{t("fruit_rot.title")}: Early Stage</h2>

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

export default EarlyFruitRotRecommendation;
