import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#F8F7F4] border-t border-black/5 pt-14 pb-8">
      {/* Tricolor stripe */}
      <div className="flex mb-14 mx-6 lg:mx-10 rounded-full overflow-hidden h-[2px]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-black/10" />
        <div className="flex-1 bg-[#1dbf73]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-3">
              <span className="font-display text-xl font-bold text-[#FF9933]">Bharat</span>
              <span className="font-display text-xl font-bold text-[#1dbf73]">Freelance</span>
            </Link>
            <p className="text-[#aaa] text-sm font-body leading-relaxed max-w-xs mb-4">
              India's first AI-powered freelancing marketplace. Built for Bharat, by Bharat.
            </p>
            <div className="flex items-center gap-2 text-[#ccc] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73] animate-pulse" />
              Made with ❤️ in India 🇮🇳
            </div>
          </div>
          {[
            { title: 'Freelancers', links: [{ to: '/dashboard/freelancer', l: 'Find Work' }, { to: '/about', l: 'How It Works' }, { to: '/signup', l: 'Join Free' }] },
            { title: 'Employers', links: [{ to: '/post-job', l: 'Post a Job' }, { to: '/about', l: 'Browse Talent' }, { to: '/signup', l: 'Hire Now' }] },
            { title: 'Company', links: [{ to: '/about', l: 'About Us' }, { to: '/contact', l: 'Contact' }, { to: '#', l: 'Privacy Policy' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-[10px] font-mono text-[#bbb] tracking-[0.28em] uppercase mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.l}>
                    <Link to={link.to} className="text-sm text-[#999] hover:text-[#1dbf73] transition-colors font-body">{link.l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#ccc] text-xs font-body">© 2025 BharatFreelance. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
              <a key={s} href="#" className="text-[#ccc] hover:text-[#555] text-xs font-body transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
