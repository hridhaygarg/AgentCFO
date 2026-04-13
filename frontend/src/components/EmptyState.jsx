const colors = {
  bgPrimary: '#fafaf9',
  bgSurface: '#ffffff',
  bgSubtle: '#f5f5f4',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  borderDefault: 'rgba(0,0,0,0.08)',
  accentGreen: '#16a34a',
};

export default function EmptyState({
  title = 'No data available',
  description = 'Get started by adding your first item.',
  icon = '📭',
  action = null,
  actionText = 'Get Started',
  actionHref = '/dashboard',
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 40px',
      background: colors.bgSubtle,
      border: `1px dashed ${colors.borderDefault}`,
      borderRadius: '12px',
      textAlign: 'center',
      minHeight: '300px',
      animation: 'fadeUp 400ms cubic-bezier(0.16,1,0.3,1) both',
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '24px',
        opacity: 0.5,
      }}>
        {icon}
      </div>

      <h3 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: '8px',
        margin: '0 0 8px 0',
      }}>
        {title}
      </h3>

      <p style={{
        fontSize: '14px',
        color: colors.textSecondary,
        maxWidth: '400px',
        marginBottom: '24px',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        {description}
      </p>

      {(action || actionHref) && (
        action ? (
          <button
            onClick={action}
            style={{
              background: colors.accentGreen,
              color: colors.bgSurface,
              border: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(22,163,74,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {actionText}
          </button>
        ) : (
          <a
            href={actionHref}
            style={{
              background: colors.accentGreen,
              color: colors.bgSurface,
              textDecoration: 'none',
              padding: '10px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-block',
              transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
            }}
            onMouseEnter={(e) => {
              e.style.transform = 'translateY(-2px)';
              e.style.boxShadow = '0 4px 12px rgba(22,163,74,0.3)';
            }}
            onMouseLeave={(e) => {
              e.style.transform = 'translateY(0)';
              e.style.boxShadow = 'none';
            }}
          >
            {actionText}
          </a>
        )
      )}
    </div>
  );
}
