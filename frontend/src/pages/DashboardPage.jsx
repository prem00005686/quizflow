import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../utils/apiClient';
import { useActivityData } from '../hooks/useActivityData';
import MainHeader from '../components/MainHeader';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: activityData } = useActivityData();

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Student';

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [profileResponse, statsResponse, streakResponse, historyResponse] = await Promise.allSettled([
          apiClient.get('/api/users/profile'),
          apiClient.get('/api/users/stats'),
          apiClient.get('/api/users/streak'),
          apiClient.get('/api/mcqs/history', { params: { limit: 5, offset: 0 } })
        ]);

        if (!mounted) return;

        if (profileResponse.status === 'fulfilled') {
          setProfile(profileResponse.value.data.user || null);
        }

        if (statsResponse.status === 'fulfilled') {
          setStats(statsResponse.value.data.stats || null);
        }

        if (streakResponse.status === 'fulfilled') {
          setStreak(streakResponse.value.data.streak || null);
        }

        if (historyResponse.status === 'fulfilled') {
          setRecentHistory(historyResponse.value.data.submissions || []);
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const totalXp = stats?.total_xp || 0;
  const level = stats?.level || 1;
  const streakCount = streak?.count ?? stats?.streak_count ?? 0;
  const currentXp = totalXp % 1000;
  const xpToNext = 1000;
  const xpProgress = Math.min((currentXp / xpToNext) * 100, 100);
  const heatmapCounts = new Map(activityData.map((item) => [item.date, item.count]));
  const recentRows = recentHistory.map((item) => ({
    date: item.submitted_at ? new Date(item.submitted_at).toLocaleDateString() : '—',
    subject: item.topic_id || 'Practice Test',
    score: item.total_questions ? `${Math.round((item.score / item.total_questions) * 100)}%` : `${item.score || 0}%`,
    status: item.score >= Math.ceil((item.total_questions || 1) * 0.75) ? 'Excellent' : 'Good'
  }));

  return (
    <>
      <MainHeader />
{/*  Main Content Canvas  */}
<main className="flex-grow w-full max-w-max-width-content mx-auto px-gutter py-8 mt-16 md:py-margin-desktop flex flex-col gap-8">
{/*  Welcome Header  */}
<section className="flex flex-col gap-2">
<h2 className="font-headline-xl text-headline-xl text-on-surface">Dashboard</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Welcome back, {displayName}. You're making steady progress.</p>
</section>
{/*  Stats Bento Grid  */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
{/*  XP & Level Card  */}
<div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-center gap-4 shadow-sm relative overflow-hidden group">
{/*  Subtle background decorative element  */}
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
<div className="flex justify-between items-end">
<div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Level</span>
<div className="font-headline-lg text-headline-lg text-primary mt-1">Level {loading ? '...' : level}</div>
</div>
<div className="text-right">
<span className="font-body-md text-body-md text-on-surface-variant">{loading ? 'Loading XP...' : `${currentXp} / ${xpToNext} XP`}</span>
</div>
</div>
{/*  XP Bar  */}
<div className="w-full h-4 bg-surface-container rounded-full overflow-hidden border border-outline-variant">
<div className="h-full bg-xp-bar-fill rounded-full relative" style={{ width: `${loading ? 0 : xpProgress}%` }}>
<div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
</div>
</div>
</div>
{/*  Streak Card  */}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-2 shadow-sm text-center">
<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-4xl text-streak-flame" style={{ fontVariationSettings: '\'FILL\' 1' }}>local_fire_department</span>
</div>
<div className="font-stats-number text-stats-number text-on-surface">{loading ? '...' : `${streakCount} Days`}</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Streak</span>
</div>
</section>
{/*  Activity Heatmap  */}
<section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
<div className="flex justify-between items-center">
<h3 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-on-surface">Activity</h3>
<span className="font-label-md text-label-md text-on-surface-variant">Last 12 Months</span>
</div>
<div className="overflow-x-auto pb-2 -mx-2 px-2">
<div className="grid grid-rows-7 grid-flow-col gap-1 w-max" id="heatmap-container">
{Array.from({ length: 52 * 7 }).map((_, i) => {
  const colorLevel = Array.from(heatmapCounts.values())[i] || 0;
  let colorClass = 'bg-heatmap-base';
  if (colorLevel > 15) colorClass = 'bg-heatmap-active opacity-100';
  else if (colorLevel > 10) colorClass = 'bg-heatmap-active opacity-60';
  else if (colorLevel > 0) colorClass = 'bg-heatmap-active opacity-30';
  return <div key={i} className={`w-3 h-3 rounded-sm ${colorClass}`}></div>;
})}
</div>
</div>
<div className="flex items-center justify-end gap-2 text-sm mt-2 font-label-md text-label-md text-on-surface-variant">
<span>Less</span>
<div className="flex gap-1">
<div className="w-3 h-3 rounded-sm bg-heatmap-base"></div>
<div className="w-3 h-3 rounded-sm bg-heatmap-active opacity-30"></div>
<div className="w-3 h-3 rounded-sm bg-heatmap-active opacity-60"></div>
<div className="w-3 h-3 rounded-sm bg-heatmap-active opacity-100"></div>
</div>
<span>More</span>
</div>
</section>
{/*  Quick Start Cards  */}
<section className="flex flex-col gap-4">
<h3 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-on-surface">Quick Start</h3>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
{/*  Topic 1  */}
<Link to="/test" className="tactile-btn bg-surface-container-lowest border border-outline-variant border-b-primary text-left rounded-xl p-6 flex flex-col gap-4 hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface">
<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined">calculate</span>
</div>
<div>
<div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Mathematics</div>
<div className="font-body-md text-body-md text-on-surface-variant mt-1">Calculus &amp; Algebra</div>
</div>
</Link>
{/*  Topic 2  */}
<Link to="/test" className="tactile-btn bg-surface-container-lowest border border-outline-variant border-b-tertiary-container text-left rounded-xl p-6 flex flex-col gap-4 hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-tertiary-container focus:ring-offset-2 focus:ring-offset-surface">
<div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
<span className="material-symbols-outlined">science</span>
</div>
<div>
<div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Physics</div>
<div className="font-body-md text-body-md text-on-surface-variant mt-1">Mechanics &amp; Dynamics</div>
</div>
</Link>
{/*  Topic 3  */}
<Link to="/test" className="tactile-btn bg-surface-container-lowest border border-outline-variant border-b-secondary text-left rounded-xl p-6 flex flex-col gap-4 hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface">
<div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">psychology</span>
</div>
<div>
<div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Logic</div>
<div className="font-body-md text-body-md text-on-surface-variant mt-1">Critical Reasoning</div>
</div>
</Link>
</div>
</section>
{/*  Recent History  */}
<section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
<div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-light">
<h3 className="font-headline-lg-mobile text-headline-lg-mobile md:text-headline-lg text-on-surface">Recent History</h3>
<button className="font-label-md text-label-md text-primary hover:underline">View All</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface border-b border-outline-variant">
<th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Date</th>
<th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Subject</th>
<th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Score</th>
<th className="py-3 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
{recentRows.length > 0 ? recentRows.map((row, index) => (
  <tr key={`${row.date}-${index}`} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
    <td className="py-4 px-6 text-on-surface-variant">{row.date}</td>
    <td className="py-4 px-6 font-medium">{row.subject}</td>
    <td className="py-4 px-6">{row.score}</td>
    <td className="py-4 px-6">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">{row.status}</span>
    </td>
  </tr>
)) : (
  <tr>
    <td className="py-4 px-6 text-on-surface-variant" colSpan="4">{loading ? 'Loading recent history...' : 'No test history yet.'}</td>
  </tr>
)}
</tbody>
</table>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="w-full py-12 px-gutter flex flex-col md:flex-row justify-between items-center gap-6 bg-surface-dim mt-auto border-t border-outline-variant">
<div className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">QuizFlow</div>
<div className="flex flex-wrap justify-center gap-6 font-label-md text-label-md">
<a className="text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Help Center</a>
<a className="text-on-surface-variant hover:underline decoration-primary transition-all" href="#">API</a>
<a className="text-on-surface-variant hover:underline decoration-primary transition-all" href="#">Discord</a>
</div>
<div className="font-body-md text-body-md text-on-surface-variant text-center md:text-right">
            © 2024 QuizFlow Gaming Education. All rights reserved.
        </div>
</footer>

    </>
  );
}
