const colors = {
  bgSurface: '#ffffff',
  borderDefault: 'rgba(0,0,0,0.08)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  accentGreen: '#16a34a',
  dangerRed: '#dc2626',
  shadowSm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
};

export default function Report() {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '32px',
          fontWeight: '700',
          color: colors.textPrimary,
        }}>
          Reports
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            background: colors.accentGreen,
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 200ms',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Send Now
          </button>
          <button style={{
            background: 'transparent',
            color: colors.accentGreen,
            border: `1.5px solid ${colors.accentGreen}`,
            padding: '10px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 200ms',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Schedule
          </button>
        </div>
      </div>

      <div style={{
        background: colors.bgSurface,
        color: colors.textPrimary,
        borderRadius: '8px',
        border: `1px solid ${colors.borderDefault}`,
        padding: '48px',
        maxWidth: '900px',
        boxShadow: colors.shadowSm,
      }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '12px',
          color: colors.textPrimary,
        }}>
          Layer ROI Weekly Report
        </h1>
        <p style={{
          color: colors.textSecondary,
          marginBottom: '32px',
          fontSize: '14px',
        }}>
          Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '20px',
          fontWeight: '600',
          marginTop: '32px',
          marginBottom: '16px',
          color: colors.textPrimary,
        }}>
          Executive Summary
        </h2>
        <p style={{
          fontSize: '15px',
          lineHeight: '1.7',
          marginBottom: '32px',
          color: colors.textSecondary,
        }}>
          Your AI agents spent <span style={{ color: colors.textPrimary, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>$5,340</span> this week with <span style={{ color: colors.accentGreen, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>$9,240</span> in estimated value generated. Overall ROI multiple: <span style={{ color: colors.accentGreen, fontWeight: '600', fontFamily: 'IBM Plex Mono, monospace' }}>1.73×</span>. One agent requires immediate attention.
        </p>

        <div style={{
          background: '#fef2f2',
          border: `1px solid ${colors.dangerRed}`,
          borderRadius: '8px',
          padding: '20px',
          marginTop: '24px',
        }}>
          <h3 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
            color: colors.dangerRed,
          }}>
            ⚠️ Top Recommendation
          </h3>
          <p style={{
            fontSize: '14px',
            color: colors.dangerRed,
            lineHeight: '1.6',
          }}>
            <strong>Retire the cost-optimizer agent</strong> — It has spent <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>$340</span> this month with <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>0.6× ROI</span>. Estimated monthly savings if paused: <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>$850</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
