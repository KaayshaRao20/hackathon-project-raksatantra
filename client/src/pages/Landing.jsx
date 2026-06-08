import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, Brain, Target, TrendingUp, ArrowRight, CheckCircle2, Users, AlertTriangle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: Eye, color: 'var(--blue-br)', bg: 'var(--blue-g)', title: 'AI Vision Engine', desc: 'Real-time webcam-based detection of worker presence, posture, phone usage and fatigue indicators with bounding box overlays.' },
  { icon: Brain, color: 'var(--teal-br)', bg: 'var(--teal-g)', title: 'Behavior Intelligence', desc: 'Continuously classifies behavior as Productive, Idle, Distracted or Fatigued and tracks patterns over time.' },
  { icon: Target, color: 'var(--amber-br)', bg: 'var(--amber-g)', title: 'Dynamic Scoring', desc: 'Credit Score, Focus Score, and Risk Score updated in real-time based on observed worker behavior.' },
  { icon: TrendingUp, color: '#a855f7', bg: 'rgba(168,85,247,.12)', title: 'Trend Analytics', desc: 'Track performance over sessions, detect improvement or degradation, and show trend graphs with insights.' },
  { icon: AlertTriangle, color: 'var(--red-br)', bg: 'var(--red-g)', title: 'Smart Alerts + Snapshots', desc: 'Context-aware alerts with AI-captured snapshots and explainable reasons for every incident.' },
  { icon: Shield, color: 'var(--teal-br)', bg: 'var(--teal-g)', title: 'Ethical & Fair System', desc: 'Transparent scoring with clear deductions, worker-visible data, and improvement suggestions — no hidden penalties.' },
];

const STATS = [
  { label: 'Workers Monitored', value: '25,480+', icon: Users },
  { label: 'Alerts Prevented', value: '1,200+', icon: AlertTriangle },
  { label: 'Detection Accuracy', value: '99.8%', icon: Target },
  { label: 'Sites Deployed', value: '340+', icon: Activity },
];

const Landing = () => (
  <div style={{ background: 'var(--bg-0)', minHeight: '100vh', paddingTop: 64 }}>

    {/* ── HERO ── */}
    <section className="grid-pattern" style={{ padding: '80px 28px 100px', position: 'relative', overflow: 'hidden' }}>
      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: -200, left: '20%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <div className="live-indicator" style={{ display: 'inline-flex', marginBottom: 32, padding: '6px 20px', background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)', color: 'var(--blue-br)' }}>
            <div className="live-dot" style={{ background: 'var(--blue-br)' }} /> SafeSphere Enterprise Node: Operational
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .1 }} style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'none', marginBottom: 28, lineHeight: 0.95, color: 'white' }}>
          Protect your most
          <br />
          <span style={{ color: 'var(--blue-br)', opacity: 0.9 }}>valuable asset.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }} style={{ color: 'var(--t-md)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '60ch', margin: '0 auto 56px', fontWeight: 500, letterSpacing: '-0.01em' }}>
          The world's most advanced AI safety engine for industrial environments. Monitor behavior, mitigate risk, and reward excellence through transparent neural intelligence.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ gap: 12, padding: '18px 48px', fontSize: '.85rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/monitoring" className="btn btn-ghost btn-lg" style={{ gap: 12, padding: '18px 48px', fontSize: '.85rem' }}>
            Live Demo <Eye size={18} />
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, maxWidth: 900, margin: '72px auto 0' }}>
          {STATS.map((s, i) => (
            <div key={i} className="card" style={{ padding: '24px 16px', textAlign: 'center' }}>
              <s.icon size={22} color="var(--blue-br)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontFamily: 'var(--font-h)', fontSize: '2rem', fontWeight: 700, color: 'var(--t-hi)' }}>{s.value}</div>
              <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--t-lo)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── FEATURES ── */}
    <section style={{ padding: '80px 28px', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Core Intelligence Pillars</div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--t-hi)', marginBottom: 16 }}>
            Built for the Industrial Age of AI
          </h2>
          <p style={{ color: 'var(--t-md)', maxWidth: '55ch', margin: '0 auto', lineHeight: 1.7 }}>
            Rakshatantra goes beyond surveillance — it understands, improves, and rewards.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} className="card card-glow-blue" style={{ padding: 32, cursor: 'default' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon size={26} color={f.color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--t-hi)', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: 'var(--t-md)', lineHeight: 1.7, fontSize: '.88rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── SCORING SYSTEM EXPLAINER ── */}
    <section style={{ padding: '80px 28px', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>The Scoring Engine</div>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--t-hi)' }}>Transparent. Fair. Explainable.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { title: 'Credit Score', start: '200 pts', rules: ['Phone usage → −10 pts', 'Idle behavior → −5 pts', 'Unsafe posture → −8 pts'], color: 'var(--amber-br)', glow: 'var(--amber-g)' },
            { title: 'Focus Score', start: '0 – 100', rules: ['Based on activity level', 'Consistency tracking', 'Engagement over time'], color: 'var(--blue-br)', glow: 'var(--blue-g)' },
            { title: 'Risk Score', start: '0 – 100', rules: ['Fatigue indicators', 'Extended inactivity', 'Distraction frequency'], color: 'var(--red-br)', glow: 'var(--red-g)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: s.color, marginBottom: 8 }}>Score Type</div>
              <div style={{ fontFamily: 'var(--font-h)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--t-hi)', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: '.78rem', color: 'var(--t-md)', marginBottom: 20, fontWeight: 600 }}>Starts at {s.start}</div>
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
              {s.rules.map((r, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0, boxShadow: `0 0 6px ${s.color}` }} />
                  <span style={{ fontSize: '.82rem', color: 'var(--t-md)' }}>{r}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <div className="card" style={{ display: 'inline-block', padding: '20px 40px', background: 'rgba(245,158,11,.08)', borderColor: 'rgba(245,158,11,.25)' }}>
            <span style={{ fontFamily: 'var(--font-h)', fontSize: '1.1rem', color: 'var(--amber-br)', fontWeight: 700, letterSpacing: '.06em' }}>
              💰 BONUS = Credit Points × 0.5 &nbsp;|&nbsp; Example: 170 pts → ₹85 bonus
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* ── CTA ── */}
    <section style={{ padding: '80px 28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '72px 48px', background: 'linear-gradient(135deg, rgba(59,130,246,.1) 0%, rgba(99,102,241,.1) 100%)', borderColor: 'var(--border-hi)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, opacity: .04 }}><Shield size={300} /></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--t-hi)', marginBottom: 16 }}>
              Ready to protect your workforce?
            </h2>
            <p style={{ color: 'var(--t-md)', marginBottom: 40, fontSize: '1rem' }}>
              No IoT devices required. Just a laptop webcam and Rakshatantra AI.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
                Start Monitoring <ArrowRight size={18} />
              </Link>
              <Link to="/worker" className="btn btn-ghost btn-lg">
                Worker Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer style={{ textAlign: 'center', padding: '40px 28px', borderTop: '1px solid var(--border)', color: 'var(--t-lo)', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.08em', textTransform: 'capitalize' }}>
      © 2026 SafeSphere AI Systems Inc. · Privacy · Terms · Industrial Safety Standard 4.0
    </footer>
  </div>
);

export default Landing;
