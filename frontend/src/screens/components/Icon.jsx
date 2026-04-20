export function Icon({ name, size = 18, strokeWidth = 1.5 }) {
  const icons = {
    overview: <><rect x='3' y='3' width='7' height='9' rx='1'/><rect x='14' y='3' width='7' height='5' rx='1'/><rect x='14' y='12' width='7' height='9' rx='1'/><rect x='3' y='16' width='7' height='5' rx='1'/></>,
    agents: <><circle cx='12' cy='12' r='3'/><path d='M12 2v3M12 19v3M5 5l2 2M17 17l2 2M2 12h3M19 12h3M5 19l2-2M17 7l2-2'/></>,
    budget: <><path d='M12 2v20'/><path d='M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'/></>,
    reports: <><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z'/><path d='M14 2v6h6'/><path d='M9 13h6M9 17h6M9 9h2'/></>,
    outreach: <><path d='M2 12l20-9-9 20-2-9-9-2z'/></>,
    integrations: <><rect x='3' y='3' width='7' height='7' rx='1'/><rect x='14' y='3' width='7' height='7' rx='1'/><rect x='14' y='14' width='7' height='7' rx='1'/><path d='M6.5 10v4M17.5 10v4M10 17.5h4'/></>,
    docs: <><path d='M4 4h12a2 2 0 012 2v14l-4-3-4 3-4-3-2 1.5V6a2 2 0 012-2z'/></>,
    settings: <><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'/></>,
    menu: <><line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/></>,
    chevron: <polyline points='6 9 12 15 18 9'/>,
    search: <><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></>,
    check: <polyline points='20 6 9 17 4 12'/>,
    copy: <><rect x='9' y='9' width='13' height='13' rx='2'/><path d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1'/></>,
    external: <><path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></>,
    logout: <><path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></>,
    plus: <><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></>,
  };
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={strokeWidth} strokeLinecap='round' strokeLinejoin='round' style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
}
