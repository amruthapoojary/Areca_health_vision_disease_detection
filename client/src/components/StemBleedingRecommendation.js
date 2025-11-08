import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function StemBleedingRecommendation() {
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
        const response = await fetch("http://localhost:5001/detailed_recommendation_audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease_type: "diseased_stem" })
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
      title: t("stem_bleeding.cards.card1.title"),
      desc: t("stem_bleeding.cards.card1.desc"),
      img: "https://5.imimg.com/data5/SELLER/Default/2022/6/TV/EF/YK/143481956/tricyclazole-75-wp-1000x1000.jpeg",
      link: "https://www.indiamart.com/proddetail/shree-tricyclazole-75-wp-fungicide-25890460233.html",
      buyText: t("buy.indiamart")
    },
    {
      key: "card2",
      title: t("stem_bleeding.cards.card2.title"),
      desc: t("stem_bleeding.cards.card2.desc"),
      img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQJG4MBBK2FBAw1qpudHSlFWGOCLcMiEzKDeY-dkvvKF7TuE3d53IvoueE8otcE2txqcc1F9-6ibxcS2ghVUiyJ0i_PWEEL3mf4fR-Ey8gZ_SCg5OsKxKRTDg",
      link: "https://agribegri.com/products/gharda-cutox-copper-oxychloride-50-wp-fungicide.php",
      buyText: t("buy.agribegri")
    },
    {
      key: "card3",
      title: t("stem_bleeding.cards.card3.title"),
      desc: t("stem_bleeding.cards.card3.desc"),
      img: "https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713",
      link: "https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide",
      buyText: t("buy.katyayani")
    },
    {
      key: "card4",
      title: t("stem_bleeding.cards.card4.title"),
      desc: t("stem_bleeding.cards.card4.desc"),
      img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSsdVWVT98gXaMC7myVnbvl9QTsrESpai5UJjaypIn7wKL6e4IfY8_ofwW1QeFyN-_wvNn7HlIoUIO3yLQBTwb8J-KeAuvmXSgrShixoS0JHP9KaW9iYeYv",
      link: "https://www.flipkart.com/wesfra-bio-organic-trichoderma-viride-liquid-manure/p/itm4be7010a87146?pid=SMNGD6BKXWUZ4GFA&lid=LSTSMNGD6BKXWUZ4GFALPQ858&marketplace=FLIPKART&cmpid=content_soil-manure_8965229628_gmc",
      buyText: t("buy.flipkart")
    },
    {
      key: "card5",
      title: t("stem_bleeding.cards.card5.title"),
      desc: t("stem_bleeding.cards.card5.desc"),
      img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRmxivcPziIwgNrz9KAkunjT-0A1q5N7aHc8WECfoFAP2Uw1TwTGA1LwOxS_l1_7AjwA7hC_sMwpw0CfXqpUMT8VWDETqXWtDigy2su1QY5RezcoWH0W-qyAg",
      link: "https://plantcare.co.in/product/plant-care-organic-neem-cake/?attribute_weight=500+GRAMS&srsltid=AfmBOopnM5h086FEsfYgeLvLNeE7u96ziiF_R-V72UK_6NyrN_pH-faoUTA",
      buyText: t("buy.plantcare")
    },
    {
      key: "card6",
      title: t("stem_bleeding.cards.card6.title"),
      desc: t("stem_bleeding.cards.card6.desc"),
      img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQbcBideIRtNxayAGA2B7KWIS8QJ2Ddn-UiFerA7PCTeHtcC4Ha621WZ7pgVrUzz3-7LlYJe5PK5Vc5TJYf0k4ZJ_qpdC9v3AwBqT0V9lGPLkuLhVDjCoOb",
      link: "https://www.meesho.com/pack-of-100-gm-carbendazim-12-mancozeb-63-wp-a-proven-classic-fungicide-with-systemic-contact-action/p/4lpu5o?utm_source=google&utm_medium=cpc&utm_campaign=gmc&srsltid=AfmBOop1Jqm94nj3RdbYmhTY75fRJbgb_S-1GTvWVGyoPAvbRVFubRbn5G8",
      buyText: t("buy.flipkart")
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
        {t("back")}
      </button>

      <h2>{t("stem_bleeding.title")}</h2>
      <p className="disease-description">
        {t("stem_bleeding.description")} <em>Ganoderma lucidum</em>.
      </p>

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
              {card.buyText}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StemBleedingRecommendation;