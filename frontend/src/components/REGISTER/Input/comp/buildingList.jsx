// 건물 목록 컴포넌트

import React from 'react';

const BuildingList = ({ buildings, activeId, onSelect, loading }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.list} aria-label="등록 건물 목록">
        {loading ? (
          <div style={styles.skeleton}>불러오는 중...</div>
        ) : (buildings?.length ? (
          buildings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect(b.id)}
              style={{
                ...styles.item,
                ...(activeId === b.id ? styles.itemActive : {}),
              }}
            >
              {b.name}
            </button>
          ))
        ) : (
          <div style={styles.empty}>등록된 건물이 없습니다.</div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { background: 'white' },
  list: {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 8,
    height: 240, // 고정 높이
    overflowY: 'auto',
    background: '#fff',
  },
  item: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 12px',
    height: 44, // 항목 높이
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    marginBottom: 8,
  },
  itemActive: {
    outline: '2px solid #16a34a',
    background: '#f0fdf4',
  },
  skeleton: { padding: 12, color: '#6b7280', fontSize: 14 },
  empty: { padding: 12, color: '#6b7280', fontSize: 14 },
};

export default BuildingList;
