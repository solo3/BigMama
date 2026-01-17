import React from 'react'
import './Layout.css'

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="layout">
            <header className="header">
                <h1>BigMama</h1>
            </header>
            <main className="main-content">
                {children}
            </main>
            <nav className="bottom-nav">
                {/* Navigation items will go here */}
            </nav>
        </div>
    )
}
