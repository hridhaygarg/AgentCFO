import { theme } from '../styles/theme';
import { AnimatedSection } from './AnimatedSection';

export default function MetricCard({ label, value, unit, color = 'primary', isLarge = false, delay = 0 }) {
  const colorMap = {
    primary: theme.colors.accent,
    danger: theme.colors.danger,
    warning: theme.colors.warning,
  };

  return (
    <AnimatedSection animation="fadeUp" delay={delay}>
      <div className="card-hover" style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '24px',
        flex: 1,
        transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }} onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <div style={{
          fontSize: '12px',
          color: theme.colors.text.tertiary,
          fontFamily: theme.fonts.mono,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          animation: 'fadeIn 400ms cubic-bezier(0.16,1,0.3,1) both 100ms',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: isLarge ? '36px' : '24px',
          fontFamily: theme.fonts.serif,
          color: colorMap[color],
          fontWeight: 'bold',
          animation: 'fadeIn 600ms cubic-bezier(0.16,1,0.3,1) both 200ms',
        }}>
          {value}
        </div>
        <div style={{
          fontSize: '12px',
          color: theme.colors.text.secondary,
          marginTop: '8px',
          fontFamily: theme.fonts.mono,
          animation: 'fadeIn 400ms cubic-bezier(0.16,1,0.3,1) both 300ms',
        }}>
          {unit}
        </div>
      </div>
    </AnimatedSection>
  );
}
