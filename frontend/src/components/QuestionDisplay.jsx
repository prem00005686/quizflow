import { useMcqStore } from '../store/mcqStore'
import { motion } from 'framer-motion'

export default function QuestionDisplay() {
  const { getCurrentQuestion, getCurrentAnswer, selectAnswer } = useMcqStore()
  const question = getCurrentQuestion()

  if (!question) {
    return <div className="text-center py-8">No question available</div>
  }

  const options = question.options || []
  const currentAnswer = getCurrentAnswer()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={question.id}
      className="space-y-6"
    >
      {/* Question */}
      <div className="card">
        <div className="flex items-start gap-2">
          <span className="text-2xl">❓</span>
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {question.question_text}
            </p>
            {question.difficulty && (
              <div className="mt-3 flex gap-2">
                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                  {question.difficulty === 'easy' && '🟢 Easy'}
                  {question.difficulty === 'medium' && '🟡 Medium'}
                  {question.difficulty === 'hard' && '🔴 Hard'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectAnswer(option.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              currentAnswer === option.id
                ? 'border-primary bg-primary/10 dark:bg-primary/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  currentAnswer === option.id
                    ? 'border-primary bg-primary'
                    : 'border-gray-400 dark:border-gray-500'
                }`}
              >
                {currentAnswer === option.id && (
                  <span className="text-white text-sm">✓</span>
                )}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {option.text}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
