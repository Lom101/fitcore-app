import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Dumbbell, Apple, User, MessageCircle, Brain } from 'lucide-react'

const Navigation: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/training', icon: Dumbbell, label: 'Training' },
    { path: '/nutrition', icon: Apple, label: 'Nutrition' },
    { path: '/coach-panel', icon: Brain, label: 'Coach' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 shadow-2xl">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
