import React, { useState, useEffect } from "react";
import '../styles/ScanPage.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // ✅ Added for translation

function ScanPage() {
  const { t } = useTranslation(); // ✅ translation hook
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [diseaseType, setDiseaseType] = useState('stem_bleeding'); // default
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction('');
    setError('');
  };

  const handleDetectClick = async () => {
    if (!selectedFile) {
      alert(t("Please select an image first."));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("disease_type", diseaseType);

    try {
      setLoading(true);
      setError('');
      setPrediction('');

      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Flask error:", errorText);
        setError(t("Server error: Could not process the image."));
        return;
      }

      const data = await response.json();

      if (data.prediction) {
        setPrediction(data.prediction);
      } else {
        setError(t("Prediction failed. No prediction returned."));
      }
    } catch (err) {
      console.error("Error during prediction:", err);
      setError(t("Could not connect to the Flask server."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // Decide result message
  const getResultMessage = () => {
    if (diseaseType === "stem_bleeding") {
      if (prediction === "diseased_stem") return t("Diseased Stem Detected");
      if (prediction === "healthy_stem") return t("Stem is Healthy");
    } else if (diseaseType === "fruit_rot") {
      if (prediction === "diseased_fruit") return t("Diseased Fruit Detected");
      if (prediction === "healthy_fruit") return t("Fruit is Healthy");
    } else if (diseaseType === "yellow_leaf") {
      if (prediction === "diseased_leaf") return t("Diseased Leaf Detected");
      if (prediction === "healthy_leaf") return t("Leaf is Healthy");
    }
    return "";
  };

  // Decide if diseased → show recommendation button
  const isDiseased =
    prediction === "diseased_stem" ||
    prediction === "diseased_fruit" ||
    prediction === "diseased_leaf";

  // -----------------------------
  // Auto-play audio for detected disease
  // -----------------------------
  useEffect(() => {
    if (!prediction) return;

    // Fetch TTS audio from backend
    fetch("http://localhost:5001/recommendation_audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ Send full prediction key
      body: JSON.stringify({ disease_type: prediction })
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      })
      .catch(err => console.error("Error playing audio:", err));
  }, [prediction]);

  return (
    <>
      <button className="logout-btn" onClick={handleLogout}>
        {t("Logout")}
      </button>

      <div className="scan-container">
        <h2>{t("Scan Arecanut Image")}</h2>

        <label style={{ marginBottom: "0.5rem", display: "block" }}>
          {t("Select Disease Type:")}
        </label>
        <select
          value={diseaseType}
          onChange={(e) => setDiseaseType(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px", marginBottom: "1rem" }}
        >
          <option value="stem_bleeding">{t("Stem")}</option>
          <option value="fruit_rot">{t("Fruit")}</option>
          <option value="yellow_leaf">{t("Leaf")}</option>
        </select>

        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleDetectClick} disabled={loading}>
          {loading ? t("Detecting") : t("Detect Disease")}
        </button>

        {prediction && (
          <h3 style={{ marginTop: "1.5rem", color: isDiseased ? "red" : "green" }}>
            {getResultMessage()}
          </h3>
        )}

        {isDiseased && (
          <button
            onClick={() =>
              navigate(
                diseaseType === "stem_bleeding"
                  ? "/stem-bleeding-recommendation"
                  : diseaseType === "fruit_rot"
                  ? "/fruit-rot-recommendation"
                  : "/yellow-leaf-recommendation"
              )
            }
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.5rem",
              fontSize: "1.1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            {t("Show Recommendation")}
          </button>
        )}

        {error && <p style={{ color: "red", marginTop: "1rem" }}>⚠ {error}</p>}
      </div>
    </>
  );
}

export default ScanPage;