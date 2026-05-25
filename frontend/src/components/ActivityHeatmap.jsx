import { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * ActivityHeatmap Component
 * 
 * Displays a GitHub-style activity calendar showing daily contribution intensity.
 * Each day is a colored square representing activity level.
 * 
 * Props:
 *   data: Array of { date: 'YYYY-MM-DD', count: number }
 *   year: Year to display (default: current year)
 *   onDayClick: Callback when day is clicked
 */
export default function ActivityHeatmap({ 
  data = [], 
  year = new Date().getFullYear(),
  onDayClick = () => {}
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 }
    }
  }

  const cellVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }

  // Convert data array to map for faster lookup
  const activityMap = useMemo(() => {
    const map = new Map()
    data.forEach(item => {
      map.set(item.date, item.count || 0)
    })
    return map
  }, [data])

  // Calculate all days in the year
  const days = useMemo(() => {
    const result = []
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        count: activityMap.get(dateStr) || 0,
        day: d.getDay(),
        weekInYear: getWeekNumber(d)
      })
    }
    return result
  }, [year, activityMap])

  // Group days by week
  const weeks = useMemo(() => {
    const weeksMap = new Map()
    days.forEach(day => {
      const week = day.weekInYear
      if (!weeksMap.has(week)) {
        weeksMap.set(week, [])
      }
      weeksMap.get(week).push(day)
    })
    return Array.from(weeksMap.values())
  }, [days])

  // Get intensity color based on activity count
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700'
    if (count <= 5) return 'bg-green-100 dark:bg-green-900/30'
    if (count <= 10) return 'bg-green-300 dark:bg-green-700/50'
    if (count <= 20) return 'bg-green-500 dark:bg-green-600'
    return 'bg-green-700 dark:bg-green-500'
  }

  // Get intensity level text
  const getIntensityText = (count) => {
    if (count === 0) return 'No activity'
    if (count === 1) return '1 question'
    return `${count} questions`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Activity Heatmap - {year}
        </h3>
        <div className="flex gap-2 items-center text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded ${getColor(i === 0 ? 0 : i * 5)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
      >
        {/* Weeks Grid */}
        <div className="flex gap-1" style={{ minWidth: 'fit-content' }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {/* Fill empty days at start */}
              {weekIndex === 0 && new Date(year, 0, 1).getDay() > 0 && (
                Array(new Date(year, 0, 1).getDay())
                  .fill(0)
                  .map((_, i) => (
                    <div key={`empty-${i}`} className="w-3 h-3" />
                  ))
              )}

              {/* Days in week */}
              {week.map((day) => (
                <motion.div
                  key={day.date}
                  variants={cellVariants}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDayClick(day)}
                  className={`w-3 h-3 rounded-sm cursor-pointer transition-all ${getColor(
                    day.count
                  )} hover:ring-2 hover:ring-primary hover:ring-offset-1 dark:hover:ring-offset-gray-800`}
                  title={`${day.date}: ${getIntensityText(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Legend and Stats */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-2 rounded" style={{ backgroundColor: '#F5F1EA' }}>
          <p className="text-gray-600 dark:text-gray-400">Total Days</p>
          <p className="text-xl font-bold text-primary">
            {days.filter(d => d.count > 0).length}
          </p>
        </div>
        <div className="p-2 rounded" style={{ backgroundColor: '#F5F1EA' }}>
          <p className="text-gray-600 dark:text-gray-400">Total Questions</p>
          <p className="text-xl font-bold text-secondary">
            {days.reduce((sum, d) => sum + d.count, 0)}
          </p>
        </div>
        <div className="p-2 rounded" style={{ backgroundColor: '#F5F1EA' }}>
          <p className="text-gray-600 dark:text-gray-400">Best Day</p>
          <p className="text-xl font-bold text-success">
            {Math.max(...days.map(d => d.count), 0)}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
        💡 Tip: Darker squares = more activity. Hover over squares to see details.
      </div>
    </div>
  )
}

/**
 * Helper function to get ISO week number
 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
