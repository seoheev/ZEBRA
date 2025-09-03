import React from 'react';

const NoticeSection = () => {
  const notices = [
    { id: 1, title: '"우리 기관의 탄소발자국, 얼마나 될까?" - 공공건축물 온실가스 진단 서비스 오픈', date: '2025-08-29' },
    { id: 2, title: '기후위기 극복, "탄소중립"은 가야만 하는 길', date: '2023-03-31' },
    { id: 3, title: '"2050년까지 탄소중립" 방안 연내 마련...도전적 목표 설정 ', date: '2025-01-10' },
    { id: 4, title: '"기후위기 대응 포기했나" 기업 편 들어준 탄소 중립 계획', date: ' 2023-03-22' },
  ];

  return (
    <div>
      <h3 style={styles.title}>NEWS</h3>
      <ul style={styles.list}>
        {notices.map((notice) => (
          <li key={notice.id} style={styles.item}>
            <span>{notice.title}</span>
            <span>{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    fontSize: '14px',
    color: '#333',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: '1px solid #eee',
  },
};

export default NoticeSection;
