import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon 🙏");
    setForm({ name:'', email:'', message:'' });
  };
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[11px] font-mono text-[#bbb] tracking-[0.3em] uppercase block mb-1">Get in Touch</span>
          <h1 className="font-display text-4xl font-bold text-[#1a1a1a] mb-10">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Your Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="field" /></div>
            <div><label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="field" /></div>
            <div><label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Message</label>
              <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} required className="field resize-none" /></div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white py-4 rounded-xl font-body font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Send Message →
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
