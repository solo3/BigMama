import React from 'react';
import { Header } from '../Header/Header';
import { Navigation } from '../Navigation/Navigation';
import { OfflineIndicator } from '../OfflineIndicator';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <div className="layout-body">
                <Navigation />
                <main className="layout-main">
                    <div className="fade-in">
                        {children}
                    </div>
                </main>
            </div>
            <OfflineIndicator />
        </div>
    );
};
