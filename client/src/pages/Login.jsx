import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Chrome, Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', display: 'flex', paddingTop: 76 }}>
      {/* Left Panel – Brand */}
      <div style={{ display: 'none', flex: 1, background: 'linear-gradient(145deg, #1e3a8a 0%, #2563eb 60%, #4f46e5 100%)', position: 'relative', overflow: 'hidden', flexDirection: 'column', justifyContent: 'space-between', padding: '60px' }} className="login-left-panel">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px, transparent 0)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        {/* Big icon decor */}
        <div style={{ position: 'absolute', bottom: -80, right: -80, opacity: .07 }}>
          <Shield size={360} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 80 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,.25)' }}>
              <Shield size={26} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: '1.3rem', color: 'white', lineHeight: 1 }}>SafeSphere</div>
              <div style={{ fontSize: '.62rem', fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginTop: 4 }}>AI Intelligence Platform</div>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '2.8rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.03em' }}>
            Protecting those<br />who build the world.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '40ch', fontWeight: 500 }}>
            Trusted by 340+ industrial sites worldwide to provide real-time AI safety monitoring.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Uptime', value: '99.9%' },
            { label: 'Accuracy', value: '99.8%' },
            { label: 'Sites', value: '340+' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
              <span style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'rgba(255,255,255,.5)' }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: '1.8rem', color: 'white' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel – Form */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '40px 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: 460 }}
        >
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <div style={{ width: 44, height: 44, background: 'var(--c-primary)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,99,235,.4)' }}>
                <Shield size={24} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-h)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--c-slate-900)', lineHeight: 1 }}>SafeSphere</div>
                <div style={{ fontSize: '.6rem', fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--c-primary)', marginTop: 4 }}>AI Intelligence</div>
              </div>
            </div>
            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: '2rem', fontWeight: 900, color: 'var(--c-slate-900)', marginBottom: 8, letterSpacing: '-.03em' }}>
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h1>
            <p style={{ color: 'var(--c-slate-500)', fontWeight: 500 }}>
              {isRegister ? 'Register to access the safety command center.' : 'Sign in to access your safety command center.'}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginBottom: 24, fontSize: '.82rem', gap: 12 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--c-slate-200)' }} />
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--c-slate-400)', textTransform: 'uppercase', letterSpacing: '.1em' }}>or email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--c-slate-200)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Industry Sector / Factory Type</label>
              <select 
                className="form-input" 
                style={{ appearance: 'auto', background: 'var(--bg-2)', cursor: 'pointer', fontWeight: 600 }}
                onChange={e => localStorage.setItem('raksha_factory_type', e.target.value)}
                defaultValue={localStorage.getItem('raksha_factory_type') || 'furnace'}
              >
                <option value="furnace">🔥 Furnace / Heavy Melting</option>
                <option value="health">🏥 Medical / Sterile Zone</option>
                <option value="food">🥪 Food / Biotech Processing</option>
              </select>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-slate-400)' }} />
                <input
                  className="form-input"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-slate-400)' }} />
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--c-slate-400)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--c-red-l)', border: '1.5px solid #fecaca', borderRadius: 10, color: 'var(--c-red)', fontSize: '.82rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '.8rem', marginTop: 4, gap: 10, opacity: loading ? .7 : 1 }}
            >
              {loading ? 'Authenticating...' : (isRegister ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.82rem', color: 'var(--c-slate-500)', fontWeight: 500 }}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--c-primary)', fontWeight: 700, cursor: 'pointer', fontSize: 'inherit' }}
            >
              {isRegister ? 'Sign In' : 'Create one'}
            </button>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <Link to="/dashboard" style={{ fontSize: '.72rem', color: 'var(--c-slate-400)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', borderBottom: '1.5px solid transparent' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--c-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--c-slate-400)'}
            >
              Skip to Dashboard <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .login-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
