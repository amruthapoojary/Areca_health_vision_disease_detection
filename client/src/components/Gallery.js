import React from "react";
import "../styles/Gallery.css";
import { useTranslation } from "react-i18next";

const diseases = [
  {
    id: 1,
    nameKey: "disease1_name",
    image: "/Picture4.png",
    descriptionKey: "disease1_desc",
    treatmentKey: "disease1_treatment"
  },
  {
    id: 2,
    nameKey: "disease2_name",
    image: "/Picture2.png",
    descriptionKey: "disease2_desc",
    treatmentKey: "disease2_treatment"
  },
  {
    id: 3,
    nameKey: "disease3_name",
    image: "/Picture3.png",
    descriptionKey: "disease3_desc",
    treatmentKey: "disease3_treatment"
  }
];

function Gallery() {
  const { t } = useTranslation();

  return (
    <div className="gallery-container">
      <h2>{t("gallery_title")}</h2>
      <div className="gallery-grid">
        {diseases.map((disease) => (
          <div key={disease.id} className="gallery-card">
            <img src={disease.image} alt={t(disease.nameKey)} />
            <h3>{t(disease.nameKey)}</h3>
            <p>{t(disease.descriptionKey)}</p>
            <strong>{t("Treatment")}: {t(disease.treatmentKey)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;