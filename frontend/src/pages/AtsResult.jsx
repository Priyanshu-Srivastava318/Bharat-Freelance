import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

export default function AtsResult() {
  const { score=0, feedback='', suggestions=[], matchedKeywords=[], jobTitle='' } = useLocation().state || {};
  const scoreColor = score >= 70 ? '#1dbf73' : score >= 50 ? '#FF9933' : '#ef4444';
  const C = 2 * Math.PI * 52;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono text-[#1dbf73] tracking-[0.3em] uppercase block mb-2">Application Submitted</span>
            <h1 className="font-display text-4xl font-bold text-[#1a1a1a]">Your ATS Score</h1>
            {jobTitle && <p className="text-[#aaa] text-sm font-body mt-2">for {jobTitle}</p>}
          </div>

          {/* Score ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="65" cy="65" r="52" fill="none" stroke="#f0f0f0" strokeWidth="9" />
                <motion.circle cx="65" cy="65" r="52" fill="none" stroke={scoreColor} strokeWidth="9"
                  strokeLinecap="round" strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C - (score / 100) * C }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }} className="font-display text-4xl font-bold" style={{ color: scoreColor }}>
                  {score}
                </motion.span>
                <span className="text-[#bbb] text-xs font-mono">/100</span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 mb-4 text-center">
            <p className="font-body text-[#444] text-base">{feedback}</p>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6 mb-4">
              <h3 className="font-display text-lg font-bold text-[#1a1a1a] mb-4">Improvement Tips</h3>
              <ul className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-start gap-3 text-sm font-body text-[#666]">
                    <span className="text-[#1dbf73] font-mono mt-0.5 flex-shrink-0">→</span>
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {matchedKeywords.length > 0 && (
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6 mb-8">
              <h3 className="font-display text-lg font-bold text-[#1a1a1a] mb-3">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((k, i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-body capitalize">✓ {k}</span>
                ))}
              </div>
            </div>
          )}

          <Link to="/dashboard/freelancer"
            className="block w-full text-center bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Browse More Jobs →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
