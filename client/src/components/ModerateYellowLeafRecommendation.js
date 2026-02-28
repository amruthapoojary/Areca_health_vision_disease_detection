import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ModerateYellowLeafRecommendation() {
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
body: JSON.stringify({ disease_type: "yellow_leaf_moderate" })
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
    title: "Bordeaux Mixture 1% + Wettable Sulphur 0.25%",
    desc: "Spray a mixture of Bordeaux 1% and wettable sulphur 0.25% to slow disease spread. Helps moderate infection and controls secondary fungal growth.",
    img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
    link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
  },
  {
    key: "card2",
    title: "Ridomil Gold (Systemic Fungicide)",
    desc: "Apply Ridomil Gold (0.2%) foliar spray to moderate infected palms. Repeat after 30–40 days if symptoms persist. Enhances systemic resistance to yellow leaf progression.",
    img: "https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png",
    link: "https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64--?srsltid=AfmBOorzwyIt8pG3n6SNlxWEr7A0xyFy08-4jB5QL1XNTQl_xvc3UX9Y4Q8"
  },
  {
    key: "card3",
    title: "Trichoderma + Neem Cake Soil Treatment",
    desc: "Apply Trichoderma harzianum mixed with neem cake (1.5–2kg/palm) around root zone to enhance microbial activity, control pathogens, and improve nutrient absorption in moderate-stage palms.",
    img: "https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg",
    link: "https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X?ref_=fplfs&smid=A2AL6IVND0I91F&th=1"
  },
  {
  key: "card4",
  title: "Soil Magnesium Supplement (MgSO₄)",
  desc: "Apply Magnesium Sulphate to correct Mg deficiency, which is a major cause of yellow leaf disease in arecanut. Helps restore chlorophyll and reduce yellowing.",
  img: "https://m.media-amazon.com/images/I/71WoHqPUVRL._SX522_.jpg",
  link: "https://www.amazon.in/Agricare-SPotMag-Conditioner-Chlorophyll-Fertilizer/dp/B0DVSX58DG"
}

,
  {
    key: "card5",
    title: "Balanced NPK Fertilization",
    desc: "Use NPK with additional MgSO4 and borax to correct nutrient deficiencies, improve plant vigor, and limit yellow leaf severity.",
    img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ8o-W4Y4yHzaotuG47aWNyKysm7KkKIlpBiuCgcQQ7VjJ-x3F6d4NIlsBnORJLQPHC28jtBe5e0n5bBQ3NrE5IwrT7phwNmCfsvw3tpSZ0I5A94BExNkCg",
    link: "https://www.flipkart.com/aranyani-balanced-npk-nutrients-plants-manure/p/itm73e0b372658ce?pid=SMNH2YBVYYAFCJJJ"
  },
 {
  key: "card6",
  title: "Copper Oxychloride Fungicide",
  desc: "Apply Copper Oxychloride to control fungal infections that worsen yellow leaf disease. It protects foliage, improves recovery, and prevents further yellowing.",
  img: "https://m.media-amazon.com/images/I/71uuz2OcRmL._SY500_.jpg",
  link: "https://www.amazon.in/gp/aw/d/B09CZG7CV5/?_encoding=UTF8&pd_rd_plhdr=t&aaxitk=a0fef56d345875b23b43ecd8f4dd489e&hsa_cr_id=2014882980602&qid=1764992650&sr=1-1-e0fa1fdd-d857-4087-adda-5bd576b25987&aref=hYDGYOz3tM&ref_=sbx_s_sparkle_sbtcd_asin_0_img&pd_rd_w=6yI85&content-id=amzn1.sym.6dfd6df7-44a2-4792-8c83-3ac8a4ba533a%3Aamzn1.sym.6dfd6df7-44a2-4792-8c83-3ac8a4ba533a&pf_rd_p=6dfd6df7-44a2-4792-8c83-3ac8a4ba533a&pf_rd_r=HN1WZ892PFM8MHSDZV5B&pd_rd_wg=QecB9&pd_rd_r=6fe65d6b-1cb3-404b-9b26-f5d409e0872d&th=1"
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


  <h2>{t("yellow_leaf.title")}: Moderate Stage</h2>

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

export default ModerateYellowLeafRecommendation;
