import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Step indicators
const steps = ['Phone', 'OTP', 'New Password'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
            i < current ? 'bg-[#1dbf73] text-white' :
            i === current ? 'bg-gradient-to-br from-[#FF9933] to-[#1dbf73] text-white shadow-md' :
            'bg-[#f0f0f0] text-[#bbb]'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-xs font-body transition-colors ${i === current ? 'text-[#1a1a1a] font-semibold' : 'text-[#bbb]'}`}>{s}</span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-[1.5px] mx-1 transition-all duration-500 ${i < current ? 'bg-[#1dbf73]' : 'bg-[#e0e0e0]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ForgotPassword() {
  const [step, setStep] = useState(0); // 0=phone, 1=otp, 2=new password
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp] = useState(() => Math.floor(100000 + Math.random() * 900000).toString()); // Demo OTP

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) { toast.error('Enter valid 10-digit mobile number'); return; }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    // In demo: show OTP in toast (in production this would be sent via SMS)
    toast.success(`OTP sent to +91 ${phone} ✅`, { duration: 4000 });
    // For demo purposes only — remove in production
    toast(`Demo OTP: ${generatedOtp}`, { icon: '🔑', duration: 8000, style: { background: '#fff8f0', border: '1px solid #FF9933' } });
    setStep(1);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    // Auto-focus next
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) { toast.error('Enter complete 6-digit OTP'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    // Demo verification
    if (enteredOtp !== generatedOtp) {
      toast.error('Incorrect OTP. Please try again.');
      return;
    }
    toast.success('OTP verified ✅');
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success('Password reset successfully! 🎉');
    // In production: call API to update password
    setTimeout(() => window.location.href = '/login', 1500);
  };

  const resendOtp = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('OTP resent!');
    toast(`Demo OTP: ${generatedOtp}`, { icon: '🔑', duration: 8000, style: { background: '#fff8f0', border: '1px solid #FF9933' } });
  };

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }} className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="inline-block mb-8">
          <span className="font-display text-2xl font-bold text-[#FF9933]">Bharat</span>
          <span className="font-display text-2xl font-bold text-[#1dbf73]">Freelance</span>
        </Link>

        {/* Step indicator */}
        <StepIndicator current={step} />

        <AnimatePresence mode="wait">

          {/* STEP 0 — Phone number */}
          {step === 0 && (
            <motion.div key="phone" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <span className="text-[11px] font-mono text-[#bbb] tracking-[0.28em] uppercase block mb-1">Reset Password</span>
              <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">Enter Mobile Number</h1>
              <p className="text-[#aaa] font-body text-sm mb-8">We'll send a 6-digit OTP to verify your identity.</p>

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Mobile Number</label>
                  <div className="flex gap-0 items-stretch">
                    <div className="flex items-center justify-center px-4 bg-[#f0efec] border border-r-0 border-[#ddd] rounded-l-xl text-sm font-body text-[#555] font-semibold flex-shrink-0">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      required
                      className="field !rounded-l-none !rounded-r-xl flex-1 !py-3.5"
                      style={{ borderLeft: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending OTP...</span></>
                    : 'Send OTP →'
                  }
                </button>
              </form>

              <p className="text-center text-[#aaa] font-body text-sm mt-6">
                Remember your password? <Link to="/login" className="text-[#1dbf73] hover:text-[#15a85f]">Login</Link>
              </p>
            </motion.div>
          )}

          {/* STEP 1 — OTP verification */}
          {step === 1 && (
            <motion.div key="otp" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <span className="text-[11px] font-mono text-[#bbb] tracking-[0.28em] uppercase block mb-1">Verify OTP</span>
              <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">Enter OTP</h1>
              <p className="text-[#aaa] font-body text-sm mb-8">
                Sent to <span className="text-[#1a1a1a] font-semibold">+91 {phone}</span>
                <button onClick={() => setStep(0)} className="ml-2 text-[#1dbf73] text-xs hover:underline">Change</button>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {/* OTP boxes */}
                <div className="flex gap-3 justify-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      onKeyDown={e => handleOtpKeyDown(e, idx)}
                      className="w-12 h-14 text-center text-xl font-display font-bold text-[#1a1a1a] bg-white border-2 border-[#e0e0e0] rounded-xl focus:border-[#1dbf73] focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>
                    : 'Verify OTP →'
                  }
                </button>
              </form>

              <div className="text-center mt-5">
                <span className="text-[#aaa] text-sm font-body">Didn't receive OTP? </span>
                <button onClick={resendOtp} className="text-[#1dbf73] text-sm font-body hover:text-[#15a85f] transition-colors">Resend</button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — New password */}
          {step === 2 && (
            <motion.div key="password" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
              <span className="text-[11px] font-mono text-[#bbb] tracking-[0.28em] uppercase block mb-1">Almost Done</span>
              <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-2">Set New Password</h1>
              <p className="text-[#aaa] font-body text-sm mb-8">Choose a strong password for your account.</p>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters" required className="field" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password" required className="field" />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs font-body mt-1.5">Passwords don't match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[#1dbf73] text-xs font-body mt-1.5">✓ Passwords match</p>
                  )}
                </div>

                <button type="submit" disabled={loading || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                    : '🔐 Reset Password'
                  }
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}