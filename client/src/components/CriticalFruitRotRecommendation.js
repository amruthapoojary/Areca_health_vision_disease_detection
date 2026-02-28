import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CriticalFruitRotRecommendation() {
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
body: JSON.stringify({ disease_type: "fruit_rot_critical" })
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
title: "Sequential Bordeaux Mixture Sprays (1%)",
desc: "At severe infection, apply Bordeaux mixture (1%) in 3-4 sequential sprays at 40-day intervals from early monsoon; additional sprays may be required if rains persist or outbreak is severe. Ensures maximum suppression during critical stage.",
img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide"
},
{
key: "card2",
title: "Mandipropamid 23.4% SC Fungicide",
desc: "Use Mandipropamid (0.5%) as a contact and translaminar fungicide for critical infection, especially where conventional treatments show reduced efficacy; repeat at 45-day intervals.",
img: "https://agrosiaa.com/uploads/userdata/seller/9d6279410dbb2224c5d87c5917c27b60752211ef/product_images/1618763945eaf9eb27b98ed50aeaf0c211925bb8ea47810a1f.jpg",
link: "https://agrosiaa.com/products/detail/syngenta-revus-contact-fungicide-160-ml-mandipropamid-23-4-sc-1738146238907173?srsltid=AfmBOopx4iJpA93S_vqqIo5niOUhoQlJOhJmzTqFPgIKtdFZstCEIrJ4"
},
{
key: "card3",
title: "Metalaxyl-MZ or Curzate Application",
desc: "For advanced fruit rot, apply Metalaxyl-MZ (0.2%) or Curzate (Cymoxanil + Mancozeb, 0.25%) as foliar sprays during heavy infection and persistent rainfall. Effective against virulent Phytophthora strains.",
img: "https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png",
link: "https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64"
},
{
key: "card4",
title: "Mulching & Polythene Bunch Covering",
desc: "In severely affected plots, mulch soil with transparent polythene and cover arecanut bunches with 125 gauge polythene bags (75x60 cm) to prevent splash dispersal and reduce nut drop.",
img: "https://5.imimg.com/data5/FV/ND/My/SELLER-8772854/plastic-bags-500x500.jpg",
link: "https://www.indiamart.com/proddetail/polythene-bags-18128530155.html"
},
{
key: "card5",
title: "Trichoderma harzianum + Neem Cake + Lime",
desc: "Integrate Trichoderma harzianum (bio-agent) at the base, neem cake (1.5–2kg/palm), and agricultural lime (200kg/acre before monsoon) for critical-stage palm recovery and soil neutralization. Improves survival and vigor when disease is severe.",
img: "https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg](https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg)",
link: "https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X](https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X)"
},
{
key: "card6",
title: "Removal & Destruction of Severely Affected Nuts",
desc: "Collect all fallen and infected nuts, leaves, and plant debris immediately during peak infection, and destroy them outside the plantation to break the disease cycle. Essential step at critical stage outbreaks with active shedding.",
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


  <h2>{t("fruit_rot.title")}: Critical Stage</h2>

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

export default CriticalFruitRotRecommendation;
