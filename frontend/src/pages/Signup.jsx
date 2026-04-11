import { useState } from 'react';

const colors = {
  bg: '#080808',
  card: '#141414',
  elevated: '#1a1a1a',
  border: 'rgba(255,255,255,0.06)',
  borderBright: 'rgba(255,255,255,0.18)',
  textPrimary: '#e8e6e1',
  textSecondary: 'rgba(232,230,225,0.55)',
  textTertiary: 'rgba(232,230,225,0.28)',
  accentGreen: '#c8f264',
  accentGreenBorder: 'rgba(200,242,100,0.2)',
  dangerRed: '#ff4d4d',
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [apiKey, setApiKey] = useState('');

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
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setSuccess(true);
      setApiKey(data.apiKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: colors.bg, color: colors.textPrimary, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: ${colors.accentGreen}; color: ${colors.bg}; }
      `}</style>

      {/* Left side */}
      <div
        style={{
          width: '40%',
          padding: '60px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          animation: 'slideInLeft 600ms ease',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '60px' }}>
          <div style={{ width: '10px', height: '10px', background: colors.accentGreen, borderRadius: '50%' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: '600', letterSpacing: '1px' }}>Layer ROI</span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'DM Serif Display, serif',
            fontSize: '42px',
            fontWeight: '400',
            marginBottom: '40px',
            lineHeight: 1.3,
          }}
        >
          Start seeing your agent ROI today
        </h1>

        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '80px' }}>
          {[
            '15-minute setup, no engineering changes',
            'Live P&L for every agent immediately',
            'Free for up to 2 agents, forever',
          ].map((benefit, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: `fadeUp 500ms ease ${i * 80}ms backwards`,
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: colors.accentGreen,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.bg,
                  fontWeight: '700',
                  fontSize: '12px',
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: '16px', color: colors.textSecondary, fontWeight: 300 }}>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '40px' }}>
          <p
            style={{
              fontSize: '15px',
              color: colors.textSecondary,
              fontStyle: 'italic',
              marginBottom: '12px',
              lineHeight: 1.6,
            }}
          >
            "We found $11,000/month in wasteful agent spending in our first week."
          </p>
          <p style={{ fontSize: '13px', color: colors.textTertiary, fontFamily: 'DM Mono, monospace' }}>
            VP Engineering, Series B SaaS
          </p>
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          width: '60%',
          padding: '60px 60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'slideInRight 600ms ease',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '400px',
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            padding: '48px 40px',
          }}
        >
          {!success ? (
            <>
              <h2
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '28px',
                  marginBottom: '32px',
                  fontWeight: '400',
                }}
              >
                Create your account
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Name field */}
                <div style={{ animation: 'fadeUp 500ms ease 100ms backwards' }}>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: colors.textSecondary, fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: colors.elevated,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      color: colors.textPrimary,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      transition: 'all 200ms ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accentGreenBorder;
                      e.target.style.background = colors.bg;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.background = colors.elevated;
                    }}
                  />
                </div>

                {/* Email field */}
                <div style={{ animation: 'fadeUp 500ms ease 200ms backwards' }}>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: colors.textSecondary, fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Work email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: colors.elevated,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      color: colors.textPrimary,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      transition: 'all 200ms ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accentGreenBorder;
                      e.target.style.background = colors.bg;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.background = colors.elevated;
                    }}
                  />
                </div>

                {/* Company field */}
                <div style={{ animation: 'fadeUp 500ms ease 300ms backwards' }}>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: colors.textSecondary, fontWeight: '500', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Company name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: colors.elevated,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '6px',
                      color: colors.textPrimary,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      transition: 'all 200ms ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accentGreenBorder;
                      e.target.style.background = colors.bg;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.background = colors.elevated;
                    }}
                  />
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      padding: '12px 14px',
                      background: `rgba(255, 77, 77, 0.08)`,
                      border: `1px solid ${colors.dangerRed}`,
                      borderRadius: '6px',
                      color: colors.dangerRed,
                      fontSize: '13px',
                      animation: 'fadeUp 300ms ease',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: colors.accentGreen,
                    color: colors.bg,
                    border: 'none',
                    borderRadius: '6px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 200ms ease',
                  }}
                  onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')}
                  onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                >
                  {loading ? 'Creating account...' : 'Get started free →'}
                </button>
              </form>

              {/* CTA text */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ fontSize: '12px', color: colors.textTertiary, fontFamily: 'DM Mono, monospace' }}>
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', animation: 'fadeUp 500ms ease' }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>✓</div>
              <h2
                style={{
                  fontFamily: 'DM Serif Display, serif',
                  fontSize: '28px',
                  marginBottom: '24px',
                  fontWeight: '400',
                }}
              >
                Account created!
              </h2>
              <p style={{ color: colors.textSecondary, fontSize: '14px', marginBottom: '32px' }}>
                Here's your API key. Keep it safe and add it to your environment.
              </p>

              {/* API Key block */}
              <div
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.borderBright}`,
                  borderRadius: '6px',
                  padding: '16px',
                  marginBottom: '24px',
                  position: 'relative',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '13px',
                  color: colors.accentGreen,
                  wordBreak: 'break-all',
                  textAlign: 'left',
                }}
              >
                {apiKey}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(apiKey);
                    alert('Copied to clipboard!');
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: colors.accentGreen,
                    color: colors.bg,
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Copy
                </button>
              </div>

              <p style={{ color: colors.textTertiary, fontSize: '12px', marginBottom: '32px' }}>
                Check your email for setup instructions. You're ready to go!
              </p>

              <a
                href="/dashboard"
                style={{
                  display: 'inline-block',
                  background: colors.accentGreen,
                  color: colors.bg,
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 200ms ease',
                }}
                onMouseDown={(e) => (e.target.style.transform = 'scale(0.97)')}
                onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
              >
                Go to dashboard →
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
