import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  gradient?: string
  progress?: number
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  gradient = 'gradient-primary',
  progress 
}) => {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
        {progress !== undefined && (
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-800">{progress}%</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-slate-600 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          {unit && <span className="text-slate-500 text-sm">{unit}</span>}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full animate-progress"
              style={{ '--progress-width': `${progress}%` } as React.CSSProperties}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
