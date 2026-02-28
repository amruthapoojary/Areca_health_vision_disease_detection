import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ModerateFruitRotRecommendation() {
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
body: JSON.stringify({ disease_type: "fruit_rot_moderate" })
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
    desc: "Apply Bordeaux Mixture (1%) as a foliar spray at 40-day intervals throughout the monsoon. At moderate infection, regular repeat sprays help control spread and protect remaining healthy nuts.",
    img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
    link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
  },
  {
    key: "card2",
    title: "Mandipropamid 23.4% SC",
    desc: "Use Mandipropamid 0.5% as a contact and translaminar fungicide, effective in endemic areas especially for managing moderate fruit rot where conventional treatments might fail.",
    img: "https://cdn.shopify.com/s/files/1/0715/2755/9659/products/mandipropamid_fungicide_large.jpg",
    link: "https://agribegri.com/products/mandipropamid-fungicide.php"
  },
  {
    key: "card3",
    title: "Metalaxyl + Mancozeb",
    desc: "Metalaxyl + Mancozeb (0.2%) as a foliar spray during mid-monsoon and repeated at marble/premature nut stage is highly effective for moderate rot and limits further nut drop.",
    img: "https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png",
    link: "https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64"
  },
  {
    key: "card4",
    title: "Copper Oxychloride (0.3%)",
    desc: "For moderate infection and where Bordeaux Mixture isn’t feasible, spraying Copper Oxychloride 0.3% controls lesions and halts further spread.",
    img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhuDJP0jeEMdYfreIrKjHInoz_Iews20MAwDCM9vChl6n4evfdmR050KWi8wSy8SbY40wYTLhpdkBJuZl0UYht2n13K2IpCO1_ZyXPKVNVJAbDt6e-58aPPdU",
    link: "https://agribegri.com/products/thyla-p-1-litre.php"
  },
  {
    key: "card5",
    title: "Covering Fruit Bunches with Polythene",
    desc: "Prevent rain splash and further fruit rot by covering bunches with 125 gauge polythene bags (75x60cm); this is especially effective at moderate disease level through monsoon.",
    img: "https://5.imimg.com/data5/FV/ND/My/SELLER-8772854/plastic-bags-500x500.jpg",
    link: "https://www.indiamart.com/proddetail/polythene-bags-18128530155.html"
  },
  {
    key: "card6",
    title: "Trichoderma harzianum & Neem Cake",
    desc: "Apply Trichoderma harzianum (bio-agent) and neem cake (1.5–2kg/palm) at base; this integrated management is proven to minimize moderate fruit rot losses.",
    img: "https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg",
    link: "https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X"
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


  <h2>{t("fruit_rot.title")}: Moderate Stage</h2>

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

export default ModerateFruitRotRecommendation;
