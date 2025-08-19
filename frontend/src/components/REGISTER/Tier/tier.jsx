import React, { useMemo, useState, useEffect } from "react";

export default function TierSurveyPage() {
  const TOTAL_STEPS = 12;

  const questions = useMemo(
    () => [
      { id: "Q1", text: "귀하는 연소자료 QC와 함께 배출 산정 절차를 이용하고 계신가요?" },
      { id: "Q2", text: "귀하는 연소자료 QC와 함께 배출 산정 절차를 이용하고 계신가요?" },
      { id: "Q3", text: "귀하는 연소자료 QC와 함께 배출 산정 절차를 이용하고 계신가요?" },
    ],
    []
  );

  const [current, setCurrent] = useState(1); // 중앙은 항상 current가 오도록 구성
  const [answers, setAnswers] = useState({});

  const prev = () => setCurrent((i) => (i - 1 + questions.length) % questions.length);
  const next = () => setCurrent((i) => (i + 1) % questions.length);

  const onAnswer = (qid, v) => {
    setAnswers((p) => ({ ...p, [qid]: v }));
    setTimeout(() => next(), 160);
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const leftIdx = (current - 1 + questions.length) % questions.length;
  const rightIdx = (current + 1) % questions.length;

  const stepNow = Math.min(current + 1, TOTAL_STEPS);
  const progressPct = Math.round((stepNow / TOTAL_STEPS) * 100);

  return (
    <>
      <div style={sx.titleRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={sx.pageTitle}>🌎 탄소 배출량 계산</h1>
        </div>
        <div style={sx.stepText}>{stepNow}/{TOTAL_STEPS}</div>
      </div>

      <div style={sx.progressWrap}>
        <div style={{ ...sx.progressBar, width: `${progressPct}%` }} />
      </div>

      <div style={sx.carouselWrap}>
        <Card q={questions[leftIdx]} small dimmed />
        <Card
          q={questions[current]}
          emphasized
          isCurrent
          onYes={() => onAnswer(questions[current].id, "yes")}
          onNo={() => onAnswer(questions[current].id, "no")}
          selected={answers[questions[current].id]}
        />
        <Card q={questions[rightIdx]} small dimmed />

        <button onClick={prev} aria-label="이전" style={{ ...sx.navBtn, left: 12 }}>←</button>
        <button onClick={next} aria-label="다음" style={{ ...sx.navBtn, right: 12 }}>→</button>
      </div>
    </>
  );
}

function Card({ q, small, dimmed, emphasized, isCurrent, onYes, onNo, selected }) {
  const st = {
    ...sx.card,
    ...(small ? sx.cardSmall : {}),
    ...(dimmed ? sx.cardDim : {}),
    ...(emphasized ? sx.cardEm : {}),
  };

  return (
    <div style={st}>
      <div style={sx.qid}>{q.id}</div>

      {/* 중앙(현재) 카드만 텍스트 보임 */}
      <p style={{ ...sx.qtext, ...(small ? sx.qtextSm : {}) }}>
        {isCurrent ? q.text : ""}
      </p>

      {/* 중앙(현재) 카드만 버튼 보임 */}
      {isCurrent && (
        <div style={sx.btnRow}>
          <button
            onClick={onYes}
            style={{ ...sx.btn, ...(selected === "yes" ? sx.btnPrimary : sx.btnGreen) }}
          >
            예
          </button>
          <button
            onClick={onNo}
            style={{ ...sx.btn, ...(selected === "no" ? sx.btnPrimary : sx.btnGray) }}
          >
            아니오
          </button>
        </div>
      )}
    </div>
  );
}

const sx = {
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  bullet: { width: 18, height: 18, borderRadius: 18, background: "#2E6B4A", display: "inline-block" },
  pageTitle: { fontSize: 16, fontWeight: 700, margin: 0 },
  stepText: { color: "#6b6f6d", fontSize: 14 },

  progressWrap: { height: 6, background: "#EDEFF1", borderRadius: 999, overflow: "hidden", margin: "8px 0 12px" },
  progressBar: { height: "100%", background: "#2E6B4A", transition: "width .2s" },

  // 가운데 칼럼을 항상 더 넓게(현재 카드가 중앙이므로 현재만 가로가 길게 보임)
  carouselWrap: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "minmax(220px,0.8fr) minmax(600px,1.6fr) minmax(220px,0.8fr)",
    gap: 24,
    alignItems: "stretch",
    padding: "24px 24px 56px",
    background: "#F6F7F8",
    borderRadius: 14,
    overflow: "visible",
    marginTop: 70,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
    padding: "32px 28px",
    minHeight: 340,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 16,
    transition: "transform .15s, box-shadow .15s",
  },
  // 중앙 카드 크기 확대
  cardEm: { transform: "scale(1.3)", zIndex: 2, position: "relative", boxShadow: "0 18px 30px rgba(0,0,0,0.15)" },
  cardSmall: { transform: "scale(0.92)", opacity: 0.96 },
  cardDim: { filter: "grayscale(3%)", opacity: 0.96 },

  qid: { fontSize: 22, fontWeight: 800, marginTop: 2 },
  qtext: { fontSize: 18, lineHeight: 1.7, margin: 0, overflowWrap: "anywhere", wordBreak: "break-word", flexGrow: 1, display: "flex", alignItems: "center" },
  qtextSm: { fontSize: 16, lineHeight: 1.6 },

  btnRow: { display: "flex", gap: 12, marginTop: "auto" },
  btn: { minWidth: 92, height: 40, borderRadius: 10, border: "1px solid #dcdcdc", background: "#fff", cursor: "pointer", fontSize: 16 },
  btnGreen: { background: "#DCEFE4", borderColor: "#DCEFE4" },
  btnGray: { background: "#F0F1F2", borderColor: "#F0F1F2" },
  btnPrimary: { background: "#2E6B4A", color: "#fff", borderColor: "#2E6B4A" },

  navBtn: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    border: "1px solid #E1E4E6",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    width: 44,
    height: 44,
    borderRadius: 999,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "44px",
  },
};
