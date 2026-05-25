const fs = require('fs');

const code = `import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMcqStore } from '../store/mcqStore';
import { mockQuestions } from '../utils/mockData';

export default function TestPage() {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    selectedAnswers, 
    timeRemaining, 
    startTest, 
    selectAnswer, 
    nextQuestion, 
    previousQuestion, 
    goToQuestion,
    submitTest,
    getCurrentQuestion
  } = useMcqStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Start mock test if not already started
    if (questions.length === 0) {
      startTest('topic_1', mockQuestions, 45 * 60); // 45 min
    }
  }, [questions, startTest]);

  const question = getCurrentQuestion();
  const currentAnswerId = question ? selectedAnswers[question.id] : null;

  const handleFinish = () => {
    // Generate mock results
    submitTest({ score: 85, correct: 2, total: 3 });
    navigate('/results');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return \`\${m}:\${s < 10 ? '0' : ''}\${s}\`;
  };

  if (!question) return <div className="p-8 text-center">Loading test...</div>;

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter py-4 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-sm lg:hidden">
        <div className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">QuizFlow</div>
        <button className="p-2 text-on-surface-variant bg-surface-container rounded-lg" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      <main className="flex-1 flex flex-col h-full pt-16 lg:pt-0 overflow-y-auto w-full lg:w-[calc(100%-16rem)]">
        <header className="w-full px-gutter md:px-margin-desktop py-6 max-w-max-width-content mx-auto flex flex-col gap-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-outline-variant/30">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Question {currentQuestionIndex + 1}</h1>
              <p className="font-label-md text-label-md text-on-surface-variant mt-1">Mock Test #42</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-primary font-stats-number text-stats-number animate-pulse-slow">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '\\'FILL\\' 1' }}>timer</span>
                {formatTime(timeRemaining)}
              </div>
              <span className="font-label-md text-label-md text-outline">Remaining Time</span>
            </div>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-xp-bar-fill rounded-full" style={{ width: \`\${((currentQuestionIndex + 1) / questions.length) * 100}%\` }}></div>
          </div>
        </header>

        <section className="flex-1 w-full px-gutter md:px-margin-desktop py-8 max-w-max-width-content mx-auto flex flex-col gap-8 pb-32">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant/50 shadow-sm">
            <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
              {question.text}
            </p>
            {question.codeSnippet && (
              <div className="mt-6 p-4 bg-inverse-surface rounded-lg font-label-md text-label-md text-inverse-on-surface overflow-x-auto">
                <pre><code>{question.codeSnippet}</code></pre>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {question.options.map((opt) => {
              const isSelected = currentAnswerId === opt.id;
              return (
                <label key={opt.id} className="option-card flex items-center p-4 md:p-6 rounded-xl cursor-pointer group">
                  <input 
                    className="sr-only peer" 
                    name={\`q\${question.id}\`} 
                    type="radio" 
                    value={opt.id} 
                    checked={isSelected}
                    onChange={() => selectAnswer(opt.id)}
                  />
                  <div className={\`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors \${isSelected ? 'border-2 border-primary bg-primary text-on-primary' : 'border-2 border-outline peer-checked:border-primary peer-checked:bg-primary text-transparent peer-checked:text-on-primary'}\`}>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <div className="flex-1 font-body-md text-body-md font-medium">
                    {opt.text}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <div className="fixed bottom-0 left-0 lg:left-0 lg:w-[calc(100%-16rem)] w-full bg-surface-container/90 backdrop-blur-md border-t border-outline-variant p-4 z-20">
          <div className="max-w-max-width-content mx-auto flex justify-between items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md text-label-md">
              <span className="material-symbols-outlined text-outline">flag</span>
              <span className="hidden sm:inline">Flag Question</span>
            </button>
            <div className="flex gap-4">
              <button 
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="btn-3d flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-highest border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-dim disabled:opacity-50">
                <span className="material-symbols-outlined">arrow_back</span>
                Previous
              </button>
              <button 
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn-3d flex items-center gap-2 px-8 py-3 rounded-xl bg-primary border-primary-fixed-dim text-on-primary font-label-md text-label-md hover:bg-surface-tint disabled:opacity-50">
                Next
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <aside className={\`fixed inset-y-0 right-0 transform \${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-surface-container-low dark:bg-surface-dark docked h-full w-64 border-l border-outline-variant dark:border-outline flex flex-col p-4 gap-4 shadow-lg lg:shadow-none overflow-y-auto\`}>
        <div className="flex flex-col mb-6 pt-16 lg:pt-0">
          <h2 className="font-headline-lg text-[20px] leading-tight text-on-surface dark:text-on-surface-variant font-bold">Question Navigator</h2>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">Mock Test #42</p>
        </div>

        <nav className="flex flex-col gap-2 mb-8">
          <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl hover:bg-surface-container-highest dark:hover:bg-inverse-surface transition-all press-down:translate-y-0.5 font-label-md text-label-md" href="#">
            <span className="material-symbols-outlined">grid_view</span> Overview
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold transition-all press-down:translate-y-0.5 font-label-md text-label-md" href="#">
            <span className="material-symbols-outlined">play_arrow</span> Current
          </a>
        </nav>

        <div className="flex-1">
          <h3 className="font-label-md text-label-md text-outline mb-3 uppercase tracking-wider text-xs">Jump to Question</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isCurrent = currentQuestionIndex === i;
              
              let btnClass = "aspect-square rounded-md flex items-center justify-center font-label-md text-label-md ";
              if (isCurrent) {
                btnClass += "nav-btn-current ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low";
              } else if (isAnswered) {
                btnClass += "bg-surface-variant text-on-surface-variant";
              } else {
                btnClass += "bg-surface text-on-surface-variant hover:bg-surface-container-high transition-colors";
              }

              return (
                <button 
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className={btnClass}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-outline-variant/50">
          <button 
            onClick={handleFinish}
            className="w-full btn-3d bg-error text-on-error py-3 rounded-xl font-label-md text-label-md border-error-container hover:bg-error/90 transition-colors">
            Finish Attempt
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div 
          className="fixed inset-0 bg-on-surface/50 z-30 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setMobileNavOpen(false)}
        ></div>
      )}
    </>
  );
}
\`;

fs.writeFileSync('src/pages/TestPage.jsx', code);
