import React from "react";
import { Link } from "react-router-dom";
import serviceBg from "../../../assets/service.png"; // 배경 이미지
import zebraLogo from "../../../assets/zebraLogo.png"; // 로고 이미지

export default function MainPage() {
  const sx = {
    root: {
      position: "relative",
      width: "100%",
      minHeight: "calc(100vh - 64px)",
      overflow: "hidden",
      backgroundColor: "#f5f7f8",
      paddingTop: 32,
    },
    bgWrap: { position: "absolute", inset: 0 },
    bg: {
      position: "absolute",
      inset: 0,
      backgroundImage: `url(${serviceBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center 30%", // 사진 세로 위치 조정
      opacity: 0.65,
    },
    overlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.05) 100%)",
    },
    container: {
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px",
    },
    topTitle: {
      marginTop: 200,
      textAlign: "center",
      fontWeight: 800,
      fontSize: "clamp(28px, 4.6vw, 48px)",
      letterSpacing: "-0.02em",
      color: "#111827",
    },
    bannerBar: {
      position: "relative",
      marginTop: 100,
      width: "100vw",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(17, 24, 39, 0.45)",
      color: "#fff",
      padding: "24px 0",
      backdropFilter: "blur(2px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
      borderRadius: 0,
    },
    bannerInner: {
      maxWidth: 980,
      margin: "0 auto",
      padding: "0 24px",
      textAlign: "center",
    },
    bannerTitle: {
      margin: 0,
      fontWeight: 900,
      fontSize: "clamp(22px, 3.8vw, 40px)",
      lineHeight: 1.2,
    },
    bannerSub: {
      margin: "12px 0 0",
      fontSize: "clamp(14px, 2.2vw, 20px)",
      lineHeight: 1.6,
      opacity: 0.95,
    },

    // 하단 로고 푸터 스타일
    footer: {
      position: "absolute",
      bottom: 18,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 2,
      background: "rgba(255,255,255,0.85)",
      borderRadius: 10,
      boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
      padding: "10px 14px",
    },
    footerWrap: { display: "flex", alignItems: "center", textDecoration: "none" },
    footerLogoImg: { height: 32, marginRight: 10, filter: "contrast(1.2) saturate(1.2)" },
    footerTextCol: { display: "flex", flexDirection: "column", lineHeight: 1.2 },
    footerTitle: { fontWeight: "bold", fontSize: 16, color: "#111827" },
    footerSub: { fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" },
  };

  return (
    <main style={sx.root}>
      {/* 배경 */}
      <div style={sx.bgWrap} aria-hidden>
        <div style={sx.bg} />
        <div style={sx.overlay} />
      </div>

      {/* 제목 */}
      <div style={sx.container}>
        <h1 style={sx.topTitle}>탄소 중립의 첫 걸음</h1>
      </div>

      {/* 풀폭 회색 배너 */}
      <section style={sx.bannerBar}>
        <div style={sx.bannerInner}>
          <h2 style={sx.bannerTitle}>데이터로 설계하는 친환경 미래</h2>
          <p style={sx.bannerSub}>건물의 에너지와 탄소를 한 번에 관리하는 스마트 솔루션</p>
        </div>
      </section>

      {/* 하단 로고 푸터 */}
      <footer style={sx.footer}>
        <Link to="/" style={sx.footerWrap}>
          <img src={zebraLogo} alt="Zebra Logo" style={sx.footerLogoImg} />
          <div style={sx.footerTextCol}>
            <div style={sx.footerTitle}>Zebra</div>
            <div style={sx.footerSub}>Zero Energy Building Reporting and Advisor</div>
          </div>
        </Link>
      </footer>
    </main>
  );
}
