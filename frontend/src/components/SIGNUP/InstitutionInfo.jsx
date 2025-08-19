import React from "react";

// props로 상태/세터를 받아 제어 컴포넌트로 사용
const InstitutionInfo = ({
  insName, setInsName,
  insType, setInsType,
  insAddress, setInsAddress,
}) => {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>기관 정보</h3>

      <div style={styles.row}>
        <label style={styles.label}>기관명</label>
        <input
          style={styles.input}
          placeholder="기관명을 입력해주세요"
          value={insName}
          onChange={(e) => setInsName(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>기관 유형</label>
        <input
          style={styles.input}
          placeholder="유형을 입력해주세요 (예: 교육기관)"
          value={insType}
          onChange={(e) => setInsType(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>기관 주소</label>
        <input
          style={styles.input}
          placeholder="주소를 입력해주세요"
          value={insAddress}
          onChange={(e) => setInsAddress(e.target.value)}
        />
      </div>
    </div>
  );
};

const styles = {
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, marginBottom: 20 },
  row: {
    display: "flex",
    marginBottom: 16,
    alignItems: "center",
  },
  label: {
    width: 140,
    backgroundColor: "#f3f3f3",
    padding: 12,
    border: "1px solid #ccc",
    fontWeight: "bold",
    fontSize: 14,
  },
  input: {
    flex: 1,
    padding: 12,
    border: "1px solid #ccc",
    borderLeft: "none",
    fontSize: 14,
  },
};

export default InstitutionInfo;
