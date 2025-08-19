import React, { useEffect, useState } from "react";

/** Scope2Emission — 스코프2 전용 탭 (구매전력/열 등 간접배출) */
export default function Scope2Emission({ fetchEmissions, onExport, permissions }) {
  const [filters, setFilters] = useState({
    scope: "SCOPE2",
    orgId: null,
    buildingId: null,
    yearRange: { from: 2022, to: 2025 },
    granularity: "YEARLY",
    unit: "tCO2e",
  });

  const [query, setQuery] = useState({ page: 1, pageSize: 20, sortBy: "year", sortDir: "desc", search: "" });
  const [data, setData] = useState({ items: [], total: 0, summary: { totalEmissions: 0 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (typeof fetchEmissions !== "function") return;
      setLoading(true); setError("");
      try {
        const res = await fetchEmissions(filters, query);
        if (!ignore) setData({ items: res?.items ?? [], total: res?.total ?? 0, summary: res?.summary ?? data.summary });
      } catch (e) {
        if (!ignore) setError(e?.message || "불러오기 실패");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load(); return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, query.page, query.pageSize, query.sortBy, query.sortDir, query.search]);

  const handleExport = (fmt) => permissions?.canExport && onExport?.(filters, fmt);

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <div style={styles.titleArea}>
          <h3 style={styles.title}>Scope 2 배출량</h3>
          <div style={styles.sub}>구매 전력/열 등 간접배출</div>
        </div>
        {permissions?.canExport && (
          <div style={styles.exportGroup}>
            <button style={styles.button} onClick={() => handleExport("csv")}>CSV</button>
            <button style={styles.button} onClick={() => handleExport("xlsx")}>XLSX</button>
          </div>
        )}
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHeader}><h4 style={styles.panelTitle}>추이 차트</h4></div>
        <div style={styles.placeholder}>여기에 Scope2 차트</div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHeader}><h4 style={styles.panelTitle}>상세 내역</h4></div>
        {error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : loading ? (
          <div style={styles.empty}>불러오는 중…</div>
        ) : (data.items?.length ?? 0) > 0 ? (
          <div style={styles.placeholder}>여기에 Scope2 테이블</div>
        ) : (
          <div style={styles.empty}>데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", gap: 12 },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  titleArea: { display: "flex", flexDirection: "column" },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  sub: { fontSize: 12, color: "#667085", marginTop: 4 },

  exportGroup: { display: "flex", gap: 8 },
  button: { height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" },

  panel: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16 },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  panelTitle: { margin: 0, fontSize: 15, fontWeight: 700 },

  placeholder: {
    height: 220, border: "1px dashed #cbd5e1", borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#64748b", background: "#fafafa",
  },
  empty: { padding: 24, color: "#64748b" },
  errorBox: { padding: 16, color: "#b91c1c", background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8 },
};
