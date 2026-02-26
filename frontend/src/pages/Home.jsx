import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ── Indian Flag Stripe Animation ── */
const FlagAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
    {/* Three horizontal stripes diverging left→right */}
    {[
      { top: '0%', h: '33.3%', color: 'rgba(255,153,51,0.11)', delay: 0 },
      { top: '33.3%', h: '33.3%', color: 'rgba(0,0,0,0.025)', delay: 0.4 },
      { top: '66.6%', h: '33.4%', color: 'rgba(29,191,115,0.09)', delay: 0.8 },
    ].map((s, i) => (
      <motion.div key={i}
        className="absolute left-0"
        style={{ top: s.top, height: s.h, width: '100%',
          background: `linear-gradient(90deg, ${s.color} 0%, ${s.color.replace('0.11','0.03').replace('0.025','0.01').replace('0.09','0.02')} 45%, transparent 75%)` }}
        initial={{ scaleX: 0.85, opacity: 0 }}
        animate={{ scaleX: [0.85, 1, 0.88, 1], opacity: [0, 1, 0.7, 1] }}
        transition={{ duration: 5, delay: s.delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />
    ))}
    {/* Ashoka Chakra ghost — very subtle */}
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      style={{ left: '5%', width: 280, height: 280, borderRadius: '50%',
        border: '1.5px solid rgba(29,191,115,0.08)',
        background: 'radial-gradient(circle, rgba(29,191,115,0.03) 0%, transparent 70%)' }}
      animate={{ rotate: 360 }}
      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
    />
    {/* 24 spokes */}
    {Array.from({ length: 24 }).map((_, i) => (
      <motion.div key={i}
        className="absolute top-1/2 origin-bottom"
        style={{ left: 'calc(5% + 140px)', width: 1, height: 130,
          background: 'rgba(29,191,115,0.05)',
          transformOrigin: 'bottom center',
          transform: `translateX(-50%) rotate(${i * 15}deg)` }}
        animate={{ rotate: `${i * 15 + 360}deg` }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      />
    ))}
  </div>
);

/* ── What Makes Us Different (list style) ── */
const differentiators = [
  { n: '01', title: 'AI-Powered ATS Matching', desc: 'Smart resume analysis scores your fit for each job. Higher score = higher visibility to employers.' },
  { n: '02', title: 'Escrow-Safe Payments', desc: 'Money is locked until work is approved. Razorpay UPI, cards & wallets. Zero risk for both sides.' },
  { n: '03', title: 'India-First by Design', desc: 'Regional language support, INR pricing, Indian work culture — built for Bharat, not copy-pasted.' },
  { n: '04', title: 'Instant Proposal Flow', desc: 'Apply in 2 minutes with a resume upload. Employers respond within hours, not days.' },
];

const categories = [
  { icon: '💻', name: 'Web Development' }, { icon: '🎨', name: 'Graphic Design' },
  { icon: '✍️', name: 'Content Writing' }, { icon: '🎬', name: 'Video Editing' },
  { icon: '📱', name: 'Mobile Apps' }, { icon: '📊', name: 'Digital Marketing' },
  { icon: '📈', name: 'Data Analysis' }, { icon: '🎤', name: 'Voice Over' },
];

function FadeIn({ children, delay = 0, y = 24 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />

      {/* ══════════════════════════════════════
          HERO — Left editorial, right clean card
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <FlagAnimation />

        {/* Soft mesh glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#1dbf73]/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-[#FF9933]/6 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 items-center">

            {/* LEFT */}
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-10">
                <span className="editorial-line" />
                <span className="text-[11px] font-mono text-[#aaa] tracking-[0.32em] uppercase">Made in India, For India</span>
              </motion.div>

              <div className="overflow-hidden mb-4">
                <motion.h1 initial={{ y: 90 }} animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display font-bold leading-[0.92] text-[#1a1a1a]"
                  style={{ fontSize: 'clamp(52px, 7vw, 96px)' }}>
                  Work<br />
                  <em className="not-italic text-[#FF9933]">Without</em><br />
                  Borders.
                </motion.h1>
              </div>

              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.45 }}
                className="font-display italic text-[#1dbf73] mb-6"
                style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}>
                Hire Without Limits.
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55 }}
                className="text-[#777] font-body text-base lg:text-lg max-w-[440px] mb-10 leading-relaxed">
                India's first <span className="text-[#1dbf73] font-semibold">AI-powered</span> freelancing marketplace —
                <span className="text-[#FF9933] font-semibold"> secure payments</span>, smart matching, instant hiring.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }} className="flex flex-wrap gap-3">
                <Link to="/post-job"
                  className="group inline-flex items-center gap-2 bg-[#FF9933] text-white font-body font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-[#FF9933]/25 hover:shadow-xl hover:shadow-[#FF9933]/35 hover:-translate-y-0.5 transition-all text-sm">
                  🎯 Hire Talent
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/dashboard/freelancer"
                  className="group inline-flex items-center gap-2 border-2 border-[#1dbf73] text-[#1dbf73] font-body font-semibold px-7 py-3.5 rounded-xl hover:bg-[#1dbf73] hover:text-white transition-all text-sm hover:-translate-y-0.5">
                  💼 Find Work
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="flex flex-wrap gap-5 mt-10 pt-8 border-t border-black/5">
                {['✅ Secure Payments', '🤖 AI Matching', '⚡ Instant Hiring', '🔒 Data Protected'].map(b => (
                  <span key={b} className="text-xs font-body text-[#bbb]">{b}</span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — What makes us unique (editorial list) */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-black/6 shadow-lg shadow-black/5 p-7 lg:p-8">

              <p className="text-[10px] font-mono text-[#bbb] tracking-[0.3em] uppercase mb-6">Why Choose Us</p>

              <div className="space-y-5">
                {[
                  { icon: '🤖', label: 'AI Resume Scoring', detail: 'Get match score before applying' },
                  { icon: '🔒', label: 'Escrow Payments', detail: 'Money safe until job done' },
                  { icon: '⚡', label: 'Same-day Responses', detail: 'Hire in under 24 hours' },
                  { icon: '🇮🇳', label: 'Built for India', detail: 'UPI, INR, Indian work culture' },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8F7F4] transition-colors group cursor-default">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-body font-semibold text-[#1a1a1a] text-sm">{item.label}</p>
                      <p className="font-body text-[#aaa] text-xs mt-0.5">{item.detail}</p>
                    </div>
                    <span className="text-[#e0e0e0] group-hover:text-[#1dbf73] transition-colors text-xs font-mono">→</span>
                  </motion.div>
                ))}
              </div>

              {/* Mini stat bar */}
              <div className="mt-6 pt-5 border-t border-black/5">
                <div className="grid grid-cols-2 gap-4">
                  {[['10K+', 'Freelancers', 'text-[#FF9933]'], ['5K+', 'Projects', 'text-[#1dbf73]'],
                    ['₹50L+', 'Paid Out', 'text-[#FF9933]'], ['98%', 'Satisfaction', 'text-[#1dbf73]']].map(([v, l, c]) => (
                    <div key={l}>
                      <div className={`font-display text-2xl font-bold ${c}`}>{v}</div>
                      <div className="text-[10px] text-[#bbb] font-body mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WHAT MAKES US DIFFERENT — Editorial List
      ══════════════════════════════════════ */}
      <section className="bg-white py-24 relative">
        <div className="absolute inset-0 top-0 h-px bg-gradient-to-r from-transparent via-black/7 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-start">
            <FadeIn>
              <span className="text-[11px] font-mono text-[#1dbf73] tracking-[0.3em] uppercase block mb-3">What Sets Us Apart</span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
                Built<br />Different.<br /><em className="not-italic text-[#ddd]">Truly.</em>
              </h2>
              <p className="text-[#999] font-body text-sm mt-5 leading-relaxed max-w-xs">
                Not another copy-paste freelancing platform. We built this from the ground up for India.
              </p>
            </FadeIn>

            <div>
              {differentiators.map((d, i) => (
                <FadeIn key={d.n} delay={i * 0.1}>
                  <div className="group flex gap-6 py-7 border-b border-black/5 hover:border-[#1dbf73]/30 transition-colors cursor-default">
                    <span className="font-mono text-xs text-[#ddd] pt-1 w-5 flex-shrink-0">{d.n}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-lg font-bold text-[#1a1a1a] group-hover:text-[#1dbf73] transition-colors">{d.title}</h3>
                        <span className="text-[#e0e0e0] group-hover:text-[#1dbf73] group-hover:translate-x-1 transition-all text-sm font-mono">→</span>
                      </div>
                      <p className="text-[#888] font-body text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <section className="py-20 bg-[#F8F7F4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <FadeIn>
            <span className="text-[11px] font-mono text-[#FF9933] tracking-[0.3em] uppercase block mb-2">Categories</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-10">Find work in your field.</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat, i) => (
              <FadeIn key={cat.name} delay={i * 0.04}>
                <motion.div whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  className="bg-white border border-black/5 p-5 rounded-xl cursor-pointer group shadow-sm hover:shadow-md hover:border-black/10 transition-all">
                  <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <p className="font-body font-medium text-sm text-[#444]">{cat.name}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA — Clean, editorial
      ══════════════════════════════════════ */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/4 via-transparent to-[#1dbf73]/4 pointer-events-none" />
        {/* Tricolor top border */}
        <div className="absolute top-0 left-0 right-0 flex">
          <div className="flex-1 h-[3px] bg-[#FF9933]/40" />
          <div className="flex-1 h-[3px] bg-black/5" />
          <div className="flex-1 h-[3px] bg-[#1dbf73]/40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeIn>
            <span className="text-[11px] font-mono text-[#bbb] tracking-[0.3em] uppercase block mb-5">Join the movement</span>
            <h2 className="font-display font-bold text-[#1a1a1a] mb-5"
              style={{ fontSize: 'clamp(40px, 6vw, 80px)', lineHeight: 1 }}>
              Ready to Start?
            </h2>
            <p className="text-[#999] font-body text-base max-w-md mx-auto mb-10">
              Join thousands of Indian freelancers and employers already on the platform.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/signup"
                className="bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-9 py-4 rounded-xl font-body font-bold shadow-xl shadow-[#FF9933]/20 hover:shadow-2xl hover:shadow-[#FF9933]/30 hover:-translate-y-0.5 transition-all">
                Join as Freelancer 🚀
              </Link>
              <Link to="/signup"
                className="border-2 border-[#1a1a1a] text-[#1a1a1a] px-9 py-4 rounded-xl font-body font-bold hover:bg-[#1a1a1a] hover:text-white transition-all hover:-translate-y-0.5">
                Hire Talent 💼
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
