import React from 'react';

const QuickService = () => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>자주 찾는 서비스 설정</h3>
      <div style={styles.box}>
        <span>1번 서비스</span>
        <span>2번 서비스</span>
        <span>3번 서비스</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  box: {
    border: '1px solid #16a34a',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
};

export default QuickService;
