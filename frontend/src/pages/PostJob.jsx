import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({ title:'', description:'', budget:'', category:'', duration:'', company:'', skills:[] });

  const addSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const s = skillInput.trim();
      if (s && !form.skills.includes(s)) setForm({...form, skills: [...form.skills, s]});
      setSkillInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.budget) { toast.error('Fill all required fields'); return; }
    setLoading(true);
    try {
      const data = await api.post('/api/jobs/create', { ...form, budget: Number(form.budget), employerId: user._id, employerName: user.name });
      if (data.success) { toast.success('Job posted! 🎉'); navigate('/dashboard/employer'); }
      else toast.error(data.msg || 'Failed to post job');
    } catch { toast.error('Network error.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-[11px] font-mono text-[#FF9933] tracking-[0.3em] uppercase block mb-1">Post Opportunity</span>
          <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-10">Post a New Job</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Job Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                placeholder="e.g. React.js Developer for E-Commerce App" required className="field" />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Description *</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe the work, requirements, and expectations..." rows={5} required
                className="field resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Budget (₹) *</label>
                <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})}
                  placeholder="25000" required className="field" />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="field">
                  <option value="">Select category</option>
                  {['Web Development','Graphic Design','Content Writing','Video Editing','Digital Marketing','Mobile Apps','Data Analysis','Voice Over'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Duration</label>
                <input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}
                  placeholder="e.g. 2 weeks" className="field" />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Company Name</label>
                <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                  placeholder="Your company" className="field" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Skills (Enter to add)</label>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
                placeholder="e.g. React, Node.js..." className="field" />
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-body">
                      {s}
                      <button type="button" onClick={() => setForm({...form, skills: form.skills.filter(x => x !== s)})} className="hover:text-red-400 transition-colors">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center mt-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🚀 Post Job'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
