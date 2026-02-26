import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardFreelancer from './pages/DashboardFreelancer';
import DashboardEmployer from './pages/DashboardEmployer';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import AtsResult from './pages/AtsResult';
import About from './pages/About';
import Contact from './pages/Contact';

const Spinner = () => (
  <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#1dbf73] border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to={user.role==='employer'?'/dashboard/employer':'/dashboard/freelancer'} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard/freelancer" element={<ProtectedRoute role="freelancer"><DashboardFreelancer /></ProtectedRoute>} />
      <Route path="/dashboard/employer" element={<ProtectedRoute role="employer"><DashboardEmployer /></ProtectedRoute>} />
      <Route path="/post-job" element={<ProtectedRoute role="employer"><PostJob /></ProtectedRoute>} />
      <Route path="/apply/:jobId" element={<ProtectedRoute role="freelancer"><ApplyJob /></ProtectedRoute>} />
      <Route path="/ats-result" element={<ProtectedRoute role="freelancer"><AtsResult /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background:'#ffffff', color:'#1a1a1a', border:'1px solid rgba(0,0,0,0.08)', fontFamily:"'DM Sans', sans-serif", borderRadius:'12px', fontSize:'14px' },
          success: { iconTheme: { primary:'#1dbf73', secondary:'#fff' } },
          error: { iconTheme: { primary:'#ef4444', secondary:'#fff' } },
        }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
