import React, { useState, useEffect } from "react";
import "../styles/ScanPage.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  RadialBarChart, RadialBar, LineChart, Line
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
  const [stage, setStage] = useState("");
  const [stageConfidence, setStageConfidence] = useState(null);
  const [stageProbs, setStageProbs] = useState([]);
  const [diseaseLabel, setDiseaseLabel] = useState("");
  const [diseaseConfidence, setDiseaseConfidence] = useState(null);
  const [diseaseProbs, setDiseaseProbs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [diseaseRisk, setDiseaseRisk] = useState(null);
  const [partConfidences, setPartConfidences] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const diseaseKeyMap = {
  "Fruit_rot": "fruit_rot",
  "Healthy_Fruit": "healthy_fruit",
  "Yellow_leaf_disease": "yellow_leaf_disease",
  "Stem_bleeding": "stem_bleeding",
};

// Now safe to use
const diseaseKey = diseaseKeyMap[diseaseLabel] || diseaseLabel.toLowerCase().replace(" ", "_");
const recommendationDiseases = ["fruit_rot", "yellow_leaf_disease", "stem_bleeding"];
  const diseaseLabelNormalized = diseaseLabel ? diseaseLabel.toLowerCase().replace(" ", "_") : "";
let stageKeyNormalized = stage ? stage.toLowerCase() : "early";
if (stageKeyNormalized.includes("early")) stageKeyNormalized = "early";
else if (stageKeyNormalized.includes("moder")) stageKeyNormalized = "moderate";
else if (stageKeyNormalized.includes("crit")) stageKeyNormalized = "critical";
else if (stageKeyNormalized.includes("healthy")) stageKeyNormalized = "healthy";
const diseaseLabelBase = diseaseLabelNormalized
  .replace(/^early_/, "")
  .replace(/^moderate_/, "")
  .replace(/^critical_/, "")
  .replace(/^healthy_/, "");





  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction("");
    setConfidence(null);
    setPart("");
    setPartConfidence(null);
    setPartProbs([]);
    setConditionProbs([]);
    setStage("");
    setStageConfidence(null);
    setStageProbs([]);
    setDiseaseLabel("");
    setDiseaseConfidence(null);
    setDiseaseProbs([]);
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
    setPartConfidence(null);
    setPartProbs([]);
    setConditionProbs([]);
    setStage("");
    setStageConfidence(null);
    setStageProbs([]);
    setDiseaseLabel("");
    setDiseaseConfidence(null);
    setDiseaseProbs([]);
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

      if (data && data.status === "success") {
        setPrediction(data.part || "");
        setConfidence(data.part_confidence ?? null);
        setPart(data.part || "");
        setPartConfidence(data.part_confidence ?? null);
        setPartProbs(data.part_probs ?? []);
        setConditionProbs(data.disease_probs ?? []);
        setStage(data.stage_label ?? "");
        setStageConfidence(data.stage_confidence ?? null);
        setStageProbs(data.stage_probs ?? []);
        setDiseaseLabel(data.disease_label ?? "");
        setDiseaseConfidence(data.disease_confidence ?? null);
        setDiseaseProbs(data.disease_probs ?? []);
        setFeatures(data.feature_importance ?? []);
        setDiseaseRisk(data.disease_risk ?? null);
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
  if (!prediction || !stage) return;

  fetch("http://localhost:5001/prediction_audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      disease: prediction,
      stage: stage
    })
  })
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    })
    .catch(err => console.error("Audio error:", err));
}, [prediction, stage]);


  const barData = conditionProbs.map((item) => ({
    name: item.label,
    confidencePct: Math.round(item.prob * 10000) / 100,
  }));

  const featureBarData = features.map((f) => ({
    name: f.feature,
    value: Math.round(f.weight * 100) / 100,
  }));

  const radarData = [
    { name: "Leaf", value: Math.round((partConfidences["Leaf"] ?? 0) * 100) },
    { name: "Fruit", value: Math.round((partConfidences["Fruit"] ?? 0) * 100) },
    { name: "Trunk", value: Math.round((partConfidences["Trunk"] ?? 0) * 100) },
    { name: "Areca", value: Math.round((partConfidences["Areca"] ?? 0) * 100) },
  ];

  const gaugeData = [
    { name: "Confidence", value: confidence ? Math.round(confidence * 100) : 0 },
  ];

  const riskGaugeData = [
    { name: "Risk", value: diseaseRisk ? Math.round(diseaseRisk * 10000) / 100 : 0 },
  ];

  const isDiseased = ["diseased_stem", "diseased_fruit", "diseased_leaf"].includes(diseaseLabel);

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
    return map[diseaseLabel] || "";
  };

  return (<div className="scan-page">
    <button className="logout-btn" onClick={() => navigate("/login")}>
      {t("Logout")} </button>


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
              color: prediction === "not_areca" ? "orange" : isDiseased ? "red" : "green",
            }}
          >
            {getResultMessage()}
          </h3>
          <p>
            Part: {part} {partConfidence ? `(${(partConfidence * 100).toFixed(2)}%)` : ""}
          </p>
          {stage && (
            <p>
              Stage: {stage} {stageConfidence ? `(${(stageConfidence * 100).toFixed(2)}%)` : ""}
            </p>
          )}
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
          {/* Part Confidence Chart */}
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
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} labelFormatter={(label) => `Model: ${label}`} />
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

          {/* Condition / Stage Charts */}
          {prediction !== "not_areca" && (
            <>
              <div className="chart-card">
                <h4>{t("Condition Confidence Overview")}</h4>
                {conditionProbs.length > 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
                    {conditionProbs.map((item, idx) => {
                      // --- Step 1: Temporary label for display ---
                      let displayLabel = item.label;
                     
                      const isDisease = ["diseased_stem", "diseased_fruit", "diseased_leaf"].includes(item.label);
                      const circleColor = isDisease ? "#E53935" : "#43A047";

                      return (
                        <div key={idx} style={{ textAlign: "center", margin: "10px" }}>
                          <ResponsiveContainer width={100} height={100}>
                            <RadialBarChart
                              cx="50%"
                              cy="50%"
                              innerRadius="75%"
                              outerRadius="100%"
                              barSize={10}
                              data={[{ name: displayLabel, value: Math.round(item.prob * 100) }]} // <-- use displayLabel
                              startAngle={90}
                              endAngle={-270}
                            >
                              <RadialBar minAngle={15} background clockWise dataKey="value" fill={circleColor} />
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill={circleColor}
                              >
                                {`${Math.round(item.prob * 100)}%`}
                              </text>
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <p style={{ fontWeight: "bold", color: circleColor }}>{displayLabel}</p> {/* <-- use displayLabel */}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>{t("No confidence data available")}</p>
                )}
              </div>


              {/* Feature Importance */}
              <div className="chart-card">
                <h4>{t("Feature Importance")}</h4>
                {featureBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart layout="vertical" data={featureBarData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
              <RadialBarChart startAngle={180} endAngle={0} innerRadius="60%" outerRadius="100%" data={gaugeData}>
                <RadialBar minAngle={15} background clockWise dataKey="value" />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", marginTop: -8 }}>
              <strong>{confidence ? `${(confidence * 100).toFixed(2)}%` : "0%"}</strong>
            </div>
          </div>
        </div>
      )}


    

{prediction !== "not_areca" &&
 recommendationDiseases.includes(diseaseKey) && (
   <button
     onClick={() => {
       const routeMap = {
         fruit_rot: {
           early: "/early-fruit-rot",
           moderate: "/moderate-fruit-rot",
           critical: "/critical-fruit-rot"
         },
         yellow_leaf_disease: {
           early: "/early-yellow-leaf",
           moderate: "/moderate-yellow-leaf",
           critical: "/critical-yellow-leaf"
         },
         stem_bleeding: {
           early: "/early-stem-bleeding",
           moderate: "/moderate-stem-bleeding",
           critical: "/critical-stem-bleeding"
         }
       };

       const path = routeMap[diseaseKey][stageKeyNormalized];
       if (path) navigate(path);
       else console.error("No route found for disease/stage", diseaseKey, stageKeyNormalized);
     }}
     style={{
       marginTop: 16,
       padding: "0.6rem 1.2rem",
       backgroundColor: "#28a745",
       color: "white",
       borderRadius: 8,
       fontSize: "16px",
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
