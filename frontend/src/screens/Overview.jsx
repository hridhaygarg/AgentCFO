import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const colors = {
  bgPrimary: '#fafaf9',
  bgSurface: '#ffffff',
  bgSubtle: '#f5f5f4',
  bgProfit: '#f0fdf4',
  borderDefault: 'rgba(0,0,0,0.08)',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  accentGreen: '#16a34a',
  accentGreenLight: '#dcfce7',
  accentGreenBorder: '#86efac',
  dangerRed: '#dc2626',
  shadowSm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
};

export default function Overview() {
  const metrics = {
    totalSpend: 12400,
    valueGenerated: 52100,
    roiMultiple: 4.2,
    wastefulSpend: 340,
  };

  const agents = [
    { id: 1, name: 'data-enrichment', cost: 4200, tasks: 150, value: 8500, roi: 2.0 },
    { id: 2, name: 'document-classifier', cost: 800, tasks: 200, value: 1200, roi: 1.5 },
    { id: 3, name: 'cost-optimizer', cost: 340, tasks: 10, value: 200, roi: 0.6 },
  ];

  const chartData = agents.map(agent => ({
    name: agent.name,
    cost: agent.cost,
    value: agent.value,
    roi: agent.roi,
  }));

  return (
    <div>
      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {/* Total Spend Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Total AI Spend
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.dangerRed,
            marginBottom: '8px',
          }}>
            ${metrics.totalSpend.toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            this month
          </div>
        </div>

        {/* Value Generated Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Value Generated
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.accentGreen,
            marginBottom: '8px',
          }}>
            ${metrics.valueGenerated.toLocaleString()}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            estimated value
          </div>
        </div>

        {/* ROI Multiple Card */}
        <div style={{
          background: colors.bgProfit,
          border: `1px solid ${colors.accentGreenBorder}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Net ROI Multiple
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.accentGreen,
            marginBottom: '8px',
          }}>
            {metrics.roiMultiple}×
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            profitable return
          </div>
        </div>

        {/* Wasteful Spend Card */}
        <div style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.borderDefault}`,
          borderRadius: '8px',
          padding: '24px',
          boxShadow: colors.shadowSm,
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'IBM Plex Mono, monospace',
            color: colors.textTertiary,
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Wasteful Spend
          </div>
          <div style={{
            fontSize: '36px',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: colors.dangerRed,
            marginBottom: '8px',
          }}>
            ${metrics.wastefulSpend}
          </div>
          <div style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontFamily: 'Inter, sans-serif',
          }}>
            being burned
          </div>
        </div>
      </div>

      {/* Agent Cost Chart */}
      <div style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '40px',
        boxShadow: colors.shadowSm,
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: '24px',
        }}>
          Cost by Agent
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.borderDefault} />
            <XAxis dataKey="name" tick={{ fill: colors.textSecondary, fontSize: 12 }} />
            <YAxis tick={{ fill: colors.textSecondary, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: colors.bgSurface,
                border: `1px solid ${colors.borderDefault}`,
                borderRadius: '6px',
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="cost" fill={colors.accentGreen} name="Cost" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Agent P&L Table */}
      <div style={{
        background: colors.bgSurface,
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: '8px',
        padding: '24px',
        boxShadow: colors.shadowSm,
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '18px',
          fontWeight: '600',
          color: colors.textPrimary,
          marginBottom: '24px',
        }}>
          Agent P&L
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.borderDefault}` }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '12px',
                }}>Agent</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>Cost (30d)</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>Tasks</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>Value Generated</th>
                <th style={{
                  padding: '12px',
                  textAlign: 'right',
                  color: colors.textSecondary,
                  fontWeight: '600',
                  fontSize: '12px',
                  fontFamily: 'IBM Plex Mono, monospace',
                }}>ROI</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => (
                <tr key={agent.id} style={{
                  borderBottom: i < agents.length - 1 ? `1px solid ${colors.borderDefault}` : 'none',
                  background: i % 2 === 0 ? 'transparent' : colors.bgSubtle,
                }}>
                  <td style={{
                    padding: '12px',
                    color: colors.textPrimary,
                    fontWeight: '500',
                  }}>{agent.name}</td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textPrimary,
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>${agent.cost.toLocaleString()}</td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.textSecondary,
                    fontFamily: 'IBM Plex Mono, monospace',
                  }}>{agent.tasks}</td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: colors.accentGreen,
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontWeight: '600',
                  }}>${agent.value.toLocaleString()}</td>
                  <td style={{
                    padding: '12px',
                    textAlign: 'right',
                    color: agent.roi > 1 ? colors.accentGreen : colors.dangerRed,
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontWeight: '600',
                  }}>{agent.roi}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
