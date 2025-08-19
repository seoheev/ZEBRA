// 건물 등록 UI + 우측 검색 리스트 + 하단 카카오 지도
import React, { useEffect, useRef, useState } from 'react';

/** ─────────── 설정 ─────────── */
const BUILDINGS_API = '/api/buildings';            // ← 백엔드 엔드포인트
const KAKAO_KEY = '6bfadcc55e6a410027178ce3208a469e'; // ← developers.kakao.com에서 발급

/** 카카오 SDK 동적 로더 (한 번만 로드) */
function loadKakaoSDK(appKey) {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) return resolve(window.kakao);
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
     if (!(window.kakao && window.kakao.maps)) {
       return reject(new Error('Kakao SDK loaded but maps namespace missing'));
     }
     // autoload=false: 반드시 kakao.maps.load 사용
     if (typeof window.kakao.maps.load === 'function') {
       window.kakao.maps.load(() => resolve(window.kakao));
     } else {
       // (만약 autoload=true로 들어온 경우 대비)
      resolve(window.kakao);
    }
   };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

const Building = () => {
  // 기존 상태
  const [insName, setInsName] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [address, setAddress] = useState('');

  // 우측 패널: 검색/목록/선택
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selectedBuildings, setSelectedBuildings] = useState([]);

  // 지도 refs
  const mapRef = useRef(null);        // div 컨테이너
  const mapObjRef = useRef(null);     // kakao.maps.Map
  const markerRef = useRef(null);     // kakao.maps.Marker (단일 마커)
  const geocoderRef = useRef(null);   // kakao.maps.services.Geocoder

  // 초기 기관명 로딩
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.insName) setInsName(userData.insName);
  }, []);

  // 검색어 디바운스
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  // 기관/검색어 변경 시 목록 조회
  useEffect(() => {
    if (!insName) return;
    const controller = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        const params = new URLSearchParams();
        params.set('org', insName);
        if (debounced) params.set('query', debounced);
        const res = await fetch(`${BUILDINGS_API}?${params.toString()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== 'AbortError') {
          setLoadError('건물 목록을 가져오지 못했습니다.');
          setList([]);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [insName, debounced]);

  // 카카오 지도 초기화 (최초 1회)
  useEffect(() => {
    let mounted = true;
    (async () => {
      const kakao = await loadKakaoSDK(KAKAO_KEY);
      if (!mounted) return;

      const center = new kakao.maps.LatLng(37.5665, 126.9780); // 서울시청
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      geocoderRef.current = new kakao.maps.services.Geocoder();
      markerRef.current = new kakao.maps.Marker({ map, position: center });
    })().catch(console.error);

    return () => { mounted = false; };
  }, []);

  // address 변경 시 지오코딩 → 지도/마커 이동
  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao || !geocoderRef.current || !mapObjRef.current || !markerRef.current) return;
    if (!address || address.trim().length < 2) return;

    const geocoder = geocoderRef.current;
    geocoder.addressSearch(address, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result[0]) return;
      const { x, y } = result[0]; // x lng, y lat
      const latlng = new kakao.maps.LatLng(y, x);
      mapObjRef.current.setCenter(latlng);
      markerRef.current.setPosition(latlng);
    });
  }, [address]);

  // 우측 리스트에서 “+” 클릭 → 선택 + 주소 입력칸 자동 채움 → 지도 이동
  const handleAddBuilding = (b) => {
    if (selectedBuildings.some((x) => x.id === b.id)) return;
    setSelectedBuildings((prev) => [...prev, b]);
    if (b.address) setAddress(b.address);
  };

  const handleRemoveBuilding = (id) =>
    setSelectedBuildings((prev) => prev.filter((b) => b.id !== id));

  const buildingTypes = [
    '업무 시설',
    '교육 연구 시설',
    '문화 및 집회시설',
    '의료 시설',
    '수련 시설',
    '운수 시설',
  ];

  const handleRegister = () => {
    // TODO: 백엔드 POST
    // payload 예시: { insName, address, selectedPurpose, selectedBuildings }
    console.log({ insName, address, selectedPurpose, selectedBuildings });
    alert('저장되었습니다 (콘솔 확인)!');
  };

  return (
    <div style={styles.pageGrid}>
      {/* 좌측 폼 */}
      <div style={styles.container}>
        <h2 style={styles.title}>건물 등록</h2>

        <div style={styles.section}>
          <label>등록 기관명 (소속):</label>
          <input
            type="text"
            value={insName}
            readOnly
            style={{ ...styles.input, backgroundColor: '#f0f0f0', color: '#555' }}
          />
        </div>

        <div style={styles.section}>
          <label>건물 입력:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소 검색"
            style={styles.input}
          />
        </div>

        <div style={styles.section}>
          <label>건물 용도:</label>
          <div style={styles.tags}>
            {buildingTypes.map((item, idx) => (
              <button
                key={idx}
                style={{
                  ...styles.tag,
                  ...(selectedPurpose === item ? styles.selectedTag : {}),
                }}
                onClick={() => setSelectedPurpose(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <label>선택한 건물:</label>
          <div style={{ marginTop: 8 }}>
            {selectedBuildings.length === 0 && (
              <div style={styles.empty}>오른쪽 목록에서 “+”로 건물을 추가하세요.</div>
            )}
            {selectedBuildings.map((b) => (
              <span key={b.id} style={styles.chip}>
                {b.name}
                <button
                  type="button"
                  onClick={() => handleRemoveBuilding(b.id)}
                  style={styles.chipClose}
                  aria-label={`${b.name} 제거`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <button style={styles.registerButton} onClick={handleRegister}>
            추가하기
          </button>
        </div>
      </div>

      {/* 우측: 기관별 건물 검색 리스트 */}
      <aside style={styles.rightPanel} aria-label="건물 검색 리스트">
        <div style={styles.panelHeader}>
          <div style={{ fontWeight: 'bold' }}>검색 건물 리스트</div>
          <small style={{ color: '#6b7280' }}>
            {insName ? `기관: ${insName}` : '기관명을 확인하세요'}
          </small>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="건물명 검색"
          style={styles.search}
          aria-label="건물명 검색"
        />

        <div style={styles.listBox} role="list">
          {isLoading && <div style={styles.status}>불러오는 중…</div>}
          {loadError && <div style={styles.error}>{loadError}</div>}
          {!isLoading && !loadError && list.length === 0 && (
            <div style={styles.status}>결과가 없습니다.</div>
          )}
          {list.map((b) => (
            <div key={b.id} style={styles.item} role="listitem">
              <div style={styles.itemMain}>
                <div style={styles.itemName}>{b.name}</div>
                {b.address && <div style={styles.itemSub}>{b.address}</div>}
              </div>
              <button
                type="button"
                onClick={() => handleAddBuilding(b)}
                style={styles.addBtn}
                aria-label={`${b.name} 추가`}
              >
                +
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => alert(`${selectedBuildings.length}개 건물 선택됨`)}
          style={styles.secondaryBtn}
        >
          건물 추가하기
        </button>
      </aside>

      {/* 하단: 카카오 지도 */}
      <div style={{ gridColumn: '1 / -1' }}>
        <h3 style={{ margin: '16px 0 8px' }}>지도</h3>
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: 360,
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            overflow: 'hidden',
            background: '#f8fafc',
          }}
        />
      </div>
    </div>
  );
};

/** ─────────── styles ─────────── */
const styles = {
  pageGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr',
    gap: '16px',
    alignItems: 'start',
  },
  container: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: { marginBottom: '24px', fontSize: '22px', fontWeight: 'bold' },
  section: { marginBottom: '20px' },
  input: {
    padding: '8px 12px',
    fontSize: '14px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '8px',
  },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  tag: {
    backgroundColor: '#f0f4f3',
    border: '1px solid #ccc',
    padding: '8px 12px',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  selectedTag: {
    backgroundColor: '#14532d',
    color: 'white',
    border: '1px solid #14532d',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#00512D',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    opacity: '0.7',
  },

  rightPanel: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 12,
  },
  panelHeader: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 },
  search: {
    height: 36, border: '1px solid #e5e7eb', borderRadius: 10, padding: '0 12px',
    outline: 'none', marginBottom: 10, width: '100%',
  },
  listBox: {
    border: '1px solid #e5e7eb', borderRadius: 10, maxHeight: 380, overflow: 'auto',
    padding: 8, background: '#fafafa', marginBottom: 10,
  },
  item: {
    display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
    padding: '8px 10px', borderRadius: 10, background: '#fff',
    border: '1px solid #e5e7eb', marginBottom: 8,
  },
  itemMain: { minWidth: 0 },
  itemName: { fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  itemSub: { fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  addBtn: {
    width: 32, height: 32, borderRadius: 8, border: '1px solid #d1d5db',
    background: '#f3f4f6', cursor: 'pointer', fontSize: 20, lineHeight: '30px',
  },
  secondaryBtn: {
    width: '100%', height: 40, borderRadius: 10, border: '1px solid #d1d5db',
    background: '#fff', cursor: 'pointer', fontWeight: 600,
  },
  status: { padding: '12px 8px', textAlign: 'center', color: '#6b7280' },
  error: { padding: '12px 8px', textAlign: 'center', color: '#b91c1c' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px',
    borderRadius: 9999, background: '#eef2ff', border: '1px solid #c7d2fe',
    marginRight: 8, marginBottom: 8, fontSize: 12,
  },
  chipClose: { border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, lineHeight: 1 },
  empty: { fontSize: 13, color: '#6b7280' },
};

export default Building;
