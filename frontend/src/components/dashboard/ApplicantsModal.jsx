import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';

const statusStyle = {
  pending:     'bg-yellow-50 text-yellow-600 border-yellow-100',
  reviewed:    'bg-blue-50 text-blue-600 border-blue-100',
  shortlisted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  rejected:    'bg-red-50 text-red-500 border-red-100',
  hired:       'bg-purple-50 text-purple-600 border-purple-100',
};

export default function ApplicantsModal({ job, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/ats/applicants/${job._id}`)
      .then(d => setApplicants(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/ats/applicants/${id}/status`, { status });
      setApplicants(a => a.map(x => x._id === id ? { ...x, status } : x));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
          className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white border border-black/8 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-black/5 flex justify-between items-start">
            <div>
              <h2 className="font-display text-xl font-bold text-[#1a1a1a]">{job.title}</h2>
              <p className="text-[#aaa] text-sm font-body mt-0.5">{applicants.length} applicants</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8F7F4] text-[#aaa] hover:text-[#1a1a1a] transition-all text-lg">✕</button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6">
            {loading ? (
              <div className="flex justify-center py-10"><div className="w-7 h-7 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" /></div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-[#aaa] font-body text-sm">No applicants yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map(app => (
                  <div key={app._id} className="bg-[#F8F7F4] rounded-xl p-5 border border-black/5">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#1dbf73] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {app.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-body font-semibold text-[#1a1a1a] text-sm">{app.name}</p>
                            <p className="text-[#aaa] text-xs font-mono">{app.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">ATS Score</p>
                            <span className={`font-display text-lg font-bold ${(app.score||0)>=70?'text-[#1dbf73]':(app.score||0)>=50?'text-[#FF9933]':'text-red-400'}`}>{app.score||0}/100</span>
                          </div>
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Phone</p><p className="font-body text-[#555] text-xs">{app.phone}</p></div>
                          <div><p className="text-[10px] text-[#bbb] font-mono uppercase mb-0.5">Applied</p><p className="font-body text-[#555] text-xs">{new Date(app.appliedAt).toLocaleDateString('en-IN')}</p></div>
                        </div>
                        {app.coverLetter && <p className="text-[#bbb] text-xs font-body mt-2 italic line-clamp-1">"{app.coverLetter}"</p>}
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:min-w-[130px]">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-body capitalize text-center ${statusStyle[app.status]||''}`}>{app.status}</span>
                        <select value={app.status} onChange={e => updateStatus(app._id, e.target.value)}
                          className="field !py-1.5 !text-xs !rounded-lg">
                          {['pending','reviewed','shortlisted','rejected','hired'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
