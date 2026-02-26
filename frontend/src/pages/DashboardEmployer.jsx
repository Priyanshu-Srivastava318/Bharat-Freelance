import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import ApplicantsModal from '../components/dashboard/ApplicantsModal';

export default function DashboardEmployer() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const data = await api.get(`/api/jobs/employer/${user._id}`);
      setJobs(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job permanently?')) return;
    try {
      await api.delete(`/api/jobs/delete/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete job'); }
  };

  const totalApplicants = jobs.reduce((s, j) => s + (j.applicants || 0), 0);
  const totalBudget = jobs.reduce((s, j) => s + (j.budget || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
          <div>
            <span className="text-[11px] font-mono text-[#FF9933] tracking-[0.3em] uppercase block mb-1">Employer Dashboard</span>
            <h1 className="font-display text-4xl font-bold text-[#1a1a1a]">Your Posted Jobs.</h1>
          </div>
          <Link to="/post-job"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-6 py-3.5 rounded-xl font-body font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm">
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { l: 'Total Jobs', v: jobs.length, c: '#1dbf73', icon: '💼' },
            { l: 'Active Jobs', v: jobs.filter(j => j.status !== 'closed').length, c: '#3b82f6', icon: '🚀' },
            { l: 'Total Applicants', v: totalApplicants, c: '#FF9933', icon: '👥' },
            { l: 'Total Budget', v: `₹${totalBudget.toLocaleString('en-IN')}`, c: '#8b5cf6', icon: '💰' },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-black/5 shadow-sm p-5">
              <div className="text-xl mb-2">{s.icon}</div>
              <div className="font-display text-2xl font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-[#aaa] text-xs font-body mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-9 h-9 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" /></div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-14 text-center">
            <div className="text-5xl mb-3">📭</div>
            <h3 className="font-display text-xl text-[#1a1a1a] mb-2">No Jobs Posted Yet</h3>
            <p className="text-[#aaa] font-body text-sm mb-6">Start by posting your first job to find great talent</p>
            <Link to="/post-job" className="inline-block bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-8 py-3 rounded-xl font-body font-semibold shadow-md hover:shadow-lg transition-all">
              Post Your First Job +
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div key={job._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-black/5 shadow-sm p-6 hover:border-black/10 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-bold text-[#1a1a1a]">{job.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-body ${job.status === 'closed' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {job.status === 'closed' ? 'Closed' : '🟢 Active'}
                      </span>
                    </div>
                    <p className="text-[#888] font-body text-sm mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-5 text-sm mb-3">
                      <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Budget</p><p className="font-display font-bold text-[#1dbf73] text-xl">₹{(job.budget||0).toLocaleString('en-IN')}</p></div>
                      <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Category</p><p className="font-body text-[#555] text-sm">{job.category||'General'}</p></div>
                      <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Posted</p><p className="font-body text-[#555] text-sm">{new Date(job.createdAt).toLocaleDateString('en-IN')}</p></div>
                      <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Applicants</p><p className="font-display font-bold text-[#FF9933] text-xl">{job.applicants||0}</p></div>
                    </div>
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-[#F8F7F4] text-[#666] rounded-lg font-body border border-black/5">{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex lg:flex-col gap-2 lg:min-w-[150px]">
                    <button onClick={() => setSelectedJob(job)}
                      className="flex-1 lg:flex-none text-sm font-body font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-center">
                      👥 View Applicants ({job.applicants||0})
                    </button>
                    <button onClick={() => handleDelete(job._id)}
                      className="px-4 py-2.5 rounded-xl font-body text-sm text-red-400 border border-red-100 hover:bg-red-50 transition-colors">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {selectedJob && <ApplicantsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
