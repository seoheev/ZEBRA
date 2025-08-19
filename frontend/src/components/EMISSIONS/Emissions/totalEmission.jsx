import React, { useMemo } from "react";
import GaugeSemi from "./details/gaugeSemi";
import main4 from "../../../assets/main4.png";

export default function TotalEmission({
  scope1Emission = 0,
  scope2Emission = 0,
}) {
  const totalEmission = useMemo(
    () => scope1Emission + scope2Emission,
    [scope1Emission, scope2Emission]
  );

  return (
    <div style={row}>
      {/* 현재 평균 탄소 배출량 */}
      <div style={card}>
        <p style={label}>현재 평균 탄소 배출량</p>
        <h2 style={value}>{totalEmission.toLocaleString()}</h2>
        <p style={sub}>▲ 0.6% 지난 년 대비</p>
      </div>
{/* 감축 목표 이행률 */}
<div style={card}>
  <p style={label}>감축 목표 이행률</p>

  {/* 게이지(좌) + 상태텍스트(우) */}
  <div style={gaugeRow}>
    {/* 좌: 반원 게이지 */}
    <div style={{ flex: "0 0 160px" }}>
      <GaugeSemi value={68} size={260} stroke={18} />
    </div>

    {/* 우: 상태/보조문구 */}
    <div style={rightCol}>
      <div style={statusText}>위험 등급입니다</div>
      <div style={deltaText}>▲ 0.6% 지난 년 대비</div>
    </div>
  </div>
</div>

      {/* 대안 추천 챗봇 */}
<div style={card}>
  <p style={label}>대안 추천 챗봇 바로가기</p>

  <div style={chatbotRow}>
    {/* 왼쪽: 버튼 */}
    <button
      style={chatBtn}
      onClick={() => window.open("/chatbot", "_blank")} // 내부 라우터면 navigate("/chatbot")
    >
      ZEBRA
    </button>

    {/* 오른쪽: 이미지 */}
    <img
      src={main4}
      alt="Zebra chatbot"
      style={chatImg}
    />
  </div>
</div>
</div>
  );
}

const chatbotRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 12,
  gap: 16,
};

const chatImg = {
  width: 130,    
  height: "auto",
  objectFit: "contain",
};

const gaugeRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  marginTop: 6,
};

const rightCol = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  minWidth: 140,
  gap: 8,
};

const statusText = {
  fontSize: 20,
  fontWeight: 800,
  color: "#111827", // 거의 검정
  lineHeight: 1.1,
};

const deltaText = {
  fontSize: 13,
  color: "#059669", // 초록
  fontWeight: 600,
};

const row = {
  display: "flex",
  gap: 16,
  marginBottom: 24,
};

const card = {
  flex: 1,
  background: "#fff",
  borderRadius: 12,
  padding: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const label = { fontSize: 14, color: "#555", margin: 0, marginBottom: 8 };
const value = { margin: 0, fontSize: 28, fontWeight: 800 };
const sub = { marginTop: 6, fontSize: 12, color: "#4caf50" };

const chatBtn = {
  marginTop: 12,
  padding: "10px 18px",
  fontSize: 16,
  fontWeight: 700,
  color: "#14532d",
  background: "#fff",
  border: "1.5px solid #14532d",
  borderRadius: 8,
  cursor: "pointer",
};
