import React from 'react';

const colors = {
  bgPrimary: '#fafaf9',
  bgSurface: '#ffffff',
  dangerRed: '#dc2626',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  borderDefault: 'rgba(0,0,0,0.08)',
};

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.bgPrimary,
          padding: '40px 20px',
          fontFamily: 'Inter, sans-serif',
        }}>
          <div style={{
            maxWidth: '600px',
            background: colors.bgSurface,
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            animation: 'fadeUp 400ms cubic-bezier(0.16,1,0.3,1) both',
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}>
              ⚠️
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '28px',
              fontWeight: '700',
              color: colors.textPrimary,
              marginBottom: '12px',
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: '16px',
              color: colors.textSecondary,
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error. Our team has been notified and will look into this.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                background: '#fef2f2',
                border: `1px solid ${colors.dangerRed}`,
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                textAlign: 'left',
                cursor: 'pointer',
              }}>
                <summary style={{
                  color: colors.dangerRed,
                  fontWeight: '600',
                  marginBottom: '12px',
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  fontSize: '12px',
                  overflow: 'auto',
                  padding: '12px',
                  background: '#ffffff',
                  borderRadius: '4px',
                  color: colors.dangerRed,
                }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  background: colors.textPrimary,
                  color: colors.bgSurface,
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  background: colors.bgSurface,
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderDefault}`,
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 200ms cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                Go Home
              </a>
            </div>

            {this.state.errorCount > 3 && (
              <p style={{
                marginTop: '24px',
                padding: '12px',
                background: '#fffbeb',
                border: `1px solid #fbbf24`,
                borderRadius: '6px',
                color: '#92400e',
                fontSize: '14px',
              }}>
                Multiple errors detected. Please clear your browser cache and try again.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
