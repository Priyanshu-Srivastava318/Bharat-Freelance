import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'bharat_admin_secret_2025';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetchAdmin = (path, opts = {}) =>
  fetch(`${BASE}${path}`, { headers: { 'x-admin-key': ADMIN_KEY, 'Content-Type': 'application/json' }, ...opts }).then(r => r.json());

export default function AdminDashboard() {
  const [auth, setAuth] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (keyInput === ADMIN_KEY) { setAuth(true); loadAll(); toast.success('Welcome, Admin 👑'); }
    else toast.error('Wrong admin key');
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, u, j, a] = await Promise.all([
        fetchAdmin('/api/admin/stats'),
        fetchAdmin('/api/admin/users'),
        fetchAdmin('/api/admin/jobs'),
        fetchAdmin('/api/admin/applications'),
      ]);
      setStats(s); setUsers(Array.isArray(u) ? u : []); setJobs(Array.isArray(j) ? j : []); setApps(Array.isArray(a) ? a : []);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await fetchAdmin(`/api/admin/users/${id}`, { method: 'DELETE' });
    setUsers(u => u.filter(x => x._id !== id));
    toast.success('User deleted');
  };

  const deleteJob = async (id) => {
    if (!confirm('Delete this job and all its applications?')) return;
    await fetchAdmin(`/api/admin/jobs/${id}`, { method: 'DELETE' });
    setJobs(j => j.filter(x => x._id !== id));
    toast.success('Job deleted');
  };

  if (!auth) return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-black/5 shadow-lg p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="font-display text-2xl font-bold text-[#1a1a1a] mb-1">Admin Access</h1>
        <p className="text-[#aaa] text-sm font-body mb-6">Enter admin key to continue</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
            placeholder="Admin secret key" required className="field text-center" />
          <button type="submit"
            className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-3.5 rounded-xl font-body font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Enter Dashboard →
          </button>
        </form>
      </motion.div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: `👥 Users (${users.length})` },
    { id: 'jobs', label: `💼 Jobs (${jobs.length})` },
    { id: 'apps', label: `📋 Applications (${apps.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      {/* Admin Navbar */}
      <div className="bg-white border-b border-black/5 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9933] to-[#1dbf73] flex items-center justify-center text-white text-xs font-bold">A</div>
            <span className="font-display font-bold text-[#1a1a1a]">BharatFreelance <span className="text-[#FF9933]">Admin</span></span>
          </div>
          <div className="flex gap-2">
            <button onClick={loadAll} className="text-sm text-[#888] border border-[#e0e0e0] px-4 py-2 rounded-lg hover:bg-[#F8F7F4] transition-all">🔄 Refresh</button>
            <button onClick={() => setAuth(false)} className="text-sm text-red-400 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition-all">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-black/5 p-1 w-fit shadow-sm mb-8 flex-wrap gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-body font-semibold transition-all ${tab === t.id ? 'bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white shadow-sm' : 'text-[#888] hover:text-[#1a1a1a]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" /></div>}

        {/* OVERVIEW */}
        {!loading && tab === 'overview' && stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {[
                { l: 'Total Users', v: stats.totalUsers, c: '#1dbf73', icon: '👥' },
                { l: 'Freelancers', v: stats.freelancers, c: '#3b82f6', icon: '🧑‍💻' },
                { l: 'Employers', v: stats.employers, c: '#8b5cf6', icon: '🏢' },
                { l: 'Total Jobs', v: stats.totalJobs, c: '#FF9933', icon: '💼' },
                { l: 'Applications', v: stats.totalApplicants, c: '#f59e0b', icon: '📋' },
                { l: 'Hired', v: stats.hiredCount, c: '#10b981', icon: '🎉' },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-display text-3xl font-bold" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[#aaa] text-xs font-body mt-1">{s.l}</div>
                </motion.div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
              <h2 className="font-display text-xl font-bold mb-5">🕐 Recent Jobs</h2>
              <div className="space-y-3">
                {(stats.recentJobs || []).map(job => (
                  <div key={job._id} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                    <div>
                      <p className="font-body font-semibold text-[#1a1a1a] text-sm">{job.title}</p>
                      <p className="text-[#aaa] text-xs">{job.category} · ₹{(job.budget||0).toLocaleString('en-IN')}</p>
                    </div>
                    <span className="text-xs text-[#bbb] font-mono">{new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* USERS */}
        {!loading && tab === 'users' && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <h2 className="font-display text-xl font-bold">All Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-[#F8F7F4]">
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[11px] font-mono text-[#bbb] tracking-widest uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} className="border-t border-black/5 hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9933]/20 to-[#1dbf73]/20 flex items-center justify-center font-bold text-[#FF9933] text-sm">{u.name[0].toUpperCase()}</div>
                          <span className="font-body font-medium text-sm text-[#1a1a1a]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#666] text-sm font-body">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-body capitalize border ${u.role === 'employer' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-[#aaa] text-xs font-mono">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteUser(u._id)} className="text-xs text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* JOBS */}
        {!loading && tab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5"><h2 className="font-display text-xl font-bold">All Jobs</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-[#F8F7F4]">
                  {['Title', 'Budget', 'Category', 'Applicants', 'Posted', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[11px] font-mono text-[#bbb] tracking-widest uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="border-t border-black/5 hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-6 py-4"><p className="font-body font-medium text-sm text-[#1a1a1a] max-w-[200px] truncate">{job.title}</p></td>
                      <td className="px-6 py-4"><span className="font-display font-bold text-[#1dbf73]">₹{(job.budget||0).toLocaleString('en-IN')}</span></td>
                      <td className="px-6 py-4"><span className="text-xs text-[#666] font-body">{job.category||'—'}</span></td>
                      <td className="px-6 py-4"><span className="font-display font-bold text-[#FF9933]">{job.applicants||0}</span></td>
                      <td className="px-6 py-4 text-[#aaa] text-xs font-mono">{new Date(job.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteJob(job._id)} className="text-xs text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* APPLICATIONS */}
        {!loading && tab === 'apps' && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5"><h2 className="font-display text-xl font-bold">All Applications</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-[#F8F7F4]">
                  {['Applicant', 'Job', 'Score', 'Status', 'Applied'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[11px] font-mono text-[#bbb] tracking-widest uppercase">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app._id} className="border-t border-black/5 hover:bg-[#FAFAF8] transition-colors">
                      <td className="px-6 py-4"><p className="font-body font-medium text-sm text-[#1a1a1a]">{app.name}</p><p className="text-[#aaa] text-xs">{app.email}</p></td>
                      <td className="px-6 py-4"><p className="text-sm text-[#666] max-w-[180px] truncate">{app.jobId?.title || '—'}</p></td>
                      <td className="px-6 py-4"><span className={`font-display font-bold ${(app.score||0)>=70?'text-[#1dbf73]':(app.score||0)>=50?'text-[#FF9933]':'text-red-400'}`}>{app.score||0}</span></td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-body capitalize border ${
                          app.status==='hired'?'bg-emerald-50 text-emerald-600 border-emerald-100':
                          app.status==='shortlisted'?'bg-purple-50 text-purple-600 border-purple-100':
                          app.status==='rejected'?'bg-red-50 text-red-400 border-red-100':'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}>{app.status}</span>
                      </td>
                      <td className="px-6 py-4 text-[#aaa] text-xs font-mono">{new Date(app.appliedAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}