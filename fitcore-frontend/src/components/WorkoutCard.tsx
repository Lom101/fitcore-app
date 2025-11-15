import React from 'react'
import { Clock, CheckCircle2 } from 'lucide-react'

interface WorkoutCardProps {
  title: string
  time: string
  completed?: boolean
  onClick?: () => void
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, time, completed = false, onClick }) => {
  return (
    <div 
      className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        completed ? 'bg-accent-50/80 border-accent-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={16} />
            <span className="text-sm">{time}</span>
          </div>
        </div>
        {completed && (
          <CheckCircle2 className="text-accent-500" size={24} />
        )}
      </div>
    </div>
  )
}

export default WorkoutCard
