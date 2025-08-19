// 사용량 입력 컨트롤러

/*
백엔드 연동, 사용 방법 (나중에 서버 붙일 때)
input.jsx에서 activeBuildingId가 정해지면 서버에서 GET /energy-inputs로 데이터 가져와 energyDataMap[id]에 넣어주고, 그걸 initialValue로 내려주면 자동으로 채워짐.
건물 바꿀 때는 key로 리마운트되므로 항상 해당 건물 기준으로 초기화/채움 동작이 보장돼.
필요하면 자동 저장(PATCH) 콜백까지 바로 붙여줄게.
*/


import React, { useEffect, useState } from 'react';
import BuildingList from './comp/buildingList';
import InfoBubble from './comp/infoBubble';
import Scope1Card from './comp/scope1Card';
import Scope2Card from './comp/scope2Card';
import AreaCard from './comp/areaCard';

const Input = () => {
  const [buildings, setBuildings] = useState([]);
  const [activeBuildingId, setActiveBuildingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: 실제 API 연동 시 여기만 바꾸면 됨
  const fetchBuildings = async () => {
    return [
      { id: 'b1', name: '동국대학교 원흥관1' },
      { id: 'b2', name: '동국대학교 원흥관3' },
      { id: 'b3', name: '동국대학교 신공학관' },
      { id: 'b4', name: '동국대학교 혜화관' },
      { id: 'b5', name: '동국대학교 중앙도서관' },
    ];
  };

  // 👉 나중에 서버에서 불러온 값을 여기에 저장해두고, 아래 initialValue로 내려주면 됨
  // 예: { [buildingId]: { scope1: {...}, scope2: {...}, area: {...} } }
  const [energyDataMap] = useState({}); // 현재는 비워둠

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchBuildings();
        if (!mounted) return;
        setBuildings(data);
        setActiveBuildingId(data?.[0]?.id ?? null);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const currentInitial = energyDataMap[activeBuildingId] || null;

  return (
    <div style={styles.page}>
      <div style={styles.topRow}>
        <div style={styles.leftCol}>
          <h3 style={styles.sectionTitle}>연료 사용량 입력</h3>
          <BuildingList
            buildings={buildings}
            activeId={activeBuildingId}
            onSelect={setActiveBuildingId}
            loading={loading}
          />
        </div>

        <div style={styles.rightCol}>
          <InfoBubble />
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.bottomLeft}>
          {/* 건물 변경 시 리마운트 → 폼 초기화, 서버 값 있으면 initialValue로 hydrate */}
          <Scope1Card
            key={`s1-${activeBuildingId || 'none'}`}
            initialValue={currentInitial?.scope1}
          />
        </div>
        <div style={styles.bottomRight}>
          <Scope2Card
            key={`s2-${activeBuildingId || 'none'}`}
            initialValue={currentInitial?.scope2}
          />
          <AreaCard
            key={`area-${activeBuildingId || 'none'}`}
            initialValue={currentInitial?.area}
          />
        </div>
      </div>

      <div style={styles.footer}>
        <button type="button" style={styles.submitBtn}>
          입력 완료
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: 16, padding: 20 },
  topRow: { display: 'grid', gridTemplateColumns: '380px 1fr', gap: 16, alignItems: 'start' },
  leftCol: {},
  rightCol: { display: 'flex', justifyContent: 'flex-start' },
  sectionTitle: { margin: '0 0 12px 0' },
  bottomRow: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' },
  bottomLeft: {},
  bottomRight: { display: 'flex', flexDirection: 'column', gap: 16 },
  footer: { display: 'flex', justifyContent: 'center', marginTop: 12 },
  submitBtn: {
    minWidth: 240,
    height: 44,
    borderRadius: 10,
    border: 'none',
    background: '#166534',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Input;