const colors = {
  bgSurface: '#ffffff',
  bgSubtle: '#f5f5f4',
  borderDefault: 'rgba(0,0,0,0.08)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  accentGreen: '#16a34a',
  shadowSm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
};

export default function Budget() {
  const monthlyBudget = 10000;
  const spent = 5340;
  const percent = (spent / monthlyBudget) * 100;

  return (
    <div>
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '32px',
        color: colors.textPrimary,
      }}>
        Budget Control
      </h2>

      <div style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '32px',
        boxShadow: colors.shadowSm,
        maxWidth: '500px',
      }}>
        <div style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <label style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '13px',
            color: colors.textSecondary,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Monthly Budget
          </label>
          <input
            type="number"
            defaultValue={monthlyBudget}
            style={{
              background: colors.bgSubtle,
              border: `1px solid ${colors.borderDefault}`,
              color: colors.textPrimary,
              padding: '10px 12px',
              borderRadius: '6px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '16px',
              width: '140px',
              fontWeight: '600',
              transition: 'all 200ms',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.accentGreen;
              e.target.style.boxShadow = `0 0 0 3px rgba(22, 163, 74, 0.1)`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.borderDefault;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            height: '8px',
            background: colors.bgSubtle,
            borderRadius: '4px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${percent}%`,
              background: percent > 95 ? '#dc2626' : percent > 80 ? '#f59e0b' : colors.accentGreen,
              transition: 'width 300ms ease-out',
              borderRadius: '4px',
            }} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          borderTop: `1px solid ${colors.borderDefault}`,
        }}>
          <span style={{
            fontSize: '13px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            Spent this month
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.textPrimary,
            fontFamily: 'IBM Plex Mono, monospace',
          }}>
            ${spent.toLocaleString()}
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
        }}>
          <span style={{
            fontSize: '13px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            Remaining budget
          </span>
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: colors.accentGreen,
            fontFamily: 'IBM Plex Mono, monospace',
          }}>
            ${(monthlyBudget - spent).toLocaleString()}
          </span>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: colors.bgSubtle,
          borderRadius: '6px',
          fontSize: '12px',
          color: colors.textSecondary,
          fontFamily: 'IBM Plex Mono, monospace',
        }}>
          {percent.toFixed(0)}% of budget used
        </div>
      </div>
    </div>
  );
}
