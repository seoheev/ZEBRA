// Scope2 입력 컴포넌트

import React, { useEffect, useMemo, useState } from 'react';

const numberOnly = (v) => {
  if (v === '') return '';
  const cleaned = v.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  const [intPart, decPart = ''] = parts;
  return decPart.length > 4 ? `${intPart}.${decPart.slice(0, 4)}` : cleaned;
};

const Scope2Card = ({ initialValue }) => {
  const [rows, setRows] = useState([{ id: 1, name: '', kwh: '' }]);

  // 👉 initialValue가 바뀌면 서버값으로 hydrate
  useEffect(() => {
    if (!initialValue?.meters?.length) {
      setRows([{ id: 1, name: '', kwh: '' }]);
      return;
    }
    const mapped = initialValue.meters.map((m, idx) => ({
      id: m.id ?? Date.now() + idx,
      name: m.name ?? '',
      kwh: m.kwh?.toString?.() ?? '',
    }));
    setRows(mapped);
  }, [initialValue]);

  const addRow = () => setRows((prev) => [...prev, { id: Date.now(), name: '', kwh: '' }]);
  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));
  const updateRow = (id, patch) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const totalKwh = useMemo(
    () => rows.reduce((sum, r) => sum + (parseFloat(r.kwh || '0') || 0), 0),
    [rows]
  );

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.badge}>Scope 2</span>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHead}>
          <div style={{ flex: 3, whiteSpace: 'nowrap' }}>계량기/계정</div>
          <div style={{ flex: 1, whiteSpace: 'nowrap' }}>kWh (단위)</div>
          <div style={{ width: 40 }} />
        </div>

        {rows.map((row) => (
          <div key={row.id} style={styles.tableRow}>
            <div style={{ flex: 3 }}>
              <input
                type="text"
                placeholder="예: 본관 A계량기"
                value={row.name}
                onChange={(e) => updateRow(row.id, { name: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={row.kwh}
                onChange={(e) => updateRow(row.id, { kwh: numberOnly(e.target.value) })}
                style={styles.input}
              />
            </div>
            <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
              <button type="button" onClick={() => removeRow(row.id)} style={styles.iconBtn} title="행 삭제">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footerRow}>
        <div style={styles.totalBox}>
          합계 <strong>{isNaN(totalKwh) ? 0 : totalKwh}</strong> kWh
        </div>
        <button type="button" onClick={addRow} style={styles.addBtn}>＋</button>
      </div>
    </div>
  );
};

const styles = {
  card: { border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff', padding: 16 },
  header: { marginBottom: 12 },
  badge: {
    display: 'inline-block',
    border: '1px solid #e5e7eb',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 12,
    background: '#fafafa',
  },
  input: {
    height: 32,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    padding: '0 8px',
    width: '100%',
    fontSize: 13,
    boxSizing: 'border-box',
  },
  table: { display: 'flex', flexDirection: 'column', gap: 8 },
  tableHead: {
    display: 'flex', gap: 8, fontSize: 12, color: '#6b7280', padding: '0 6px',
  },
  tableRow: { display: 'flex', gap: 8, alignItems: 'center' },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer',
  },
  footerRow: { marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  totalBox: {
    fontSize: 13, color: '#111827', background: '#f9fafb',
    border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px',
  },
  addBtn: {
    width: 36, height: 36, borderRadius: 18, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer',
  },
};

export default Scope2Card;