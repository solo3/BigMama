import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import './DevLogger.css';

export const DevLogger: React.FC = () => {
    const { user, familyId, loading, loadingFamily } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (!import.meta.env.DEV) return;

        const originalConsoleError = console.error;
        const originalConsoleLog = console.log;

        console.log = (...args) => {
            setLogs((prev) => [...prev.slice(-19), `[LOG] ${args.join(' ')}`]);
            originalConsoleLog.apply(console, args);
        };

        console.error = (...args) => {
            setLogs((prev) => [...prev.slice(-19), `[ERR] ${args.join(' ')}`]);
            originalConsoleError.apply(console, args);
        };

        return () => {
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
        };
    }, []);

    if (!import.meta.env.DEV) return null;

    return (
        <div className={`dev-logger ${isOpen ? 'open' : ''}`}>
            <button className="dev-logger-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '❌ Close Debug' : '🛠️ Debug State'}
            </button>

            {isOpen && (
                <div className="dev-logger-content">
                    <div className="debug-section">
                        <h4>Auth State</h4>
                        <p><strong>UID:</strong> {user?.uid || 'Not Logged In'}</p>
                        <p><strong>Family ID:</strong> {familyId || 'None'}</p>
                        <p><strong>Status:</strong> {loading ? 'Loading Auth...' : loadingFamily ? 'Loading Family...' : 'Ready'}</p>
                    </div>

                    <div className="debug-section">
                        <h4>Recent Logs</h4>
                        <div className="log-container">
                            {logs.map((log, i) => (
                                <div key={i} className={`log-line ${log.startsWith('[ERR]') ? 'error' : ''}`}>
                                    {log}
                                </div>
                            ))}
                            {logs.length === 0 && <p className="text-secondary">No logs yet...</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
