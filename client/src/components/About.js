import React from 'react';
import "../styles/App.css";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>{t("about_title")}</h1>
        
      </header>

      <section className="about-content">
        <div className="about-description">
          <h2>{t("about_topic")}</h2>
          <p style={{ textAlign: "justify" }}>{t("about_description")} </p>
        </div>
        <div className="about-image">
          <img
            src="https://media.istockphoto.com/id/1183803820/photo/group-of-school-children-with-teacher-on-field-trip-in-nature-learning-science.jpg?s=612x612&w=0&k=20&c=bVUAikVLGkCoJ21g7WTlN1wD6etDwDBcp5LX_Rq7UOI="
            alt="Arecanut Field"
          />
        </div>
      </section>

      <section className="about-creative-features">
        <h2>{t("features_title")}</h2>
        <div className="feature-item">
          <i className="fas fa-microscope"></i>
          <h3>{t("feature_1")}</h3>
          <p>{t("feature_1_desc")}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-notes-medical"></i>
          <h3>{t("feature_2")}</h3>
          <p>{t("feature_2_desc")}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-eye"></i>
          <h3>{t("feature_3")} </h3>
          <p>{t("feature_3_desc")}</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-database"></i>
          <h3>{t("feature_4")}</h3>
          <p>{t("feature_4_desc")}</p>
        </div>
      </section>
    </div>
  );
};

export default About;