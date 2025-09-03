export const HEADER_H = 150;   // 실제 헤더 높이에 맞춰 조정
export const TOP_SAFE = 12;   // 살짝 여유

export const layout = {
  container: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    minHeight: "100vh",
    background: "#f7f7f8",
  },
  main: {
    padding: 20,
    paddingTop: HEADER_H + TOP_SAFE, // ← 헤더 높이만큼 본문을 아래로 밀기
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
};
  
  export const header = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  };
  export const title = { margin: 0, fontSize: 22, fontWeight: 700 };
  export const subtitle = { marginTop: 4, color: "#667085", fontSize: 13 };
  
  export const tabsWrap = { display: "flex", gap: 8, paddingBottom: 8 };
  export const tabBtn = {
    padding: "8px 14px",
    borderRadius: 999,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    fontSize: 13,
    cursor: "pointer",
  };
  export const tabBtnActive = {
    background: "#14532d",
    color: "#fff",
    borderColor: "#14532d",
  };
  
  export const contentCard = {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 16,
    minHeight: 320,
  };
  