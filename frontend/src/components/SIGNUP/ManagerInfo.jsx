import React from "react";

const ManagerInfo = ({
  managerName, setManagerName,
  department, setDepartment,
  email, setEmail,
  phone0, setPhone0,
  phone1, setPhone1,
  phone2, setPhone2,
  userId, setUserId,
  password, setPassword,
}) => {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>담당자 정보</h3>

      <div style={styles.row}>
        <label style={styles.label}>담당자 이름</label>
        <input
          style={styles.input}
          placeholder="이름을 입력해주세요"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>소속 부서</label>
        <input
          style={styles.input}
          placeholder="소속부서를 입력해주세요"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>이메일</label>
        <input
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>휴대폰 번호</label>
        <div style={styles.phoneInput}>
          <select
            style={styles.select}
            value={phone0}
            onChange={(e) => setPhone0(e.target.value)}
          >
            <option>010</option>
            <option>011</option>
            <option>016</option>
          </select>
          <input
            style={styles.phoneField}
            placeholder="1234"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
          />
          <input
            style={styles.phoneField}
            placeholder="5678"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.row}>
        <label style={styles.label}>아이디</label>
        <input
          style={styles.input}
          placeholder="5자 이상"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div style={styles.row}>
        <label style={styles.label}>비밀번호</label>
        <input
          style={styles.input}
          type="password"
          placeholder="특수문자, 대소문자 포함 10자 이상 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </div>
  );
};

const styles = {
  section: { marginBottom: 40, width: "100%" },
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
  phoneInput: {
    display: "flex",
    gap: 8,
    padding: "8px 0",
    paddingLeft: 8,
    border: "1px solid #ccc",
    borderLeft: "none",
    flex: 1,
    backgroundColor: "white",
  },
  select: { width: 65, padding: 8, fontSize: 14 },
  phoneField: { width: 80, padding: 8, fontSize: 14 },
};

export default ManagerInfo;
