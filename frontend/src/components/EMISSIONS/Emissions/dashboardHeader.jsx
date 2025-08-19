// DashboardHeader.jsx
import React, { useEffect, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { FiShare2, FiSave } from "react-icons/fi";
import { header, title } from "./emission.styles";

// 아이콘 파일 정확한 경로로 가져오기 (예: src/assets/logo.png)
import appLogo from "../../../assets/logo.png"; // 경로는 프로젝트에 맞게 조정

export default function DashboardHeader({
  initialOrgName,
  buildingOptions = [],
  onSelectBuilding,
  onSave, onShare, onExportPdf,
}) {
  const [orgName, setOrgName] = useState(initialOrgName || "");
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (initialOrgName) return;
    try {
      const raw = localStorage.getItem("userData");
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.orgName) setOrgName(parsed.orgName);
    } catch {}
  }, [initialOrgName]);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onSelectBuilding?.(e.target.value);
  };

  return (
    <header
      style={{
        ...header,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "12px 20px",
        borderBottom: "1px solid #E5E7EB",
        background: "#fff",
      }}
    >
      {/* 좌측: 제목 + 기관명 & 드롭다운 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* 제목 라인 (아이콘 + 타이틀) */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={appLogo}
            alt=""                   // 장식용이면 alt 비우기 → 텍스트 노출 방지
            style={{
              width: 28,
              height: 28,
              objectFit: "contain",
              display: "block",
            }}
            onError={(e) => { e.currentTarget.style.display = "none"; }} // 경로 오류 시 숨김
          />
          <h1 style={{ ...title, fontSize: 18, margin: 0 }}>
            공공건축물 탄소 절감을 위한 대시보드
          </h1>
        </div>

        {/* 기관명(텍스트만) + 드롭다운 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* ✅ 텍스트만 보이도록 스타일 변경 */}
          <span style={orgText}>
            {orgName || "동국대학교"}
          </span>

          <select
            aria-label="그래프를 보고 싶은 건물 선택"
            value={selected}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="" disabled>
              그래프를 보고 싶은 건물 선택
            </option>
            {buildingOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 우측 버튼들 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={buttonStyle} onClick={onSave}>
          <FiSave style={{ marginRight: 6 }} /> 결과 저장
        </button>
        <button style={buttonStyle} onClick={onShare}>
          <FiShare2 style={{ marginRight: 6 }} /> 공유하기
        </button>
        <button style={buttonStyle} onClick={onExportPdf}>
          <FaRegFilePdf style={{ marginRight: 6 }} /> PDF 출력
        </button>
      </div>
    </header>
  );
}

const orgText = {
  fontSize: 18,        // 🔺 글자 키움
  fontWeight: 700,
  color: "#14532d",
  lineHeight: 1,
  // 배경/테두리 없음 → 텍스트만
};

const selectStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #D1D5DB",
  fontSize: 16,
  width: 360,
  background: "#fff",
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "8px 14px",
  fontSize: 14,
  border: "1px solid #D1D5DB",
  borderRadius: 10,
  backgroundColor: "#fff",
  cursor: "pointer",
};
