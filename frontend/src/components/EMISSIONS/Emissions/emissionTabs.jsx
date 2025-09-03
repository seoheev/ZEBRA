import React, { useMemo } from "react";
import { tabsWrap, tabBtn, tabBtnActive } from "./emission.styles";

export default function EmissionTabs({ active, onChange }) {
  const tabs = useMemo(
    () => [
      { key: "total", label: "Total" },
      { key: "scope1", label: "Scope 1" },
      { key: "scope2", label: "Scope 2" },
    ],
    []
  );

  return (
    <div style={tabsWrap}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          style={{ ...tabBtn, ...(active === t.key ? tabBtnActive : {}) }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
