import { useState } from 'react';
import { theme } from '../styles/theme';

export default function Signup({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://agentcfo-production.up.railway.app/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Success - show API key and redirect
      alert(`Account created!\n\nAPI Key: ${data.apiKey}\n\nCheck your email for setup instructions.`);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontFamily: theme.fonts.serif, fontSize: '32px', marginBottom: '8px', color: theme.colors.text.primary }}>
          Start Free
        </h1>
        <p style={{ fontFamily: theme.fonts.mono, fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '32px' }}>
          14 days, 2 agents, full access
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: theme.colors.text.secondary, display: 'block', marginBottom: '8px' }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body,
              }}
            />
          </div>

          <div>
            <label style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: theme.colors.text.secondary, display: 'block', marginBottom: '8px' }}>
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body,
              }}
            />
          </div>

          <div>
            <label style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: theme.colors.text.secondary, display: 'block', marginBottom: '8px' }}>
              Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              required
              style={{
                width: '100%',
                padding: '12px',
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '6px',
                color: theme.colors.text.primary,
                fontFamily: theme.fonts.body,
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: `${theme.colors.danger}20`,
              border: `1px solid ${theme.colors.danger}`,
              borderRadius: '6px',
              color: theme.colors.danger,
              fontSize: '12px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: theme.colors.accent,
              color: theme.colors.bg,
              border: 'none',
              borderRadius: '6px',
              fontFamily: theme.fonts.mono,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </button>

          <p style={{ fontFamily: theme.fonts.mono, fontSize: '11px', color: theme.colors.text.secondary, textAlign: 'center' }}>
            No credit card required. Instant setup.
          </p>
        </form>
      </div>
    </div>
  );
}
