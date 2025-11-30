import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for now; can be sent to reporting service
    // eslint-disable-next-line no-console
    console.error('Unhandled render error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <p>There was an unexpected error rendering this page. Try refreshing, or contact support if the problem persists.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {String(this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error)}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
