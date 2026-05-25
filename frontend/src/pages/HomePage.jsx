import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainHeader from '../components/MainHeader';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  return (
    <>
      <MainHeader />
<main className="pt-24 pb-16">
{/*  Hero Section  */}
<section className="relative max-w-7xl mx-auto px-gutter pt-16 pb-24 md:pt-32 md:pb-40 flex flex-col items-center text-center">
{/*  Decorative background blob  */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px] opacity-20 -z-10 pointer-events-none"></div>
<h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface max-w-4xl mb-6">
                Master complex subjects in <span className="text-primary">The Flow State</span>.
            </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
                Professional-grade learning disguised as a game. Build unstoppable streaks, track your knowledge with GitHub-style heatmaps, and dominate the leaderboard.
            </p>
<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
<Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn-3d bg-primary text-on-primary border-on-primary-fixed font-label-md text-label-md py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90">
<span>{isAuthenticated ? "Go to Dashboard" : "Start Learning Free"}</span>
<span className="material-symbols-outlined text-lg">arrow_forward</span>
</Link>
<button className="btn-3d bg-surface-container-lowest text-on-surface border-outline-variant font-label-md text-label-md py-4 px-8 rounded-lg flex items-center justify-center gap-2 border hover:bg-surface-container-low">
<span className="material-symbols-outlined text-lg">play_circle</span>
<span>See how it works</span>
</button>
</div>
</section>
{/*  Bento Grid Value Props  */}
<section className="max-w-7xl mx-auto px-gutter py-16">
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
{/*  Gamified Learning (Large)  */}
<div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors shadow-sm">
<div className="absolute -right-10 -top-10 w-64 h-64 bg-surface-variant rounded-full blur-3xl opacity-50 group-hover:bg-primary-container transition-colors duration-500"></div>
<div className="relative z-10 flex flex-col h-full justify-between">
<div>
<span className="material-symbols-outlined text-4xl text-primary mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>sports_esports</span>
<h3 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">Addictive Learning Loops</h3>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                                We replaced boring textbooks with dopamine-driven mechanics. Earn XP, level up your profile, and feel the rush of physical push-buttons with every correct answer.
                            </p>
</div>
{/*  Visual representation of an XP bar  */}
<div className="mt-8 bg-surface-container-high rounded-full h-4 w-full max-w-sm overflow-hidden border border-outline-variant">
<div className="h-full bg-xp-bar-fill w-[75%] rounded-full relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
</div>
</div>
</div>
</div>
{/*  Competitive Streaks  */}
<div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 flex flex-col justify-between hover:border-streak-flame/50 transition-colors shadow-sm">
<div>
<span className="material-symbols-outlined text-4xl text-streak-flame mb-4 block" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_fire_department</span>
<h3 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">Forged in Fire</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                            Maintain your daily streak to unlock exclusive avatars and multiply your XP gains. Don't let the flame die.
                        </p>
</div>
<div className="mt-4 flex items-end gap-2">
<span className="font-stats-number text-[48px] leading-none text-on-surface">42</span>
<span className="font-label-md text-label-md text-on-surface-variant mb-1">Day Streak</span>
</div>
</div>
{/*  Real-time Analytics  */}
<div className="bg-surface-dark text-surface border border-outline rounded-2xl p-8 flex flex-col justify-between md:col-span-3 lg:col-span-1 shadow-sm">
<div>
<span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4 block">monitoring</span>
<h3 className="font-headline-lg text-headline-lg-mobile text-surface-container-lowest mb-2">Surgical Precision</h3>
<p className="font-body-md text-body-md text-surface-variant">
                            Identify your weak points instantly. Our real-time analytics engine categorizes your performance down to the micro-topic level.
                        </p>
</div>
{/*  Minimal bar chart mockup  */}
<div className="flex items-end gap-3 h-24 mt-6 opacity-80">
<div className="w-1/4 bg-error-rose h-[30%] rounded-t-sm"></div>
<div className="w-1/4 bg-tertiary-fixed-dim h-[60%] rounded-t-sm"></div>
<div className="w-1/4 bg-heatmap-active h-[90%] rounded-t-sm"></div>
<div className="w-1/4 bg-secondary-fixed h-[100%] rounded-t-sm"></div>
</div>
</div>
{/*  Empty space filler for layout symmetry if needed, or another feature  */}
<div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex items-center justify-between shadow-sm overflow-hidden relative">
<div className="z-10 max-w-lg">
<h3 className="font-headline-lg text-headline-lg-mobile text-on-surface mb-2">Tactile Interface</h3>
<p className="font-body-md text-body-md text-on-surface-variant">
                            Every interaction is designed to feel physical. High-contrast typography and "squishy" buttons keep you grounded during intense focus sessions.
                        </p>
</div>
{/*  Abstract geometric representation of tactile buttons  */}
<div className="hidden lg:flex gap-4 absolute right-8 top-1/2 -translate-y-1/2 rotate-12 opacity-50">
<div className="w-16 h-16 bg-surface border border-outline-variant rounded-lg border-b-[6px] border-outline"></div>
<div className="w-16 h-16 bg-primary text-on-primary border border-on-primary-fixed rounded-lg border-b-[6px] border-on-primary-fixed flex items-center justify-center translate-y-2">
<span className="material-symbols-outlined">check</span>
</div>
</div>
</div>
</div>
</section>
{/*  Heatmap Preview Section  */}
<section className="py-20 bg-surface-container-lowest border-y border-outline-variant mt-16">
<div className="max-w-7xl mx-auto px-gutter flex flex-col items-center text-center">
<span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4 block">Visual Evidence</span>
<h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">Track Your Consistency</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
                    Build an undeniable record of your effort. Our activity heatmap makes your learning history visible, motivating you to keep the board green.
                </p>
{/*  Heatmap Container  */}
<div className="w-full max-w-[900px] overflow-x-auto no-scrollbar bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
<div className="flex gap-1 min-w-max" id="heatmap-grid">
{Array.from({ length: 52 }).map((_, weekIdx) => (
  <div key={weekIdx} className="flex flex-col gap-1">
    {Array.from({ length: 7 }).map((_, dayIdx) => {
      // Simulate random activity for the landing page
      const rand = Math.random();
      let opacityClass = 'opacity-10';
      if (rand > 0.8) opacityClass = 'opacity-100';
      else if (rand > 0.6) opacityClass = 'opacity-70';
      else if (rand > 0.4) opacityClass = 'opacity-40';
      return (
        <div 
          key={dayIdx} 
          className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] bg-heatmap-active ${opacityClass} transition-colors duration-300 hover:ring-1 hover:ring-on-surface cursor-crosshair`}
        ></div>
      );
    })}
  </div>
))}
</div>
<div className="flex justify-end items-center gap-2 mt-4 font-label-md text-[12px] text-on-surface-variant">
<span>Less</span>
<div className="w-3 h-3 rounded-[2px] bg-heatmap-base"></div>
<div className="w-3 h-3 rounded-[2px] bg-heatmap-active opacity-40"></div>
<div className="w-3 h-3 rounded-[2px] bg-heatmap-active opacity-70"></div>
<div className="w-3 h-3 rounded-[2px] bg-heatmap-active"></div>
<span>More</span>
</div>
</div>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full py-12 px-gutter flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-dim border-t border-outline-variant">
<div className="flex flex-col items-center md:items-start gap-2">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface text-2xl" style={{ fontVariationSettings: '\'FILL\' 1' }}>view_cozy</span>
<span className="font-headline-lg text-[20px] text-on-surface font-bold tracking-tight">QuizFlow</span>
</div>
<p className="font-body-md text-[14px] text-on-surface-variant">© 2024 QuizFlow Gaming Education. All rights reserved.</p>
</div>
<nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
<a className="font-label-md text-label-md text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Privacy Policy</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Terms of Service</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Help Center</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:underline decoration-primary transition-all" href="#">API</a>
<a className="font-label-md text-label-md text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Discord</a>
</nav>
</footer>
{/*  Interactive Scripts  */}


    </>
  );
}
