import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)'
                }}>
                    <AlertTriangle size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>משהו השתבש...</h1>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        אל דאגה, זה קורה לטובים ביותר. נסה לרענן את העמוד.
                    </p>
                    <button
                        onClick={this.handleRetry}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <RefreshCw size={20} />
                        נסה שוב
                    </button>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            textAlign: 'left',
                            maxWidth: '800px',
                            overflow: 'auto'
                        }}>
                            <p style={{ color: '#db4c3f', fontWeight: 'bold' }}>Error Details (Dev Only):</p>
                            <pre style={{ margin: 0 }}>{this.state.error.toString()}</pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
