import React from "react";
import "../styles/DiseasesPage.css";
import { useTranslation } from "react-i18next";

const diseases = [
  {
    id: 1,
    name: "disease1_namet",
    image: "arecanut-disease-detection/client/Picture4.png",
    description: "disease1_desc",
    treatment: "disease1_treatment"
  },
  {
    id: 2,
    name: "disease2_name",
    image: "arecanut-disease-detection/client/images (2).jfif",
    description: "disease2_desc",
    treatment: "disease2_treatment"
  },
  {
    id: 3,
    name: "disease3_name",
    image: "arecanut-disease-detection/client/Picture2.png",
    description: "disease3_desc",
    treatment: "disease3_treatment"
  },
  {
    id: 4,
    name: "disease4_name",
    image: "arecanut-disease-detection/client/Picture3.png",
    description: "disease4_desc",
    treatment: "disease4_treatment"
  }
];

function DiseasesPage() {
  const { t } = useTranslation()
  return (
    <div className="diseases-container">
      <h2>{t("common_diseases")}</h2>
      <div className="disease-grid">
        {diseases.map((disease) => (
          <div key={disease.id} className="disease-card">
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

export default DiseasesPage;