import React, { useState } from "react";

export default function ReportsDownload({
  onDownload,              // (format, scope, yearRange, orgId, buildingId) => void
}) {
  const [scope, setScope] = useState("TOTAL");        // TOTAL | SCOPE1 | SCOPE2
  const [yearRange, setYearRange] = useState({ from: 2022, to: 2025 });
  const [orgId, setOrgId] = useState(null);
  const [buildingId, setBuildingId] = useState(null);

  const call = (fmt) => onDownload?.(fmt, scope, yearRange, orgId, buildingId);

  return (
    <div style={sx.page}>
      <header style={sx.header}>
        <div>
          <h1 style={sx.title}>전체 리포트 다운로드</h1>
          <p style={sx.subtitle}>필터를 선택하고 형식을 골라 내려받으세요.</p>
        </div>
      </header>

      {/* 간단 필터 (원하면 셀렉트 컴포넌트로 교체) */}
      <div style={sx.filters}>
        <div style={sx.filterItem}>
          <label style={sx.label}>스코프</label>
          <select value={scope} onChange={(e)=>setScope(e.target.value)} style={sx.select}>
            <option value="TOTAL">Total</option>
            <option value="SCOPE1">Scope 1</option>
            <option value="SCOPE2">Scope 2</option>
          </select>
        </div>

        <div style={sx.filterItem}>
          <label style={sx.label}>연도(From)</label>
          <input type="number" value={yearRange.from}
            onChange={(e)=>setYearRange(v=>({...v, from:Number(e.target.value)||v.from}))}
            style={sx.input}/>
        </div>
        <div style={sx.filterItem}>
          <label style={sx.label}>연도(To)</label>
          <input type="number" value={yearRange.to}
            onChange={(e)=>setYearRange(v=>({...v, to:Number(e.target.value)||v.to}))}
            style={sx.input}/>
        </div>

        <div style={sx.filterItem}>
          <label style={sx.label}>기관</label>
          <input placeholder="ORG ID" value={orgId || ""} onChange={(e)=>setOrgId(e.target.value||null)} style={sx.input}/>
        </div>
        <div style={sx.filterItem}>
          <label style={sx.label}>건물</label>
          <input placeholder="BUILDING ID" value={buildingId || ""} onChange={(e)=>setBuildingId(e.target.value||null)} style={sx.input}/>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <div style={sx.buttons}>
        <button style={sx.btn} onClick={()=>call("csv")}>CSV</button>
        <button style={sx.btn} onClick={()=>call("xlsx")}>XLSX</button>
        <button style={sx.btn} onClick={()=>call("pdf")}>PDF</button>
      </div>

      <div style={sx.note}>
        * 실제 다운로드 로직은 onDownload에서 API 호출 또는 클라이언트 생성으로 구현하세요.
      </div>
    </div>
  );
}

const sx = {
  page: { padding: 20, display: "flex", flexDirection: "column", gap: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
  title: { margin: 0, fontSize: 22, fontWeight: 700 },
  subtitle: { marginTop: 4, color: "#667085", fontSize: 13 },

  filters: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12 },
  filterItem: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#333" },
  select: { height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px" },
  input: { height: 36, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 10px" },

  buttons: { display: "flex", gap: 8 },
  btn: { height: 36, padding: "0 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer" },

  note: { color: "#64748b", fontSize: 12 },
};
