import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CriticalYellowLeafRecommendation() {
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
body: JSON.stringify({ disease_type: "yellow_leaf_critical" })
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
    title: "Blue Copper 50 + Thimet 10G (Soil Application)",
    desc: "Apply a mixture of Blue Copper 50 and Thimet 10G (100 g each per palm) in the basin to check severe yellow leaf decline and associated root infections at critical stage.",
    img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSYyZpWzLUmmiYNX4vvevSoFkyJiv8WeF2AiUMOWPro2eRvfkgr3MsZuuK38EIFBDfF8vVSyabZns_JUsCEn2OCkxFUa5mhjWE58F3UCku0waUBC2gM96nNBA",
    link: "https://www.agristores.in/products/blue-copper-fungicide"
  },
  {
    key: "card2",
    title: "Calixin (Tridemorph) Root Feeding for YLD Complex",
    desc: "Root feed severely affected palms with 125 ml of 1.5% Calixin (Tridemorph) solution per palm at quarterly intervals to suppress root-zone fungal complexes that worsen yellow leaf symptoms.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6U5UNx-yTxU3XTwN_b9aWNTNS_rViYrfvWA&s",
    link: "https://alborzbehsam.com/en/product.php?product=80"
  },
  {
    key: "card3",
    title: "Hexaconazole Root Drench (Severe Decline)",
    desc: "Drench the root zone with Hexaconazole solution (as per label, typically 2 ml/L, 10–15 L per palm) at 3‑month intervals to manage severe root and collar infections aggravating yellowing.",
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRRSG-PNFNkICsVrWiHva9HOW03X7iBGOcWiwDppjPirzI6VnZxkzGjjclPoymWC2SoDcB8-HTsIeHZ2Z2g96jz0i82VdFJm6s5vYSgDOz2xhpZKULuRWHQ-Xk",
    link: "https://agribegri.com/products/contact-plus-1-litre--online-hexaconazole--buy-fungicide-online.php?srsltid=AfmBOop4Eh1I3FqbhVLOTAn0o_68vrl3oEkmEBCFyEUnTT3AKtcJQVPtsgI"
  },
  {
    key: "card4",
    title: "Thimet 10G (Root Grub & Stress Complex)",
    desc: "Apply Thimet 10G (Phorate) granules @ 15 g per palm twice a year (pre- and post-monsoon) around the root zone to control root grubs and reduce secondary stress that accelerates crown yellowing.",
    img: "https://agrosiaa.com/uploads/userdata/seller/752ae7bdbb96bf25280b55990570beabf2048ce0/product_images/64507493994a5349b997d538ef4bc6226c5b1c25d34df797da.jpeg",
    link: "https://agrosiaa.com/uploads/userdata/seller/752ae7bdbb96bf25280b55990570beabf2048ce0/product_images/64507493994a5349b997d538ef4bc6226c5b1c25d34df797da.jpeg"
  },
  {
    key: "card5",
    title: "Fortified Neem Cake + Biofungus Consortia",
    desc: "Apply 2 kg neem cake per palm per year, fortified with Trichoderma / Pseudomonas biofungus consortia (100 g/palm) in the basin to improve chances of survival of critically affected palms.",
    img: "https://m.media-amazon.com/images/I/61lfc-amGEL.jpg",
    link: "https://www.amazon.in/Lakrishi-Organics-Fungicide-Pellets-Fertilizer/dp/B0CHJLVQMX"
  },
  {
  key: "card6",
  title: "High-Dose Organic Manure + Micronutrient Mix",
  desc: "Apply 10–12 kg well-decomposed FYM or compost per palm per year along with a micronutrient mix containing Zn, B, and Mg to improve vigor and support recovery of critically yellowing palms.",
  img: "https://agribegri.com/_next/image?url=https%3A%2F%2Fdujjhct8zer0r.cloudfront.net%2Fmedia%2Fprod_image%2F5035193921738384766.webp&w=640&q=75",
  link: "https://agribegri.com/products/buy-panchsheel-super-fertilizer-online--micronutrient-fertilizer.php?utm_term=&utm_campaign=Non+branded+standard+shopping+19%2F11%2F25&utm_source=google&utm_medium=cpc&hsa_acc=7428009962&hsa_cam=17668524651&hsa_grp=187279329525&hsa_ad=784723713048&hsa_src=g&hsa_tgt=pla-2456794154052&hsa_kw=&hsa_mt=&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=23275737078&gclid=Cj0KCQiAosrJBhD0ARIsAHebCNqNv9VRrBDyXkIX8yb0I9wE2cryKuMV9W8MojCx0vGaV0K7YyVmaAoaAhGPEALw_wcB"
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


  <h2>{t("yellow_leaf.title")}: Critical Stage</h2>

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

export default CriticalYellowLeafRecommendation;
