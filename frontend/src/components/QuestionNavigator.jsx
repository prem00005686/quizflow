import { useMcqStore } from '../store/mcqStore'
import { motion } from 'framer-motion'

export default function QuestionNavigator() {
  const { questions, currentQuestionIndex, goToQuestion, selectedAnswers } = useMcqStore()

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
        Questions ({currentQuestionIndex + 1} of {questions.length})
      </p>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {questions.map((question, index) => {
          const isAnswered = !!selectedAnswers[question.id]
          const isActive = index === currentQuestionIndex

          return (
            <motion.button
              key={question.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToQuestion(index)}
              className={`aspect-square rounded-lg font-medium text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white scale-110'
                  : isAnswered
                  ? 'bg-success/20 text-success border-2 border-success'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {index + 1}
            </motion.button>
          )
        })}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          Current
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          Answered
        </div>
      </div>
    </div>
  )
}
