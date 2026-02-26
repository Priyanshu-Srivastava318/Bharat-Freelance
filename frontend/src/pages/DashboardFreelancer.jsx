import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';

const catColors = {
  'Web Development': 'bg-blue-50 text-blue-600 border-blue-100',
  'Graphic Design': 'bg-purple-50 text-purple-600 border-purple-100',
  'Content Writing': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'Video Editing': 'bg-red-50 text-red-600 border-red-100',
  'Digital Marketing': 'bg-amber-50 text-amber-600 border-amber-100',
  'Mobile Apps': 'bg-indigo-50 text-indigo-600 border-indigo-100',
};

const statusStyle = {
  pending:     { cls: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: '⏳', label: 'Under Review' },
  reviewed:    { cls: 'bg-blue-50 text-blue-600 border-blue-100',       icon: '👀', label: 'Reviewed' },
  shortlisted: { cls: 'bg-purple-50 text-purple-600 border-purple-100', icon: '⭐', label: 'Shortlisted!' },
  rejected:    { cls: 'bg-red-50 text-red-400 border-red-100',          icon: '❌', label: 'Not Selected' },
  hired:       { cls: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: '🎉', label: 'Hired!' },
};

function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function DashboardFreelancer() {
  const { user } = useAuth();
  const [tab, setTab] = useState('browse'); // 'browse' | 'applications'
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appsLoading, setAppsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => { loadJobs(); }, []);
  useEffect(() => { if (tab === 'applications') loadMyApps(); }, [tab]);
  useEffect(() => { filterJobs(); }, [search, category, budget, jobs]);

  const loadJobs = async () => {
    try {
      const data = await api.get('/api/jobs/');
      setJobs(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const loadMyApps = async () => {
    setAppsLoading(true);
    try {
      const data = await api.get(`/api/ats/my-applications/${encodeURIComponent(user.email)}`);
      setMyApps(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load applications'); }
    finally { setAppsLoading(false); }
  };

  const filterJobs = () => {
    let r = [...jobs];
    if (search) r = r.filter(j =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase()) ||
      (j.skills||[]).some(s => s.toLowerCase().includes(search.toLowerCase()))
    );
    if (category) r = r.filter(j => j.category === category);
    if (budget) {
      const [mn, mx] = budget.split('-').map(Number);
      r = r.filter(j => j.budget >= mn && j.budget <= (mx || Infinity));
    }
    setFiltered(r);
  };

  const hiredCount = myApps.filter(a => a.status === 'hired').length;
  const shortlistedCount = myApps.filter(a => a.status === 'shortlisted').length;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

        {/* Header */}
        <div className="mb-8">
          <span className="text-[11px] font-mono text-[#1dbf73] tracking-[0.3em] uppercase block mb-1">
            Welcome back, {user?.name?.split(' ')[0]}
          </span>
          <h1 className="font-display text-4xl font-bold text-[#1a1a1a]">
            {tab === 'browse' ? 'Find Your Next Opportunity.' : 'My Applications.'}
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-white rounded-xl border border-black/5 p-1 mb-8 w-fit shadow-sm">
          {[
            { id: 'browse', label: '🔍 Browse Jobs', count: jobs.length },
            { id: 'applications', label: '📋 My Applications', count: myApps.length || null, highlight: hiredCount > 0 },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-body font-semibold transition-all ${
                tab === t.id ? 'bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white shadow-md' : 'text-[#888] hover:text-[#1a1a1a]'
              }`}>
              {t.label}
              {t.count !== null && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  tab === t.id ? 'bg-white/20 text-white' : t.highlight ? 'bg-emerald-100 text-emerald-600' : 'bg-[#f0f0f0] text-[#aaa]'
                }`}>
                  {t.count}
                </span>
              )}
              {t.highlight && tab !== t.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* ── BROWSE JOBS TAB ── */}
        {tab === 'browse' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { l: 'Available Jobs', v: jobs.length, c: '#1dbf73', icon: '💼' },
                { l: 'Total Budget Pool', v: `₹${jobs.reduce((s,j)=>s+(j.budget||0),0).toLocaleString('en-IN')}`, c: '#FF9933', icon: '💰' },
                { l: 'Categories', v: [...new Set(jobs.map(j=>j.category).filter(Boolean))].length, c: '#8b5cf6', icon: '📂' },
                { l: 'New Today', v: jobs.filter(j => new Date(j.createdAt) > new Date(Date.now()-86400000)).length, c: '#3b82f6', icon: '🆕' },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
                  <div className="text-xl mb-2">{s.icon}</div>
                  <div className="font-display text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[#aaa] text-xs font-body mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 mb-5 flex flex-col md:flex-row gap-3">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="🔍  Search jobs, skills, keywords..."
                className="field flex-1 !py-3 !text-sm" />
              <select value={category} onChange={e => setCategory(e.target.value)} className="field md:w-52 !py-3 !text-sm">
                <option value="">All Categories</option>
                {['Web Development','Graphic Design','Content Writing','Video Editing','Digital Marketing','Mobile Apps'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={budget} onChange={e => setBudget(e.target.value)} className="field md:w-44 !py-3 !text-sm">
                <option value="">All Budgets</option>
                <option value="0-10000">Under ₹10K</option>
                <option value="10000-50000">₹10K – ₹50K</option>
                <option value="50000-100000">₹50K – ₹1L</option>
                <option value="100000-999999">Above ₹1L</option>
              </select>
            </div>

            {/* Job list */}
            {loading ? (
              <div className="flex justify-center py-20"><div className="w-9 h-9 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/5 p-14 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-display text-xl text-[#1a1a1a] mb-1">No Jobs Found</h3>
                <p className="text-[#aaa] font-body text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((job, i) => (
                  <motion.div key={job._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-xl border border-black/5 shadow-sm p-6 hover:border-[#1dbf73]/30 hover:shadow-md transition-all group">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-display text-lg font-bold text-[#1a1a1a]">{job.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-body ${catColors[job.category]||'bg-gray-50 text-gray-500 border-gray-100'}`}>{job.category||'General'}</span>
                        </div>
                        <p className="text-[#888] font-body text-sm mb-4 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap gap-5 text-sm mb-3">
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Budget</p><p className="font-display font-bold text-[#1dbf73] text-xl">₹{(job.budget||0).toLocaleString('en-IN')}</p></div>
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Duration</p><p className="font-body text-[#555] text-sm">{job.duration||'Flexible'}</p></div>
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Posted</p><p className="font-body text-[#555] text-sm">{ago(job.createdAt)}</p></div>
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Proposals</p><p className="font-display font-bold text-[#FF9933]">{job.applicants||0}</p></div>
                        </div>
                        {job.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-[#F8F7F4] text-[#666] rounded-lg font-body border border-black/5">{s}</span>)}
                          </div>
                        )}
                      </div>
                      <div className="flex lg:flex-col gap-2 lg:min-w-[130px] items-start lg:items-stretch">
                        <Link to={`/apply/${job._id}`}
                          className="flex-1 lg:flex-none bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-5 py-3 rounded-xl font-body font-semibold text-sm text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                          Apply Now →
                        </Link>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9933]/15 to-[#1dbf73]/15 flex items-center justify-center font-display font-bold text-[#FF9933]">
                          {(job.company||'C')[0].toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── MY APPLICATIONS TAB ── */}
        {tab === 'applications' && (
          <>
            {/* Mini stats */}
            {myApps.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { l: 'Total Applied', v: myApps.length, c: '#1dbf73', icon: '📋' },
                  { l: 'Shortlisted', v: shortlistedCount, c: '#8b5cf6', icon: '⭐' },
                  { l: 'Hired', v: hiredCount, c: '#FF9933', icon: '🎉' },
                  { l: 'Pending', v: myApps.filter(a => a.status === 'pending').length, c: '#3b82f6', icon: '⏳' },
                ].map((s, i) => (
                  <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
                    <div className="text-xl mb-2">{s.icon}</div>
                    <div className="font-display text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
                    <div className="text-[#aaa] text-xs font-body mt-1">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {appsLoading ? (
              <div className="flex justify-center py-20"><div className="w-9 h-9 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" /></div>
            ) : myApps.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/5 p-14 text-center">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="font-display text-xl text-[#1a1a1a] mb-2">No Applications Yet</h3>
                <p className="text-[#aaa] font-body text-sm mb-6">Start applying to jobs to see your applications here</p>
                <button onClick={() => setTab('browse')}
                  className="inline-block bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-8 py-3 rounded-xl font-body font-semibold shadow-md hover:shadow-lg transition-all">
                  Browse Jobs →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myApps.map((app, i) => {
                  const st = statusStyle[app.status] || statusStyle.pending;
                  const jobData = app.jobId; // populated
                  return (
                    <motion.div key={app._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={`bg-white rounded-xl border shadow-sm p-6 transition-all ${app.status === 'hired' ? 'border-emerald-200 shadow-emerald-50' : app.status === 'shortlisted' ? 'border-purple-100' : 'border-black/5'}`}>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                              {jobData?.title || 'Job Title'}
                            </h3>
                            {/* Hired banner */}
                            {app.status === 'hired' && (
                              <span className="text-xs px-3 py-1 bg-emerald-500 text-white rounded-full font-body font-semibold animate-pulse">
                                🎉 You're Hired!
                              </span>
                            )}
                            {app.status === 'shortlisted' && (
                              <span className="text-xs px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-body font-semibold">
                                ⭐ Shortlisted
                              </span>
                            )}
                          </div>
                          <p className="text-[#aaa] text-xs font-body mb-3">{jobData?.company || ''} {jobData?.category ? `· ${jobData.category}` : ''}</p>

                          <div className="flex flex-wrap gap-5 text-sm">
                            <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Budget</p>
                              <p className="font-display font-bold text-[#1dbf73]">₹{(jobData?.budget||0).toLocaleString('en-IN')}</p></div>
                            <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Applied</p>
                              <p className="font-body text-[#555] text-sm">{ago(app.appliedAt)}</p></div>
                            <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">ATS Score</p>
                              <p className={`font-display font-bold text-lg ${(app.score||0) >= 70 ? 'text-[#1dbf73]' : (app.score||0) >= 50 ? 'text-[#FF9933]' : 'text-red-400'}`}>{app.score||0}/100</p></div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 sm:min-w-[130px] items-start sm:items-stretch">
                          {/* Status badge */}
                          <span className={`text-xs px-3 py-2 rounded-xl border font-body font-semibold text-center ${st.cls}`}>
                            {st.icon} {st.label}
                          </span>

                          {/* Hired → contact employer hint */}
                          {app.status === 'hired' && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                              <p className="text-emerald-700 text-xs font-body font-semibold">🎊 Congratulations!</p>
                              <p className="text-emerald-600 text-[10px] font-body mt-0.5">Employer will contact you soon</p>
                            </div>
                          )}

                          {/* Rejected → apply to more */}
                          {app.status === 'rejected' && (
                            <button onClick={() => setTab('browse')}
                              className="text-xs font-body text-[#1dbf73] border border-[#1dbf73]/30 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors text-center">
                              Browse More →
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}