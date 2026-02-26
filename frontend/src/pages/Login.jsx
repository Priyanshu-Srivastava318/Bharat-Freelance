import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', form);
      if (!data.token) { toast.error(data.msg || 'Invalid credentials'); return; }
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      navigate(data.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/freelancer');
    } catch { toast.error('Network error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/15 via-[#1a1a1a] to-[#1dbf73]/15" />
        {/* Tricolor vertical stripes */}
        <div className="absolute left-0 top-0 bottom-0 flex w-full">
          <div className="flex-1 opacity-10 bg-gradient-to-r from-[#FF9933] to-transparent" />
          <div className="flex-1 opacity-5 bg-white" />
          <div className="flex-1 opacity-10 bg-gradient-to-l from-[#1dbf73] to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col items-start justify-center p-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-mono text-[11px] text-white/30 tracking-[0.3em] uppercase mb-4">Welcome to</p>
            <h2 className="font-display font-bold text-white/10 leading-none select-none"
              style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}>
              BHARAT<br />FREE<br />LANCE
            </h2>
            <div className="flex items-center gap-3 mt-8">
              <span className="editorial-line" />
              <span className="font-mono text-xs text-white/25 tracking-[0.25em] uppercase">India's Platform</span>
            </div>
          </motion.div>
          {/* Bottom tricolor bar */}
          <div className="absolute bottom-0 left-0 right-0 flex h-1">
            <div className="flex-1 bg-[#FF9933]/50" />
            <div className="flex-1 bg-white/20" />
            <div className="flex-1 bg-[#1dbf73]/50" />
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
          <Link to="/" className="inline-block mb-10">
            <span className="font-display text-2xl font-bold text-[#FF9933]">Bharat</span>
            <span className="font-display text-2xl font-bold text-[#1dbf73]">Freelance</span>
          </Link>
          <span className="text-[11px] font-mono text-[#bbb] tracking-[0.28em] uppercase block mb-2">Welcome Back</span>
          <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-8">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="your@email.com" required className="field" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs font-body text-[#1dbf73] hover:text-[#15a85f] transition-colors">Forgot password?</Link>
            </div>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••" required className="field" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-semibold shadow-lg shadow-[#1dbf73]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Login →'}
            </button>
          </form>

          <p className="text-center text-[#aaa] font-body text-sm mt-6">
            Not a member? <Link to="/signup" className="text-[#1dbf73] hover:text-[#15a85f] transition-colors">Create account</Link>
          </p>

          <div className="mt-10 pt-6 border-t border-black/5 grid grid-cols-3 gap-4 text-center">
            {[['10K+', 'Users', '#FF9933'], ['5K+', 'Projects', '#1dbf73'], ['98%', 'Satisfaction', '#FF9933']].map(([v, l, c]) => (
              <div key={l}><div className="font-display text-xl font-bold" style={{color: c}}>{v}</div><div className="text-xs text-[#bbb] font-body">{l}</div></div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}