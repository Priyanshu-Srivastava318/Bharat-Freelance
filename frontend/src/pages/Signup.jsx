import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'freelancer' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await api.post('/api/auth/signup', form);
      if (!data.token) { toast.error(data.msg || 'Signup failed'); return; }
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      navigate(data.user.role === 'employer' ? '/dashboard/employer' : '/dashboard/freelancer');
    } catch { toast.error('Network error.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }} className="w-full max-w-md">
        <Link to="/" className="inline-block mb-8">
          <span className="font-display text-2xl font-bold text-[#FF9933]">Bharat</span>
          <span className="font-display text-2xl font-bold text-[#1dbf73]">Freelance</span>
        </Link>
        <span className="text-[11px] font-mono text-[#bbb] tracking-[0.28em] uppercase block mb-1">Get Started</span>
        <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-7">Create Account</h1>

        {/* Role toggle */}
        <div className="flex bg-[#F0EFEc] rounded-xl p-1 mb-6">
          {['freelancer', 'employer'].map(role => (
            <button key={role} type="button" onClick={() => setForm({...form, role})}
              className={`flex-1 py-2.5 rounded-lg text-sm font-body font-semibold transition-all capitalize ${
                form.role === role ? 'bg-white shadow-sm text-[#1a1a1a]' : 'text-[#aaa] hover:text-[#666]'}`}>
              {role === 'freelancer' ? '💼 Freelancer' : '🏢 Employer'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { k: 'name', l: 'Full Name', t: 'text', p: 'Priyanshu Srivastava' },
            { k: 'email', l: 'Email Address', t: 'email', p: 'your@email.com' },
            { k: 'password', l: 'Password', t: 'password', p: '••••••••' },
          ].map(f => (
            <div key={f.k}>
              <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">{f.l}</label>
              <input type={f.t} value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})}
                placeholder={f.p} required className="field" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center mt-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Join as ${form.role === 'freelancer' ? 'Freelancer' : 'Employer'} →`}
          </button>
        </form>
        <p className="text-center text-[#aaa] font-body text-sm mt-5">
          Already have an account? <Link to="/login" className="text-[#1dbf73] hover:text-[#15a85f]">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
