import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({});

  const isOwn = currentUser?._id === userId;

  useEffect(() => {
    api.get(`/api/profile/${userId}`)
      .then(data => { setProfile(data); setForm({ bio: data.bio||'', skills: data.skills||[], portfolioUrl: data.portfolioUrl||'', githubUrl: data.githubUrl||'', linkedinUrl: data.linkedinUrl||'', location: data.location||'', hourlyRate: data.hourlyRate||'' }); })
      .catch(() => toast.error('Profile not found'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await api.put(`/api/profile/update/${userId}`, form);
      if (data.success) {
        setProfile({ ...profile, ...data.user });
        setEditing(false);
        toast.success('Profile updated! ✅');
      }
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const s = skillInput.trim();
      if (s && !form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="w-9 h-9 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center"><div className="text-5xl mb-3">👤</div><h2 className="font-display text-2xl font-bold">Profile Not Found</h2></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1a1a1a]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-20">

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-black/5 shadow-sm p-8 mb-5">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF9933] to-[#1dbf73] flex items-center justify-center text-white font-display text-3xl font-bold flex-shrink-0">
              {profile.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <input value={form.name || profile.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="field text-2xl font-display font-bold !py-2 mb-2" />
              ) : (
                <h1 className="font-display text-3xl font-bold text-[#1a1a1a] mb-1">{profile.name}</h1>
              )}
              <p className="text-[#1dbf73] text-sm font-body font-medium capitalize mb-1">{profile.role}</p>
              {profile.location && !editing && <p className="text-[#aaa] text-sm font-body">📍 {profile.location}</p>}
              {editing && (
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  placeholder="City, State" className="field !py-2 !text-sm mt-2" />
              )}
            </div>
            {isOwn && (
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <button onClick={handleSave} disabled={saving}
                      className="bg-gradient-to-r from-[#FF9933] to-[#1dbf73] text-white px-5 py-2.5 rounded-xl font-body font-semibold text-sm hover:shadow-md transition-all disabled:opacity-60">
                      {saving ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="border border-[#e0e0e0] text-[#888] px-4 py-2.5 rounded-xl font-body text-sm hover:bg-[#F8F7F4] transition-all">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditing(true)}
                    className="border border-[#e0e0e0] text-[#555] px-5 py-2.5 rounded-xl font-body font-semibold text-sm hover:border-[#1dbf73] hover:text-[#1dbf73] transition-all">
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {profile.role === 'freelancer' && [
            { l: 'Total Applied', v: profile.totalApplications||0, c: '#1dbf73' },
            { l: 'Times Hired', v: profile.hiredCount||0, c: '#FF9933' },
            { l: 'Avg ATS Score', v: `${profile.avgScore||0}/100`, c: '#8b5cf6' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-xl border border-black/5 shadow-sm p-5 text-center">
              <div className="font-display text-3xl font-bold mb-1" style={{ color: s.c }}>{s.v}</div>
              <div className="text-[#aaa] text-xs font-body">{s.l}</div>
            </div>
          ))}
          {profile.hourlyRate > 0 && (
            <div className="bg-white rounded-xl border border-black/5 shadow-sm p-5 text-center">
              <div className="font-display text-3xl font-bold text-[#1dbf73] mb-1">₹{profile.hourlyRate}/hr</div>
              <div className="text-[#aaa] text-xs font-body">Hourly Rate</div>
            </div>
          )}
        </div>

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-4">
          <h2 className="font-display text-lg font-bold text-[#1a1a1a] mb-3">About</h2>
          {editing ? (
            <>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                rows={4} placeholder="Tell employers about yourself, your experience, and what you do best..."
                className="field resize-none text-sm" />
              <div className="mt-3">
                <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-2">Hourly Rate (₹)</label>
                <input type="number" value={form.hourlyRate} onChange={e => setForm({...form, hourlyRate: e.target.value})}
                  placeholder="500" className="field !text-sm" />
              </div>
            </>
          ) : (
            <p className="text-[#666] font-body text-sm leading-relaxed">
              {profile.bio || <span className="text-[#ccc] italic">{isOwn ? 'Add a bio to tell employers about yourself...' : 'No bio added yet.'}</span>}
            </p>
          )}
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-4">
          <h2 className="font-display text-lg font-bold text-[#1a1a1a] mb-3">Skills</h2>
          {editing && (
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill}
              placeholder="Type a skill and press Enter..." className="field !text-sm mb-3" />
          )}
          <div className="flex flex-wrap gap-2">
            {(editing ? form.skills : profile.skills || []).map(s => (
              <span key={s} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-body">
                {s}
                {editing && (
                  <button type="button" onClick={() => setForm({...form, skills: form.skills.filter(x => x !== s)})}
                    className="hover:text-red-400 transition-colors text-xs">✕</button>
                )}
              </span>
            ))}
            {!(editing ? form.skills : profile.skills || []).length && (
              <p className="text-[#ccc] text-sm italic">{isOwn ? 'Add your skills...' : 'No skills listed.'}</p>
            )}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 mb-4">
          <h2 className="font-display text-lg font-bold text-[#1a1a1a] mb-4">Links</h2>
          {editing ? (
            <div className="space-y-3">
              {[
                { k: 'portfolioUrl', l: '🌐 Portfolio URL', p: 'https://yourportfolio.com' },
                { k: 'githubUrl', l: '🐙 GitHub', p: 'https://github.com/username' },
                { k: 'linkedinUrl', l: '💼 LinkedIn', p: 'https://linkedin.com/in/username' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-[11px] font-mono text-[#aaa] tracking-widest uppercase mb-1">{f.l}</label>
                  <input value={form[f.k]} onChange={e => setForm({...form, [f.k]: e.target.value})}
                    placeholder={f.p} className="field !text-sm !py-2.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {[
                { url: profile.portfolioUrl, label: '🌐 Portfolio', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                { url: profile.githubUrl, label: '🐙 GitHub', color: 'bg-gray-50 text-gray-600 border-gray-100' },
                { url: profile.linkedinUrl, label: '💼 LinkedIn', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              ].filter(l => l.url).map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                  className={`text-sm px-4 py-2 rounded-xl border font-body font-medium hover:-translate-y-0.5 transition-all ${l.color}`}>
                  {l.label} ↗
                </a>
              ))}
              {!profile.portfolioUrl && !profile.githubUrl && !profile.linkedinUrl && (
                <p className="text-[#ccc] text-sm italic">{isOwn ? 'Add your links...' : 'No links added.'}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Share profile button (own profile) */}
        {isOwn && (
          <div className="bg-[#F0FDF4] border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-body font-semibold text-emerald-700 text-sm">🔗 Share your profile</p>
              <p className="text-emerald-600 text-xs mt-0.5 font-mono truncate max-w-xs">{window.location.href}</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-lg font-body hover:bg-emerald-700 transition-colors flex-shrink-0">
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
}