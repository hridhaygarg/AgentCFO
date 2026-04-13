import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { theme } from '../styles/theme';
import { AnimatedSection } from './AnimatedSection';

export default function SpendValueChart({ data, delay = 0 }) {
  return (
    <AnimatedSection animation="fadeUp" delay={delay}>
      <div style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '40px',
        transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }} onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }} onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <h3 style={{
          fontFamily: theme.fonts.serif,
          fontSize: '16px',
          marginBottom: '20px',
          color: theme.colors.text.primary,
          animation: 'fadeIn 400ms cubic-bezier(0.16,1,0.3,1) both 100ms',
        }}>
          Daily Spend vs Value Generated
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
            <XAxis dataKey="date" stroke={theme.colors.text.secondary} />
            <YAxis stroke={theme.colors.text.secondary} />
            <Tooltip
              contentStyle={{
                background: theme.colors.bg,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
              }}
              formatter={(value) => `$${value.toFixed(0)}`}
            />
            <Legend />
            <Bar
              dataKey="spend"
              fill="rgba(255,255,255,0.5)"
              name="Spend"
              style={{ animation: 'fadeIn 1200ms cubic-bezier(0.16,1,0.3,1) both 200ms' }}
            />
            <Bar
              dataKey="value"
              fill={theme.colors.accent}
              name="Value Generated"
              style={{ animation: 'fadeIn 1200ms cubic-bezier(0.16,1,0.3,1) both 400ms' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnimatedSection>
  );
}
