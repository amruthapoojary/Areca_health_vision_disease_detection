import React, { useState, useEffect } from "react";
import "../styles/ScanPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar,
  LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ScanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [part, setPart] = useState("");
  const [partConfidence, setPartConfidence] = useState(null);
  const [partProbs, setPartProbs] = useState([]);
  const [conditionProbs, setConditionProbs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // new additions
  const [features, setFeatures] = useState([]);
  const [diseaseRisk, setDiseaseRisk] = useState(null);
  const [partConfidences, setPartConfidences] = useState({});

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction("");
    setConfidence(null);
    setPart("");
    setPartConfidence(null);
    setPartProbs([]);
    setConditionProbs([]);
    setFeatures([]);
    setDiseaseRisk(null);
    setPartConfidences({});
    setError("");
  };

  const handleDetectClick = async () => {
    if (!selectedFile) {
      alert(t("Please select an image first."));
      return;
    }
    setLoading(true);
    setError("");
    setPrediction("");
    setConfidence(null);
    setPart("");
    setPartProbs([]);
    setConditionProbs([]);
    setFeatures([]);
    setDiseaseRisk(null);
    setPartConfidences({});

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const resp = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error("Server error:", text);
        setError(t("Server error: Could not process the image."));
        setLoading(false);
        return;
      }

      const data = await resp.json();

      if (data && data.prediction) {
        setPrediction(data.prediction);
        setConfidence(data.confidence ?? null);
        setPart(data.part ?? "");
        setPartConfidence(data.part_confidence ?? null);
        setPartProbs(data.part_probs ?? []);
        setConditionProbs(data.condition_probs ?? []);
        setFeatures(data.feature_importance ?? []);
        setDiseaseRisk(data.diseaseRisk ?? null);
        setPartConfidences(data.part_confidences ?? {});
      } else {
        setError(t("Prediction failed. No result returned."));
      }
    } catch (err) {
      console.error(err);
      setError(t("Could not connect to the Flask server."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prediction || prediction === "not_areca") return;

    fetch("http://localhost:5001/recommendation_audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ condition: prediction }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      })
      .catch((err) => console.error("TTS error:", err));
  }, [prediction]);

  // Prepare chart data
  const barData = conditionProbs.map((item) => ({
    name: item.label,
    confidencePct: Math.round(item.prob * 10000) / 100,
  }));

  const pieData = [
    { name: "Leaf Model", value: part === "Leaf" ? 1 : 0 },
    { name: "Fruit Model", value: part === "Fruit" ? 1 : 0 },
    { name: "Trunk Model", value: part === "Trunk" ? 1 : 0 },
    { name: "Not Areca", value: part === "not_areca" ? 1 : 0 },
  ];

  const gaugeData = [
    { name: "Confidence", value: confidence ? Math.round(confidence * 100) : 0 },
  ];

  // Feature Importance Horizontal Bar
  const featureBarData = features.map((f) => ({
    name: f.feature,
    value: Math.round(f.weight * 100) / 100,
  }));

  // Disease Risk Gauge
  const riskGaugeData = [
    {
      name: "Risk",
      value: diseaseRisk ? Math.round(diseaseRisk * 10000) / 100 : 0,
    },
  ];

  // Feature Confidence (Radar)
  const radarData = [
    { name: "Leaf", value: Math.round((partConfidences["Leaf"] ?? 0) * 100) },
    { name: "Fruit", value: Math.round((partConfidences["Fruit"] ?? 0) * 100) },
    { name: "Trunk", value: Math.round((partConfidences["Trunk"] ?? 0) * 100) },
    { name: "Areca", value: Math.round((partConfidences["Areca"] ?? 0) * 100) },
  ];

  // Line Chart (reuse condition probs)
  const lineData = conditionProbs.map((item) => ({
    name: item.label,
    confidencePct: Math.round(item.prob * 10000) / 100,
  }));

  const getResultMessage = () => {
    if (prediction === "not_areca") return t("This is not an arecanut image");
    const map = {
      diseased_stem: t("Diseased Stem Detected"),
      healthy_stem: t("Stem is Healthy"),
      diseased_fruit: t("Diseased Fruit Detected"),
      healthy_fruit: t("Fruit is Healthy"),
      diseased_leaf: t("Diseased Leaf Detected"),
      healthy_leaf: t("Leaf is Healthy"),
    };
    return map[prediction] || "";
  };

  const isDiseased = [
    "diseased_stem",
    "diseased_fruit",
    "diseased_leaf",
  ].includes(prediction);

  return (
    <div className="scan-page">
      <button className="logout-btn" onClick={() => navigate("/login")}>
        {t("Logout")}
      </button>

      <div className="scan-container">
        <h2>{t("Scan Arecanut Image")}</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button onClick={handleDetectClick} disabled={loading}>
          {loading ? t("Detecting") : t("Detect Disease")}
        </button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

        {prediction && (
          <div style={{ marginTop: 16 }}>
            <h3
              style={{
                color:
                  prediction === "not_areca"
                    ? "orange"
                    : isDiseased
                      ? "red"
                      : "green",
              }}
            >
              {getResultMessage()}
            </h3>
            <p>
              Part: {part}{" "}
              {partConfidence ? `(${(partConfidence * 100).toFixed(2)}%)` : ""}
            </p>
          </div>
        )}

        {prediction && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 20,
            }}
          >


            {/* Model Confidence (Part Classification) */}
            <div className="chart-card">
              <h4>{t("Part Detection Confidence")}</h4>
              {partProbs.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={partProbs.map((p) => ({
                      name: p.label,
                      confidence: Math.round(p.prob * 10000) / 100,
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip
                      formatter={(value) => `${value.toFixed(2)}%`}
                      labelFormatter={(label) => `Model: ${label}`}
                    />
                    <Bar dataKey="confidence" fill="#0088FE">
                      {partProbs.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>{t("No model confidence data available")}</p>
              )}
            </div>
            {/* Show graphs only if it’s an Areca image */}
{prediction !== "not_areca" && (
  <>
    {/* Confidence Overview Graph */}
    <div className="chart-card">
      <h4>{t("Condition Confidence Overview")}</h4>
      {lineData.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          {lineData.map((item, idx) => {
            const isDisease = item.healthStatus === "Disease";
            const circleColor = isDisease ? "#E53935" : "#43A047"; // red for disease, green for healthy

            return (
              <div key={idx} style={{ textAlign: "center", margin: "10px" }}>
                <ResponsiveContainer width={100} height={100}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="75%"
                    outerRadius="100%"
                    barSize={10}
                    data={[{ name: item.name, value: item.confidencePct }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      fill={circleColor}
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="14"
                      fontWeight="bold"
                      fill={circleColor}
                    >
                      {`${item.confidencePct}%`}
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
                <p style={{ fontWeight: "bold", color: isDisease ? "#E53935" : "#43A047" }}>
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>{t("No confidence data available")}</p>
      )}
    </div>

    {/* Feature Importance Graph */}
    <div className="chart-card">
      <h4>{t("Feature Importance")}</h4>
      {featureBarData.length > 0 ? (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            layout="vertical"
            data={featureBarData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>{t("No feature data available")}</p>
      )}
    </div>
  </>
)}






            {/* Final Confidence Gauge */}
            <div className="chart-card">
              <h4>{t("Final Confidence")}</h4>
              <ResponsiveContainer width="100%" height={150}>
                <RadialBarChart
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="100%"
                  data={gaugeData}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ textAlign: "center", marginTop: -8 }}>
                <strong>
                  {confidence ? `${(confidence * 100).toFixed(2)}%` : "0%"}
                </strong>
              </div>
            </div>
          </div>
        )}

        {isDiseased && (
          <button
            onClick={() =>
              navigate(
                prediction === "diseased_stem"
                  ? "/stem-bleeding-recommendation"
                  : prediction === "diseased_fruit"
                    ? "/fruit-rot-recommendation"
                    : "/yellow-leaf-recommendation"
              )
            }
            style={{
              marginTop: 16,
              padding: "0.6rem 1.2rem",
              backgroundColor: "#28a745",
              color: "white",
              borderRadius: 8,
            }}
          >
            {t("Show Recommendation")}
          </button>
        )}
      </div>
    </div>
  );
}

export default ScanPage;
