/**
 * Error boundary component to catch React errors gracefully
 */
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You can log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f1f5f9',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            padding: '40px',
            textAlign: 'center',
            background: '#ffffff',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px',
            }}>
              ⚠️
            </div>
            
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '12px',
            }}>
              Something went wrong
            </h1>
            
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              We encountered an unexpected error. Please try reloading the page or contact support if the problem persists.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '24px',
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#008891',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.background = '#006b73'}
                onMouseOut={(e) => e.target.style.background = '#008891'}
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  background: '#f1f5f9',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
              >
                Reload Page
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginTop: '24px', 
                textAlign: 'left',
                background: '#fef2f2',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #fecaca',
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: '#991b1b',
                  marginBottom: '8px',
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ 
                  background: '#fff', 
                  padding: '12px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#7f1d1d',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  <strong>Error:</strong> {this.state.error?.toString()}
                  {'\n\n'}
                  <strong>Stack:</strong> {this.state.error?.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;