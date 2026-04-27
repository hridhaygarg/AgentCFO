import { useTheme } from '../theme/ThemeContext';

const modes = [
  { id: 'light', label: '☀' },
  { id: 'dark', label: '☾' },
  { id: 'auto', label: '⚙' },
];

export function ThemeToggle({ compact }) {
  const { mode, setMode, colors } = useTheme();

  return (
    <div style={{
      display: 'inline-flex',
      borderRadius: '8px',
      border: `1px solid ${colors.borderHover}`,
      background: colors.bgTertiary,
      overflow: 'hidden',
    }}>
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          title={m.id.charAt(0).toUpperCase() + m.id.slice(1)}
          style={{
            padding: compact ? '4px 10px' : '6px 14px',
            background: mode === m.id ? colors.accentGreenSubtle : 'transparent',
            color: mode === m.id ? colors.accentGreen : colors.textSecondary,
            border: 'none',
            borderRight: m.id !== 'auto' ? `1px solid ${colors.borderHover}` : 'none',
            cursor: 'pointer',
            fontSize: compact ? '11px' : '13px',
            fontWeight: mode === m.id ? 600 : 400,
            transition: 'all 120ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: mode === m.id ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
