import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import API_URL from '../lib/api';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name||'', email: user?.email||'', phone:'', coverLetter:'' });

  useEffect(() => {
    api.get(`/api/jobs/job/${jobId}`).then(setJob).catch(() => toast.error('Failed to load job'));
  }, [jobId]);

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 5*1024*1024) { toast.error('Max 5MB'); return; }
    if (!f.name.match(/\.(pdf|doc|docx|txt)$/i)) { toast.error('PDF, DOC, DOCX or TXT only'); return; }
    setFile(f);
    toast.success('Resume attached ✅');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please attach your resume'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('jobId', jobId);
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('coverLetter', form.coverLetter);
      const res = await fetch(`${API_URL}/api/ats/analyze`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.error) { toast.error(data.error); return; }
      navigate('/ats-result', { state: { score: data.score, feedback: data.feedback, suggestions: data.suggestions, matchedKeywords: data.matchedKeywords, jobTitle: job?.title } });
    } catch { toast.error('Submission failed. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-[11px] font-mono text-[#1dbf73] tracking-[0.3em] uppercase block mb-1">AI-Powered Application</span>
          <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-8">Apply with ATS Score</h1>

          {/* Job info card */}
          {job && (
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 mb-8">
              <h2 className="font-display text-lg font-bold text-[#1a1a1a]">{job.title}</h2>
              <p className="text-[#aaa] text-sm font-body mb-3">{job.company||'Company'}</p>
              <div className="flex flex-wrap gap-5 text-sm">
                <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Budget</p><p className="font-display font-bold text-[#1dbf73]">₹{(job.budget||0).toLocaleString('en-IN')}</p></div>
                {job.category && <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Category</p><p className="font-body text-[#555] text-sm">{job.category}</p></div>}
              </div>
              {job.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.skills.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-[#F8F7F4] text-[#666] rounded-lg font-body border border-black/5">{s}</span>)}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Full Name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="field" />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="field" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Phone *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                placeholder="+91 98765 43210" required className="field" />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Cover Letter (Optional)</label>
              <textarea value={form.coverLetter} onChange={e => setForm({...form, coverLetter: e.target.value})}
                placeholder="Why are you the right fit for this role?" rows={3} className="field resize-none" />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Resume / CV *</label>
              <div onClick={() => document.getElementById('rf').click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                  file ? 'border-[#1dbf73]/50 bg-emerald-50/50' : dragOver ? 'border-[#FF9933]/50 bg-orange-50/30' : 'border-black/10 hover:border-black/20 bg-white'
                }`}>
                <input id="rf" type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                {file ? (
                  <>
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-body font-semibold text-[#1dbf73] text-base">{file.name}</p>
                    <p className="text-[#aaa] text-xs mt-1">{(file.size/1024).toFixed(1)} KB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                      className="mt-2 text-red-400 text-xs hover:text-red-500 transition-colors">Remove ✕</button>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">📄</div>
                    <p className="font-body font-semibold text-[#555]">Drop your resume here</p>
                    <p className="text-[#bbb] text-xs mt-1">or click to browse · PDF, DOC, DOCX (max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* ATS info */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="font-body font-semibold text-emerald-700 text-sm mb-2">🤖 AI ATS Scoring</p>
              <ul className="space-y-1 text-xs text-emerald-600 font-body">
                <li>→ Resume analyzed against job requirements instantly</li>
                <li>→ Compatibility score 0–100 with improvement tips</li>
                <li>→ Higher score = better visibility to employer</li>
              </ul>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Analyzing with AI...</span></>) : '🚀 Submit & Get ATS Score'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
