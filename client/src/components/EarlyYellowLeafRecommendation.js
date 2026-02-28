import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function EarlyYellowLeafRecommendation() {
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
body: JSON.stringify({ disease_type: "yellow_leaf_early" })
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
    title: "Bordeaux Mixture (Copper-based Fungicide)",
    desc: "Widely used as a preventive and curative fungicide for fungal diseases in arecanut. Apply as a 1% spray on palm leaves at the first signs of yellowing to prevent disease spread and secondary infections.",
    img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
    link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
  },
  {
    key: "card2",
    title: "Ridomil Gold (Metalaxyl + Mancozeb)",
    desc: "A powerful systemic and contact fungicide, effective in controlling soil-borne and foliar pathogens associated with yellow leaf disease. Use as a foliar spray (0.2%) at early stages for best results.",
    img: "https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png",
    link: "https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64--?srsltid=AfmBOorzwyIt8pG3n6SNlxWEr7A0xyFy08-4jB5QL1XNTQl_xvc3UX9Y4Q8"
  },
  {
    key: "card3",
    title: "Copper Oxychloride",
    desc: "Recommended as an early intervention fungicide, Copper Oxychloride helps limit further yellowing and controls secondary fungal outbreaks. Apply a 0.25% spray at onset of symptoms.",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhuDJP0jeEMdYfreIrKjHInoz_Iews20MAwDCM9vChl6n4evfdmR050KWi8wSy8SbY40wYTLhpdkBJuZl0UYht2n13K2IpCO1_ZyXPKVNVJAbDt6e-58aPPdU",
    link: "https://agribegri.com/products/thyla-p-1-litre.php?srsltid=AfmBOorlUJamX8if2se4BcQ3F0eSKA04ZxA0prpVMMoy7AdNHhtuZG9YAUk"
  },
  {
    key: "card4",
    title: "Trichoderma harzianum (Bio-agent)",
    desc: "A natural soil fungus that promotes root health and controls soil-borne pathogens. Mix with farmyard manure and apply to root zone at the onset of yellowing for disease suppression.",
    img: "https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg",
    link: "https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X?ref_=fplfs&smid=A2AL6IVND0I91F&th=1"
  },
  {
    key: "card5",
    title: "Neem Cake/Extract",
    desc: "Neem-based products serve as both organic soil conditioners and bio-pesticides, reducing root infections and supporting early-stage palm health. Apply 1.5–2 kg per palm annually at first signs of yellowing.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSYrQx4ATUcC9ejC254wp8LAkQet_wzHjQdj8osFsRGGw3fPrWbAAXiFACSzg1T7clu2--Ip9x9La-UNQS_H1jSqiQmUBydKMW6s0rYS-9I",
    link: "https://agriplexindia.com/products/anshul-maxi-neem-azadiractin-0-03-ec?variant=44325038817574&country=IN"
  },
  {
    key: "card6",
    title: "Balanced NPK + Micronutrients",
    desc: "Use a balanced fertilizer regime with NPK and supplement with magnesium sulphate and borax to correct nutrient deficiencies linked to yellowing. Boosts plant immunity and limits disease progression at the earliest stage.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ8o-W4Y4yHzaotuG47aWNyKysm7KkKIlpBiuCgcQQ7VjJ-x3F6d4NIlsBnORJLQPHC28jtBe5e0n5bBQ3NrE5IwrT7phwNmCfsvw3tpSZ0I5A94BExNkCg",
    link: "https://www.flipkart.com/aranyani-balanced-npk-nutrients-plants-manure/p/itm73e0b372658ce?pid=SMNH2YBVYYAFCJJJ"
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


  <h2>{t("yellow_leaf.title")}: Early Stage</h2>

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

export default EarlyYellowLeafRecommendation;
