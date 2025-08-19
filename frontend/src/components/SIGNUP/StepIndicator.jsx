// src/components/SIGNUP/StepIndicator.jsx
import React from "react";

const StepIndicator = ({ currentStep = 1 }) => {
  const steps = [
    "정보이용 동의 및 유의사항",
    "기관 인증",
    "기관 정보 입력",
    "담당자 정보 입력",
    "회원가입 완료",
  ];

  // 왼쪽(1) → 오른쪽(5)로 갈수록 옅어지도록
  const alphas = [0.9, 0.7, 0.6, 0.3];
  const cols = steps.length * 2 - 1;

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          rowGap: 8,
          alignItems: "center",
        }}
      >
        {steps.map((label, i) => {
          const col = i * 2 + 1;
          const stepNum = i + 1;

          return (
            <React.Fragment key={`step-${i}`}>
              {/* 번호 동그라미 (전부 테두리 원만) */}
              <div style={{ gridColumn: col, gridRow: 1, justifySelf: "center" }}>
                <div style={styles.dot}>{stepNum}</div>
              </div>

              {/* 라벨 */}
              <div
                style={{
                  gridColumn: col,
                  gridRow: 2,
                  justifySelf: "center",
                  whiteSpace: "nowrap",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#25463a",
                  textAlign: "center",
                }}
              >
                {label}
              </div>
            </React.Fragment>
          );
        })}

        {/* 연결선: 1 → 5 방향으로 점점 연해짐 */}
        {steps.slice(0, -1).map((_, i) => {
          const col = i * 2 + 2;
          return (
            <div
              key={`conn-${i}`}
              style={{
                gridColumn: col,
                gridRow: 1,
                height: 6,
                borderRadius: 3,
                backgroundColor: `rgba(0, 81, 45, ${alphas[alphas.length - 1 - i]})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: 980,
    margin: "24px auto 32px",
    padding: "0 16px",
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "2px solid #1B4332",
    color: "#1B4332",
    backgroundColor: "#fff",   // 항상 흰 배경
    fontSize: 14,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
};

export default StepIndicator;
