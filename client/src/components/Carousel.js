import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Carousel = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://wallpapercave.com/wp/wp3115809.jpg",
      content: (
        <div className="carousel-content" style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "2rem",
          borderRadius: "12px",
          color: "white",
          maxWidth: "700px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(3px)",
        }}>
          <h3>{t("feature_1")}</h3>
          <p>
            {t("feature_1_desc")}</p>
          <button className="carousel-btn" onClick={() => navigate("/login")}>
           {t("feature_2")}
          </button>
        </div>
      ),
    },
    {
      image: "https://wallpaperaccess.com/full/3543885.jpg",
      content: (
        <div className="carousel-content" style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "2rem",
          borderRadius: "12px",
          color: "white",
          maxWidth: "700px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(3px)",
        }}>
          <h3>{t("feature_3")}</h3>
          <p>
            {t("feature_3_desc")}
          </p>
        </div>
      ),
    },
    {
      image: "https://wallpaperbat.com/img/319677-agriculture-desktop-wallpaper.jpg",
      content: (
        <div className="carousel-content" style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: "2rem",
          borderRadius: "12px",
          color: "white",
          maxWidth: "700px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(3px)",
        }}>
          <h3>{t("feature_4")}</h3>
          <p>
            {t("feature_4_desc")} </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, 4000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  return (
    <div id="carouselExampleControls" className="carousel slide" >
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
            key={index}
          >
            <img
              className="d-block w-100 carousel-img"
              src={slide.image}
              alt={`Slide ${index + 1}`}
              style={{ height: "90vh", objectFit: "cover" }}
            />
            <div className="carousel-caption d-flex justify-content-center align-items-center">
              {slide.content}
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" />
        <span className="visually-hidden">{t("Previous")}</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" />
        <span className="visually-hidden">{t("Next")}</span>
      </button>
    </div>
  );
};

export default Carousel;