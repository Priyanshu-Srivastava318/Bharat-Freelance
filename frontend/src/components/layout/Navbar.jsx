import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user?.role !== 'freelancer' ? [{ to: '/post-job', label: 'Hire Talent' }] : []),
    ...(user?.role !== 'employer' ? [{ to: '/dashboard/freelancer', label: 'Find Work' }] : []),
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ backgroundColor: scrolled ? 'rgba(248,247,244,0.97)' : 'transparent' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-sm border-b border-black/5 backdrop-blur-xl' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-display text-xl lg:text-2xl font-bold text-[#FF9933]">Bharat</span>
            <span className="font-display text-xl lg:text-2xl font-bold text-[#1dbf73]">Freelance</span>
            <span className="hidden lg:inline text-[9px] font-mono text-[#aaa] tracking-[0.25em] uppercase border border-[#e0e0e0] px-2 py-0.5 rounded">🇮🇳 India</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                className={`relative text-sm font-body font-medium tracking-wide group transition-colors ${
                  location.pathname === link.to ? 'text-[#1dbf73]' : 'text-[#555] hover:text-[#1a1a1a]'
                }`}>
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-[#1dbf73] transition-all duration-300 ${
                  location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to={user.role === 'employer' ? '/dashboard/employer' : '/dashboard/freelancer'}
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#555] hover:text-[#1a1a1a] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF9933] to-[#1dbf73] flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden lg:inline text-sm">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout}
                  className="text-sm font-medium text-[#888] hover:text-red-500 border border-[#e0e0e0] hover:border-red-300 px-4 py-2 rounded-lg transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-sm font-medium text-[#555] hover:text-[#1a1a1a] border border-[#e0e0e0] hover:border-[#bbb] px-5 py-2 rounded-lg transition-all">
                  Login
                </Link>
                <Link to="/signup"
                  className="text-sm font-semibold bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-5 py-2.5 rounded-lg shadow-md shadow-[#1dbf73]/20 hover:shadow-lg hover:shadow-[#1dbf73]/30 transition-all hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-5 h-[1.5px] bg-[#1a1a1a] block rounded-full"
                  animate={menuOpen ? (i === 1 ? { opacity: 0 } : i === 0 ? { rotate: 45, y: 6 } : { rotate: -45, y: -6 }) : { opacity: 1, rotate: 0, y: 0 }} />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#F8F7F4] flex flex-col items-center justify-center gap-7 md:hidden">
            {navLinks.map((link, i) => (
              <motion.div key={link.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link to={link.to} onClick={() => setMenuOpen(false)} className="font-display text-3xl font-bold text-[#1a1a1a] hover:text-[#1dbf73] transition-colors">{link.label}</Link>
              </motion.div>
            ))}
            {user ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="mt-4 text-red-500 border border-red-200 px-8 py-3 rounded-xl font-body">Logout</button>
            ) : (
              <div className="flex gap-3 mt-4">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="border border-[#ddd] text-[#555] px-7 py-3 rounded-xl font-body">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-7 py-3 rounded-xl font-body font-semibold">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
