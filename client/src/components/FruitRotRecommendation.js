import React, { useRef, useState } from "react";
import '../styles/Recommendation.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FruitRotRecommendation() {
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
          body: JSON.stringify({ disease_type: "fruit_rot" })
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

  return (
    <div className="recommendation-container" style={{ padding: "20px" }}>
      {/* Back Button */}
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
        {t("common.back")}
      </button>

      <h2>{t("fruit_rot.title")}</h2>
      <p className="disease-description">
        {t("fruit_rot.description")} <em>Phytophthora palmivora</em>. {t("fruit_rot.description2")}
      </p>

      {/* Play/Pause Audio Button */}
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
        {isPlaying ? t("common.pause_audio") : t("common.play_audio")}
      </button>

      {/* Recommendation Cards */}
      <div className="card-grid">

        {/* Card 1 */}
        <div className="recommendation-card">
          <img src="https://katyayanikrishidirect.com/cdn/shop/files/bordeaux_mixture_fungicide.webp?v=1752236809&width=713" alt="Bordeaux Mixture" />
          <h3>{t("fruit_rot.card1.title")}</h3>
          <p>{t("fruit_rot.card1.desc")}</p>
          <a href="https://katyayanikrishidirect.com/products/bordeaux-mixture-fungicide" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

        {/* Card 2 */}
        <div className="recommendation-card">
          <img src="https://cdn.dotpe.in/longtail/store-items/6792607/xo91RAVs.png" alt="Ridomil Gold" />
          <h3>{t("fruit_rot.card2.title")}</h3>
          <p>{t("fruit_rot.card2.desc")}</p>
          <a href="https://www.kisancenter.in/product/26147925/Syngenta-Ridomil-Gold-Fungicide--Metalaxyl-4--Manconzeb-64--?srsltid=AfmBOorzwyIt8pG3n6SNlxWEr7A0xyFy08-4jB5QL1XNTQl_xvc3UX9Y4Q8" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

        {/* Card 3 */}
        <div className="recommendation-card">
          <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQhuDJP0jeEMdYfreIrKjHInoz_Iews20MAwDCM9vChl6n4evfdmR050KWi8wSy8SbY40wYTLhpdkBJuZl0UYht2n13K2IpCO1_ZyXPKVNVJAbDt6e-58aPPdU" alt="Phosphorus Acid" />
          <h3>{t("fruit_rot.card3.title")}</h3>
          <p>{t("fruit_rot.card3.desc")}</p>
          <a href="https://agribegri.com/products/thyla-p-1-litre.php?srsltid=AfmBOorlUJamX8if2se4BcQ3F0eSKA04ZxA0prpVMMoy7AdNHhtuZG9YAUk" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

        {/* Card 4 */}
        <div className="recommendation-card">
          <img src="https://m.media-amazon.com/images/I/71tje6e9SIL.SL1280.jpg" alt="Trichoderma" />
          <h3>{t("fruit_rot.card4.title")}</h3>
          <p>{t("fruit_rot.card4.desc")}</p>
          <a href="https://www.amazon.in/Trichoherz-P-Trichoderma-Harzianum-Gardening-Pack/dp/B0D78X9S2X?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A2AL6IVND0I91F&th=1" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

        {/* Card 5 */}
        <div className="recommendation-card">
          <img src="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSYrQx4ATUcC9ejC254wp8LAkQet_wzHjQdj8osFsRGGw3fPrWbAAXiFACSzg1T7clu2--Ip9x9La-UNQS_H1jSqiQmUBydKMW6s0rYS-9I" alt="Neem Extract" />
          <h3>{t("fruit_rot.card5.title")}</h3>
          <p>{t("fruit_rot.card5.desc")}</p>
          <a href="https://agriplexindia.com/products/anshul-maxi-neem-azadiractin-0-03-ec?variant=44325038817574&country=IN&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOorbEojP5sAVjqO6nYxa06oANBg6ug3U5OLBGCWbsW5NL-72Yr-VcSE" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

        {/* Card 6 */}
        <div className="recommendation-card">
          <img src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQRDqHfzHjlAnA-S19L8SaHc4f9SV_yxGGFWA1J3vb3JNN4Trds_s9ZsuGO_KNryy6d3EpMtjsm7CNs9Y51F9nYACBD6HoWNjEwxyz6p7xYEHbDRhziVYNcHg" alt="Mancozeb" />
          <h3>{t("fruit_rot.card6.title")}</h3>
          <p>{t("fruit_rot.card6.desc")}</p>
          <a href="https://agribegri.com/products/buy-indofil-m-45-mancozeb-75-wp-broad-spectrum-fungicides--online-agro-store.php?srsltid=AfmBOopcQaxB-9UYjuNKwPFvsMGq3ReLqU39zgeyc9TrslAJkwbgWVGeFio" target="_blank" rel="noopener noreferrer">
            {t("common.buy")}
          </a>
        </div>

      </div>
    </div>
  );
}

export default FruitRotRecommendation;