import { useMcqStore } from '../store/mcqStore'
import { motion } from 'framer-motion'

export default function TestTimer({ onTimeUp }) {
  const { timeRemaining, totalTime } = useMcqStore()

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const percentage = (timeRemaining / totalTime) * 100

  const isWarning = timeRemaining < 300 // 5 minutes
  const isCritical = timeRemaining < 60 // 1 minute

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Time Remaining
        </span>
        <motion.span
          animate={{ color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981' }}
          className="text-2xl font-bold font-mono"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${percentage}%` }}
          className={`h-full transition-colors ${
            isCritical
              ? 'bg-danger'
              : isWarning
              ? 'bg-warning'
              : 'bg-success'
          }`}
        />
      </div>

      {/* Warning messages */}
      {isCritical && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-2 bg-danger/10 border border-danger/30 rounded text-danger text-sm text-center font-medium"
        >
          ⚠️ Time Running Out!
        </motion.div>
      )}
    </div>
  )
}
