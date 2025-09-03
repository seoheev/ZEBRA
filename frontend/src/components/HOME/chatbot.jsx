import React, { useState } from 'react';
import zebraBot from '../../assets/main4.png';

const Chatbot = () => {
  const [visible, setVisible] = useState(false); // 초기는 닫힘 상태

  return (
    <div style={styles.container}>
      {visible ? (
        <div style={styles.chatbox}>
          <div style={styles.bubble}>
            챗봇 질문 바로가기
          </div>
          <div style={styles.imageWrapper}>
            <img src={zebraBot} alt="챗봇" style={styles.image} />
            <button onClick={() => setVisible(false)} style={styles.closeButton}>×</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setVisible(true)} style={styles.openButton}>
          <img src={zebraBot} alt="챗봇 열기" style={styles.imageSmall} />
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '20px',
    right: '50px',
    zIndex: 1000,
  },
  chatbox: {
    display: 'flex',
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: 'white',
    border: '1px solid #4CAF50',
    borderRadius: '20px',
    padding: '8px 16px',
    marginRight: '10px',
    fontSize: '14px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  imageSmall: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    //border: '2px solid #4CAF50',
    cursor: 'pointer',
  },
  closeButton: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: 'green',
    color: 'white',
    borderRadius: '50%',
    border: 'none',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  openButton: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  }
};

export default Chatbot;
