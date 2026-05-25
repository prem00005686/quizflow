import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMcqStore } from '../store/mcqStore';
import { mockQuestions } from '../utils/mockData';
import apiClient from '../utils/apiClient';
import MainHeader from '../components/MainHeader';

const PRACTICE_SUBJECTS = [
  {
    id: 'mathematics',
    label: 'Mathematics',
    description: 'Calculus & Algebra',
    icon: 'calculate',
    topicId: 'topic_1',
    accent: 'from-primary-container to-secondary-container'
  },
  {
    id: 'physics',
    label: 'Physics',
    description: 'Mechanics & Dynamics',
    icon: 'science',
    topicId: 'topic_1',
    accent: 'from-tertiary-container to-surface-container-highest'
  },
  {
    id: 'logic',
    label: 'Logic',
    description: 'Critical Reasoning',
    icon: 'psychology',
    topicId: 'topic_1',
    accent: 'from-secondary-container to-primary-container'
  }
]

export default function TestPage() {
  const navigate = useNavigate();
  const { 
    questions, 
    currentQuestionIndex, 
    selectedAnswers, 
    timeRemaining, 
    totalTime,
    startTest, 
    selectAnswer, 
    nextQuestion, 
    previousQuestion, 
    goToQuestion,
    submitTest,
    getCurrentQuestion,
    resetTest
  } = useMcqStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const loadQuestionsForSubject = async (subject) => {
    setSelectedSubject(subject);
    setLoadingQuestions(true);
    setMobileNavOpen(false);

    try {
      const response = await apiClient.get('/api/mcqs/questions', {
        params: {
          topicId: subject.topicId,
          count: 10
        }
      });

      const apiQuestions = (response.data.questions || []).map((question) => ({
        id: question.id,
        text: question.text || question.question_text,
        difficulty: question.difficulty,
        codeSnippet: question.codeSnippet || question.code_snippet || null,
        options: (question.options || []).map((option) => ({
          id: option.id,
          text: option.text
        }))
      }));

      if (apiQuestions.length > 0) {
        setLoadingQuestions(false);
        startTest(subject.topicId, apiQuestions, 45 * 60);
        return;
      }
    } catch (error) {
      console.warn('Falling back to mock questions:', error);
    }

    setLoadingQuestions(false);
    startTest(subject.topicId, mockQuestions, 45 * 60);
  };

  const resetSubjectSelection = () => {
    resetTest();
    setSelectedSubject(null);
    setLoadingQuestions(false);
    setMobileNavOpen(false);
  };

  const question = getCurrentQuestion();
  const currentAnswerId = question ? selectedAnswers[question.id] : null;
  const subjectLabel = selectedSubject?.label || 'Practice';
  const subjectDescription = selectedSubject?.description || 'Choose a subject to begin';

  const handleFinish = async () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctAnswer) {
        correctCount++;
      }
    });

    const timeTaken = Math.max(0, totalTime - timeRemaining);
    const payload = {
      topicId: selectedSubject?.topicId || 'topic_1',
      answers: selectedAnswers,
      timeTaken
    };

    try {
      const response = await apiClient.post('/api/mcqs/submit', payload);
      const submission = response.data.submission || {};

      submitTest({
        score: submission.percentage ?? Math.round((correctCount / questions.length) * 100),
        correct: submission.correct ?? submission.score ?? correctCount,
        total: submission.totalQuestions ?? submission.total ?? questions.length,
        xpEarned: submission.xpEarned ?? 0,
        testId: submission.id,
        questionDetails: response.data.questionDetails || null
      });
    } catch (error) {
      console.error('Backend submission failed, using local results:', error);

      submitTest({
        score: Math.round((correctCount / questions.length) * 100),
        correct: correctCount,
        total: questions.length
      });
    }

    navigate('/results');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!selectedSubject) {
    return (
      <>
        <MainHeader />

        <main className="min-h-screen pt-16 px-gutter py-10 md:py-16 bg-background">
          <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <section className="relative overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 md:p-12 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none"></div>
              <div className="relative flex flex-col gap-4 max-w-3xl">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant bg-surface px-4 py-2 font-label-md text-label-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">school</span>
                  Practice mode
                </span>
                <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface">
                  Choose a subject before you start.
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  Pick the area you want to work on. The test will load questions for that subject and save your attempt to your profile.
                </p>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PRACTICE_SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => loadQuestionsForSubject(subject)}
                  className={`text-left rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary`}
                >
                  <div className={`h-2 bg-gradient-to-r ${subject.accent}`}></div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>
                        {subject.icon}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="font-headline-lg text-headline-lg text-on-surface">{subject.label}</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">{subject.description}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 font-label-md text-label-md text-primary">
                      <span>Start practice</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </button>
              ))}
            </section>
          </div>
        </main>
      </>
    );
  }

  if (loadingQuestions || !question) return <div className="p-8 text-center flex-1">Loading {subjectLabel} questions...</div>;

  return (
    <>
      <MainHeader />

      <main className="flex-1 flex flex-col h-full pt-16 lg:pt-0 overflow-y-auto w-full lg:w-[calc(100%-16rem)]">
        <header className="w-full px-gutter md:px-margin-desktop py-6 max-w-max-width-content mx-auto flex flex-col gap-4 sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b border-outline-variant/30">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Question {currentQuestionIndex + 1}</h1>
              <p className="font-label-md text-label-md text-on-surface-variant mt-1">{subjectLabel} · {subjectDescription}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-primary font-stats-number text-stats-number animate-pulse-slow">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '\'FILL\' 1' }}>timer</span>
                {formatTime(timeRemaining)}
              </div>
              <span className="font-label-md text-label-md text-outline">Remaining Time</span>
            </div>
          </div>
          <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-xp-bar-fill rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
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
                    name={`q${question.id}`} 
                    type="radio" 
                    value={opt.id} 
                    checked={isSelected}
                    onChange={() => selectAnswer(opt.id)}
                  />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors ${isSelected ? 'border-2 border-primary bg-primary text-on-primary' : 'border-2 border-outline peer-checked:border-primary peer-checked:bg-primary text-transparent peer-checked:text-on-primary'}`}>
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
              {currentQuestionIndex === questions.length - 1 ? (
                <button 
                  onClick={handleFinish}
                  className="btn-3d flex items-center gap-2 px-8 py-3 rounded-xl bg-error border-error-container text-on-error font-label-md text-label-md hover:bg-error/90 disabled:opacity-50">
                  Finish
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
              ) : (
                <button 
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="btn-3d flex items-center gap-2 px-8 py-3 rounded-xl bg-primary border-primary-fixed-dim text-on-primary font-label-md text-label-md hover:bg-surface-tint disabled:opacity-50">
                  Next
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <aside className={`fixed inset-y-0 right-0 transform ${mobileNavOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-surface-container-low dark:bg-surface-dark docked h-full w-64 border-l border-outline-variant dark:border-outline flex flex-col p-4 gap-4 shadow-lg lg:shadow-none overflow-y-auto`}>
        <div className="flex flex-col mb-6 pt-16 lg:pt-0">
          <h2 className="font-headline-lg text-[20px] leading-tight text-on-surface dark:text-on-surface-variant font-bold">Question Navigator</h2>
          <p className="font-label-md text-label-md text-on-surface-variant mt-1">{subjectLabel}</p>
        </div>

        <nav className="flex flex-col gap-2 mb-8">
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl hover:bg-surface-container-highest dark:hover:bg-inverse-surface transition-all press-down:translate-y-0.5 font-label-md text-label-md cursor-pointer text-left">
            <span className="material-symbols-outlined">grid_view</span> Overview
          </button>
          <button className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold transition-all press-down:translate-y-0.5 font-label-md text-label-md cursor-pointer text-left">
            <span className="material-symbols-outlined">play_arrow</span> Current
          </button>
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
            onClick={resetSubjectSelection}
            className="w-full mb-3 btn-3d bg-surface-container-high text-on-surface py-3 rounded-xl font-label-md text-label-md border-outline-variant hover:bg-surface-container-highest transition-colors">
            Change Subject
          </button>
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