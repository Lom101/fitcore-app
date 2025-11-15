import React from 'react'
import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  title?: string
  showChat?: boolean
}

const Header: React.FC<HeaderProps> = ({ title, showChat = true }) => {
  return (
    <header className="glass-card rounded-b-3xl p-6 mb-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          {title ? (
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          ) : (
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                FitCore
              </h1>
              <p className="text-slate-600 text-sm mt-1">Your fitness journey starts here</p>
            </div>
          )}
        </div>
        {showChat && (
          <Link
            to="/coach-chat"
            className="p-3 rounded-full gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <MessageCircle size={20} />
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
