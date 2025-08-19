// components/NOTICE/Notice/notice.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Notice Page
 * - 분류/검색/페이지네이션/핀(상단고정)/신규뱃지/상세보기 지원
 * - localStorage에 'notices' 키로 저장 (최초 1회 시드)
 * - 필요 시 권한 체크 등은 상위에서 props로 제어 가능
 */

const LS_KEY = "notices";

const defaultSeed = [
  {
    id: cryptoRandomId(),
    category: "점검",
    title: "[예정] 시스템 정기 점검 안내 (08/20 02:00~04:00)",
    author: "관리자",
    createdAt: addDays(new Date(), -3).toISOString(),
    views: 124,
    pinned: true,
    attachments: 1,
    content:
      "안정적인 서비스 제공을 위해 8월 20일(화) 02:00~04:00 동안 정기 점검을 진행합니다. 점검 시간 동안 일부 기능이 제한될 수 있습니다.",
  },
  {
    id: cryptoRandomId(),
    category: "업데이트",
    title: "[릴리스] 대시보드 그래프 성능 개선 및 버그 수정",
    author: "시스템",
    createdAt: addDays(new Date(), -9).toISOString(),
    views: 312,
    pinned: false,
    attachments: 0,
    content:
      "대시보드 로딩 속도 개선, Scope 1/2 그래프 툴팁 정확도 향상, 일부 브라우저에서의 스타일 이슈를 해결했습니다.",
  },
  {
    id: cryptoRandomId(),
    category: "일반",
    title: "여름휴가 기간 고객센터 운영 시간 안내",
    author: "운영팀",
    createdAt: addDays(new Date(), -1).toISOString(),
    views: 56,
    pinned: false,
    attachments: 0,
    content:
      "8월 15일(금)~8월 18일(월) 동안 고객센터 운영 시간이 10:00~16:00로 단축됩니다.",
  },
  {
    id: cryptoRandomId(),
    category: "이벤트",
    title: "서비스 이용 후기 이벤트 (기프티콘 증정)",
    author: "마케팅",
    createdAt: addDays(new Date(), -5).toISOString(),
    views: 201,
    pinned: false,
    attachments: 2,
    content:
      "대시보드 이용 후기를 남겨주시면 추첨을 통해 기프티콘을 드립니다. 자세한 내용은 첨부 파일을 확인해주세요.",
  },
];

const categories = ["전체", "일반", "점검", "업데이트", "이벤트"];

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState("전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selected, setSelected] = useState(null); // 상세보기 모달

  // 최초 1회 시드
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(defaultSeed));
      setNotices(defaultSeed);
    } else {
      try {
        setNotices(JSON.parse(raw));
      } catch {
        setNotices(defaultSeed);
        localStorage.setItem(LS_KEY, JSON.stringify(defaultSeed));
      }
    }
  }, []);

  // 검색/필터링/정렬(핀 우선 + 최신순)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...notices]
      .filter((n) => (category === "전체" ? true : n.category === category))
      .filter(
        (n) =>
          !q ||
          n.title.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [notices, category, query]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (pageSafe - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, pageSafe, pageSize]);

  // 신규 배지 (7일 이내)
  const isNew = (iso) => {
    const diffDays = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  const handleOpenDetail = (item) => {
    // 조회수 1 증가
    const updated = notices.map((n) =>
      n.id === item.id ? { ...n, views: n.views + 1 } : n
    );
    setNotices(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setSelected({ ...item, views: item.views + 1 });
  };

  const handleCloseDetail = () => setSelected(null);

  const handleCreate = (payload) => {
    const newItem = {
      id: cryptoRandomId(),
      category: payload.category,
      title: payload.title,
      author: payload.author || "관리자",
      createdAt: new Date().toISOString(),
      views: 0,
      pinned: !!payload.pinned,
      attachments: payload.attachments ? Number(payload.attachments) : 0,
      content: payload.content || "",
    };
    const updated = [newItem, ...notices];
    setNotices(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setPage(1);
  };

  const handleTogglePin = (id) => {
    const updated = notices.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setNotices(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setSelected(null);
  };

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.headerRow}>
        <h1 style={styles.title}>공지사항</h1>
        <CreateButton onCreate={handleCreate} />
      </div>

      {/* 툴바 */}
      <div style={styles.toolbar}>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          style={styles.select}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div style={styles.searchBox}>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="제목/작성자/내용 검색"
            style={styles.searchInput}
          />
          <button onClick={() => setQuery("")} style={styles.clearBtn}>
            ✕
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div style={styles.tableWrap}>
        <div style={{ ...styles.row, ...styles.headRow }}>
          <div style={{ ...styles.cell, width: 80, textAlign: "center" }}>번호</div>
          <div style={{ ...styles.cell, width: 100 }}>분류</div>
          <div style={{ ...styles.cell, flex: 1 }}>제목</div>
          <div style={{ ...styles.cell, width: 80, textAlign: "center" }}>첨부</div>
          <div style={{ ...styles.cell, width: 140 }}>작성자</div>
          <div style={{ ...styles.cell, width: 140 }}>등록일</div>
          <div style={{ ...styles.cell, width: 80, textAlign: "right" }}>조회</div>
        </div>

        {paged.length === 0 ? (
          <div style={styles.emptyBox}>검색 결과가 없습니다.</div>
        ) : (
          paged.map((item, idx) => {
            const number = (pageSafe - 1) * pageSize + idx + 1;
            return (
              <div
                key={item.id}
                style={{
                  ...styles.row,
                  ...(item.pinned ? styles.pinnedRow : {}),
                }}
                onClick={() => handleOpenDetail(item)}
              >
                <div style={{ ...styles.cell, width: 80, textAlign: "center" }}>
                  {item.pinned ? "📌" : number}
                </div>
                <div style={{ ...styles.cell, width: 100 }}>
                  <Badge kind={item.category} />
                </div>
                <div style={{ ...styles.cell, flex: 1, display: "flex", gap: 8 }}>
                  <span style={styles.titleText}>{item.title}</span>
                  {isNew(item.createdAt) && <Chip label="NEW" />}
                </div>
                <div style={{ ...styles.cell, width: 80, textAlign: "center" }}>
                  {item.attachments > 0 ? "📎 " + item.attachments : "-"}
                </div>
                <div style={{ ...styles.cell, width: 140 }}>{item.author}</div>
                <div style={{ ...styles.cell, width: 140 }}>
                  {formatDate(item.createdAt)}
                </div>
                <div style={{ ...styles.cell, width: 80, textAlign: "right" }}>
                  {item.views.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        page={pageSafe}
        totalPages={totalPages}
        onChange={(p) => setPage(p)}
      />

      {/* 상세보기 모달 */}
      {selected && (
        <DetailModal
          item={selected}
          onClose={handleCloseDetail}
          onTogglePin={() => handleTogglePin(selected.id)}
          onDelete={() => handleDelete(selected.id)}
        />
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

function CreateButton({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "일반",
    title: "",
    author: "관리자",
    content: "",
    attachments: 0,
    pinned: false,
  });

  const canSubmit =
    form.title.trim().length > 0 && form.content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onCreate(form);
    setOpen(false);
    setForm({
      category: "일반",
      title: "",
      author: "관리자",
      content: "",
      attachments: 0,
      pinned: false,
    });
  };

  if (!open) {
    return (
      <button style={styles.primaryBtn} onClick={() => setOpen(true)}>
        + 새 공지
      </button>
    );
  }

  return (
    <div style={styles.dropdownCard}>
      <div style={styles.formRow}>
        <label style={styles.formLabel}>분류</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          style={styles.select}
        >
          {categories
            .filter((c) => c !== "전체")
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.formLabel}>제목</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="제목을 입력하세요"
          style={styles.input}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.formLabel}>작성자</label>
        <input
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          placeholder="작성자"
          style={styles.input}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.formLabel}>내용</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="내용을 입력하세요"
          rows={4}
          style={styles.textarea}
        />
      </div>

      <div style={styles.formRow}>
        <label style={styles.formLabel}>첨부 개수</label>
        <input
          type="number"
          min={0}
          value={form.attachments}
          onChange={(e) =>
            setForm({ ...form, attachments: Math.max(0, Number(e.target.value)) })
          }
          style={{ ...styles.input, width: 120 }}
        />
      </div>

      <div style={{ ...styles.formRow, alignItems: "center" }}>
        <label style={styles.formLabel}>상단 고정</label>
        <input
          type="checkbox"
          checked={form.pinned}
          onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
        />
      </div>

      <div style={styles.formActions}>
        <button style={styles.ghostBtn} onClick={() => setOpen(false)}>
          취소
        </button>
        <button
          style={{ ...styles.primaryBtn, opacity: canSubmit ? 1 : 0.5 }}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          등록
        </button>
      </div>
    </div>
  );
}

function Badge({ kind }) {
  const palette = {
    일반: { bg: "#eef2ff", fg: "#3730a3" },
    점검: { bg: "#fff7ed", fg: "#9a3412" },
    업데이트: { bg: "#ecfeff", fg: "#0e7490" },
    이벤트: { bg: "#f0fdf4", fg: "#166534" },
  };
  const p = palette[kind] || { bg: "#f1f5f9", fg: "#334155" };
  return (
    <span
      style={{
        backgroundColor: p.bg,
        color: p.fg,
        padding: "4px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {kind}
    </span>
  );
}

function Chip({ label }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 6,
        background: "#dcfce7",
        color: "#166534",
      }}
    >
      {label}
    </span>
  );
}

function Pagination({ page, totalPages, onChange }) {
  const items = [];
  const maxShown = 5;
  const start = Math.max(1, page - Math.floor(maxShown / 2));
  const end = Math.min(totalPages, start + maxShown - 1);

  for (let p = start; p <= end; p++) items.push(p);

  return (
    <div style={styles.pagination}>
      <button
        style={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onChange(1)}
      >
        ≪
      </button>
      <button
        style={styles.pageBtn}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
      {items.map((p) => (
        <button
          key={p}
          style={{
            ...styles.pageBtn,
            ...(p === page ? styles.pageBtnActive : {}),
          }}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        style={styles.pageBtn}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
      <button
        style={styles.pageBtn}
        disabled={page === totalPages}
        onClick={() => onChange(totalPages)}
      >
        ≫
      </button>
    </div>
  );
}

function DetailModal({ item, onClose, onTogglePin, onDelete }) {
  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge kind={item.category} />
            <h2 style={styles.modalTitle}>{item.title}</h2>
            {item.pinned && <span title="상단 고정">📌</span>}
          </div>
          <button style={styles.ghostBtn} onClick={onClose}>
            닫기
          </button>
        </div>

        <div style={styles.metaLine}>
          <span>작성자 {item.author}</span>
          <span>등록일 {formatDate(item.createdAt)}</span>
          <span>조회 {item.views.toLocaleString()}</span>
          <span>첨부 {item.attachments}</span>
        </div>

        <div style={styles.modalContent}>{item.content}</div>

        <div style={styles.modalActions}>
          <button style={styles.ghostBtn} onClick={onTogglePin}>
            {item.pinned ? "고정 해제" : "상단 고정"}
          </button>
          <button
            style={{ ...styles.dangerBtn }}
            onClick={() => {
              if (window.confirm("이 공지를 삭제할까요?")) onDelete();
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Utils & Styles ---------- */

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function cryptoRandomId() {
  // 브라우저 환경 고려 (crypto 지원 없을 때 fallback)
  try {
    const a = crypto.getRandomValues(new Uint32Array(4));
    return (
      Date.now().toString(36) +
      "-" +
      Array.from(a).map((n) => n.toString(36)).join("")
    );
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

const styles = {
  container: {
    padding: "24px 20px 40px",
    maxWidth: 1100,
    margin: "0 auto",
    marginTop: '150px',
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#111827",
  },
  toolbar: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  select: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: 14,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flex: 1,
    maxWidth: 480,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 6,
  },
  searchInput: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
    padding: "6px 8px",
  },
  clearBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    color: "#94a3b8",
  },
  tableWrap: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
  },
  headRow: {
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 700,
    color: "#0f172a",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    gap: 12,
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
  },
  pinnedRow: {
    background:
      "linear-gradient(0deg, rgba(254,252,232,0.65), rgba(254,252,232,0.65))",
  },
  cell: {
    fontSize: 14,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  titleText: {
    fontWeight: 600,
  },
  emptyBox: {
    padding: 40,
    textAlign: "center",
    color: "#64748b",
  },
  pagination: {
    display: "flex",
    gap: 6,
    justifyContent: "center",
    marginTop: 16,
  },
  pageBtn: {
    minWidth: 36,
    height: 36,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
  },
  pageBtnActive: {
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
    fontWeight: 700,
  },
  primaryBtn: {
    border: "none",
    background: "#14532d",
    color: "#fff",
    fontWeight: 700,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  ghostBtn: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
  dangerBtn: {
    border: "1px solid #fecaca",
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
  dropdownCard: {
    position: "relative",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 12,
    width: 420,
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
  },
  formRow: {
    display: "flex",
    gap: 12,
    marginBottom: 10,
  },
  formLabel: {
    width: 80,
    fontSize: 13,
    color: "#475569",
    paddingTop: 8,
  },
  input: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
  },
  textarea: {
    flex: 1,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
    resize: "vertical",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 999,
  },
  modalCard: {
    width: "min(900px, 100%)",
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    boxShadow:
      "0 25px 50px -12px rgba(0,0,0,0.25), 0 10px 15px -3px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },
  metaLine: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    color: "#64748b",
    fontSize: 13,
    marginBottom: 12,
  },
  modalContent: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    color: "#0f172a",
    padding: "12px 8px",
    background: "#f8fafc",
    borderRadius: 8,
    marginBottom: 12,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },
};
