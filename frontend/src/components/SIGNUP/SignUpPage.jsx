// src/components/SIGNUP/SignUpPage.jsx
import React, { useState } from "react";
import StepIndicator from "./StepIndicator.jsx";
import InstitutionInfo from "./InstitutionInfo.jsx";
import ManagerInfo from "./ManagerInfo.jsx";
import zebraLogo from "../../assets/zebraLogo.png";
import { register as registerApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";

const SAFE_TOP = 100;

const styles = {
  page: {
    display: "flex",
    backgroundColor: "#fff",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    paddingTop: SAFE_TOP,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.92)",
    zIndex: 0,
  },
  mainContent: {
    flex: 1,
    padding: 40,
    zIndex: 1,
  },
  formWrapper: {
    position: "relative",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 8,
    border: "1px solid #ccc",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minHeight: 400,
  },
  logo: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 300,
    opacity: 0.5,
  },
  bottomButton: {
    display: "block",
    width: "100%",
    maxWidth: 400,
    margin: "40px auto 0",
    padding: "14px 0",
    backgroundColor: "#2f5d50",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
  },
};

const SignUpPage = () => {
  const navigate = useNavigate();

  // 기관
  const [insName, setInsName] = useState("");
  const [insType, setInsType] = useState("");
  const [insAddress, setInsAddress] = useState("");

  // 담당자
  const [managerName, setManagerName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone0, setPhone0] = useState("010");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");

  // 로그인용
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        institutionName: insName,
        institutionType: insType,
        institutionAddress: insAddress,
        managerName,
        department,
        email,
        phone0,
        phone1,
        phone2,
        id: userId,
        password,
      };
      await registerApi(payload);
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/"); // 홈으로 이동(배너에서 로그인 가능)
    } catch (e) {
      console.error(e);
      alert("회원가입에 실패했습니다. 입력값을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      <div style={styles.sidebar}>&gt; 회원가입</div>
      <div style={styles.mainContent}>
        <StepIndicator currentStep={4} />
        <div style={styles.formWrapper}>
          <InstitutionInfo
            insName={insName} setInsName={setInsName}
            insType={insType} setInsType={setInsType}
            insAddress={insAddress} setInsAddress={setInsAddress}
          />
          <ManagerInfo
            managerName={managerName} setManagerName={setManagerName}
            department={department} setDepartment={setDepartment}
            email={email} setEmail={setEmail}
            phone0={phone0} setPhone0={setPhone0}
            phone1={phone1} setPhone1={setPhone1}
            phone2={phone2} setPhone2={setPhone2}
            userId={userId} setUserId={setUserId}
            password={password} setPassword={setPassword}
          />
          <img src={zebraLogo} alt="logo" style={styles.logo} />
        </div>

        <button
          style={{ ...styles.bottomButton, opacity: loading ? 0.6 : 1 }}
          disabled={loading}
          onClick={onSubmit}
        >
          {loading ? "처리 중..." : "가입하기"}
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
