import React from 'react'
import Navigation from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <Navigation />
    </div>
  )
}

export default Layout
