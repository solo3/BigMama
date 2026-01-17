import React from 'react';
import { Header } from '../Header/Header';
import { Navigation } from '../Navigation/Navigation';
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
                    {children}
                </main>
            </div>
        </div>
    );
};
