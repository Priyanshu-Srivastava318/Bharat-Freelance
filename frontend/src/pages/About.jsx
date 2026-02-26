import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const values = [
  { icon: '🎯', title: 'Transparency', desc: 'Clear pricing, no hidden charges. What you see is what you get — always.' },
  { icon: '🤝', title: 'Trust', desc: 'Secure escrow payments, verified profiles, and quality assurance on every project.' },
  { icon: '🚀', title: 'Innovation', desc: 'AI-powered features that evolve constantly, making freelancing simpler and smarter.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/5 via-transparent to-[#1dbf73]/5 pointer-events-none" />
        {/* Tricolor left edge */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col w-[3px]">
          <div className="flex-1 bg-[#FF9933]/60" />
          <div className="flex-1 bg-black/10" />
          <div className="flex-1 bg-[#1dbf73]/60" />
        </div>
        <div className="max-w-6xl mx-auto px-8 lg:px-14">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="text-[11px] font-mono text-[#bbb] tracking-[0.32em] uppercase block mb-4">Our Story</span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h1 initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold text-[#1a1a1a] leading-tight"
              style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}>
              About<br />
              <em className="not-italic text-[#FF9933]">Bharat</em>
              <span className="text-[#1dbf73]">Freelance</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8 lg:px-14">
          <FadeIn>
            <div className="grid lg:grid-cols-[2fr_1fr] gap-14 items-start">
              <div>
                <span className="editorial-line block mb-6" />
                <p className="font-body text-lg text-[#555] leading-relaxed mb-5">
                  Bharat Freelance is India's own AI-powered freelancing platform that connects skilled professionals with clients who need projects completed — all with secure escrow payments and a powerful resume-job matching engine.
                </p>
                <p className="font-body text-base text-[#888] leading-relaxed">
                  We believe in empowering Indian talent by providing a platform where freelancers can showcase their skills, find meaningful work, and build sustainable careers — without the friction of foreign platforms.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {[['🌍', 'India-First Platform'], ['🤖', 'AI Resume Scoring'], ['💳', 'Secure Escrow'], ['⚡', 'Instant Hiring']].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-[#F8F7F4] rounded-xl">
                    <span className="text-xl">{icon}</span>
                    <span className="font-body font-medium text-sm text-[#444]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VALUES — editorial list style */}
      <section className="py-20 bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-8 lg:px-14">
          <FadeIn>
            <span className="text-[11px] font-mono text-[#bbb] tracking-[0.3em] uppercase block mb-2">What We Stand For</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-10">Core Values</h2>
          </FadeIn>
          <div className="space-y-0">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i * 0.1}>
                <div className="group flex gap-6 py-8 border-b border-black/5 hover:border-[#1dbf73]/25 transition-colors cursor-default">
                  <span className="text-3xl pt-1">{v.icon}</span>
                  <div>
                    <h3 className="font-display text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#1dbf73] transition-colors">{v.title}</h3>
                    <p className="font-body text-[#888] text-sm leading-relaxed max-w-lg">{v.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8 lg:px-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[['10K+', 'Freelancers', '#FF9933'], ['5K+', 'Projects', '#1dbf73'], ['₹50L+', 'Paid Out', '#FF9933'], ['98%', 'Satisfaction', '#1dbf73']].map(([v, l, c]) => (
              <FadeIn key={l}>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold mb-1" style={{ color: c }}>{v}</div>
                  <div className="font-body text-sm text-[#aaa]">{l}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-20 bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-8 lg:px-14">
          <FadeIn>
            <span className="text-[11px] font-mono text-[#bbb] tracking-[0.3em] uppercase block mb-2">The Person Behind It</span>
            <h2 className="font-display text-3xl font-bold text-[#1a1a1a] mb-8">Founder</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl border border-black/6 shadow-sm p-8 lg:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9933] to-[#1dbf73] flex items-center justify-center text-white font-display text-2xl font-bold flex-shrink-0">P</div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-bold text-[#1a1a1a]">Priyanshu Srivastava</h3>
                <p className="text-[#1dbf73] font-body text-sm font-medium mb-3">Founder & Full-Stack Developer</p>
                <span className="editorial-line block mb-4" />
                <p className="font-body text-[#777] text-sm leading-relaxed mb-5 max-w-lg">
                  B.Tech CSE 2026, Ghaziabad. Passionate about building scalable products that actually matter — from freelance marketplaces to AI-powered tools. Built BharatFreelance to solve a real problem he saw in the Indian freelancing ecosystem.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['React.js', 'Node.js', 'MongoDB', 'AI/ML', 'Express'].map(t => (
                    <span key={t} className="text-xs px-3 py-1.5 bg-[#F8F7F4] text-[#666] rounded-lg font-body border border-black/5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8F7F4]/40 pointer-events-none" />
        <FadeIn>
          <h2 className="font-display text-4xl font-bold text-[#1a1a1a] mb-5">Ready to Join?</h2>
          <p className="text-[#999] font-body mb-8">Be part of India's fastest-growing freelancing community.</p>
          <Link to="/signup"
            className="inline-block bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-10 py-4 rounded-xl font-body font-bold shadow-lg shadow-[#FF9933]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Get Started 🚀
          </Link>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
