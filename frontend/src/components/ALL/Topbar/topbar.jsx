import React from 'react';

const Topbar = ({
  message = '탄소중립 실현, 기관의 작은 실천에서 시작됩니다.',
  height = 10,
  fixed = true,                 // ← 기본을 고정으로
  offsetTop = '20px',           // ← 네비 높이(또는 합산값) 넣기
}) => {
  const basePos = fixed
    ? { position: 'fixed', top: offsetTop, left: 0, zIndex: 1000 }
    : { position: 'relative' }; // 아래 B안에서 사용

  return (
    <div style={{ ...styles.bar, ...basePos, height }}>
      
        <span style={styles.msg}>{message}</span>
      
    </div>
  );
};

const styles = {
  bar: { 
    width: '100%', 
    backgroundColor: '#14532d',
    display: 'flex',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 70px',
  },
  msg: { 
    color: '#fff', 
    fontWeight: 600, 
    fontSize: 14,
    margin: 0,
  },
};

export default Topbar;
