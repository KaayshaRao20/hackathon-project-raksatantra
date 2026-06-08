import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, ShieldCheck, Activity, Bell, Zap, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const WORKERS = [
  { id: 'W-001', name: 'Arjun Sharma',   credit: 182, focus: 88, risk: 12, status: 'working',  violations: 1 },
  { id: 'W-002', name: 'Priya Nair',     credit: 145, focus: 58, risk: 62, status: 'idle',     violations: 5 },
  { id: 'W-003', name: 'Rahul Verma',    credit: 198, focus: 94, risk: 8,  status: 'working',  violations: 0 },
  { id: 'W-004', name: 'Sneha Pillai',   credit: 112, focus: 32, risk: 88, status: 'phone',    violations: 8 },
  { id: 'W-005', name: 'Vikram Singh',   credit: 165, focus: 71, risk: 34, status: 'fatigue',  violations: 3 },
];

const ALERTS = [
  { id: 'AL-078', worker: 'Sneha Pillai',  type: 'Phone Usage',    severity: 'critical', time: '11:08:02', reason: 'Mobile device detected for >90 seconds', snapshot: true },
  { id: 'AL-077', worker: 'Priya Nair',    type: 'Idle Behavior',  severity: 'high',     time: '11:02:45', reason: 'No movement detected for 8 minutes',    snapshot: true },
  { id: 'AL-076', worker: 'Vikram Singh',  type: 'Fatigue Signal', severity: 'high',     time: '10:54:11', reason: 'Head tilt + low movement over 15 min',   snapshot: false },
  { id: 'AL-075', worker: 'Arjun Sharma',  type: 'Posture Alert',  severity: 'medium',   time: '10:42:30', reason: 'Unsafe posture sustained for >5 minutes', snapshot: true },
];

const CHART_DATA = [
  { time: '09:00', focus: 82, risk: 18, activity: 74 },
  { time: '09:30', focus: 75, risk: 25, activity: 68 },
  { time: '10:00', focus: 88, risk: 12, activity: 82 },
  { time: '10:30', focus: 70, risk: 40, activity: 60 },
  { time: '11:00', focus: 65, risk: 48, activity: 55 },
  { time: '11:30', focus: 72, risk: 35, activity: 67 },
];

const STATUS_LABELS = { working: 'Working ✅', idle: 'Idle ⚠️', phone: 'Phone ❌', fatigue: 'Fatigue 😴', offline: 'Offline' };
const STATUS_COLORS = { working: 'var(--teal-br)', idle: 'var(--amber-br)', phone: 'var(--red-br)', fatigue: '#c084fc', offline: 'var(--t-lo)' };

const TooltipStyle = { backgroundColor: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' };

const Dashboard = () => {
  const [workers, setWorkers] = useState(WORKERS);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    // 1. Firebase Cloud Sync
    const unsub = onSnapshot(doc(db, 'telemetry', 'live_feed'), (snapshot) => {
      const data = snapshot.data();
      if (data && Date.now() - data.ts < 10000) {
        setWorkers(prev => {
          const updated = [...prev];
          data.workers.forEach(lw => {
            const i = updated.findIndex(u => u.id === lw.id);
            if (i !== -1) {
              updated[i] = { ...updated[i], risk: lw.risk, status: lw.status.toLowerCase(), focus: Math.max(0, 100 - Math.round(lw.risk)) };
            } else if (lw.id.startsWith('EMP-')) {
              updated.push({ id: lw.id, name: `Remote Node (${lw.id})`, credit: 200, focus: 100, risk: lw.risk, status: lw.status.toLowerCase(), violations: 0 });
            }
          });
          return updated;
        });
      }
    });

    // 2. Local fallback sync
    const handleSync = () => {
      const raw = localStorage.getItem('raksha_live_snapshot');
      if (raw) {
        const { workers: liveWorkers, ts } = JSON.parse(raw);
        if (Date.now() - ts < 5000) {
           // similar merge logic...
        }
      }
    };
    window.addEventListener('storage', handleSync);
    return () => { unsub(); window.removeEventListener('storage', handleSync); };
  }, []);

  const kpis = [
    { label: 'Active Workers',   value: workers.filter(w => w.status !== 'offline').length, icon: Users,         color: 'var(--blue-br)',   glow: 'var(--blue-g)' },
    { label: 'Critical Alerts',  value: ALERTS.filter(a => a.severity === 'critical').length, icon: AlertTriangle, color: 'var(--red-br)',    glow: 'var(--red-g)' },
    { label: 'Avg Focus Score',  value: Math.round(workers.reduce((s,w) => s+w.focus,0)/workers.length)+'%', icon: Activity, color: 'var(--teal-br)', glow: 'var(--teal-g)' },
    { label: 'High Risk Workers',value: workers.filter(w => w.risk > 60).length, icon: ShieldCheck, color: 'var(--amber-br)', glow: 'var(--amber-g)' },
  ];

  const filtered = tab === 'all' ? workers : workers.filter(w => w.status === tab);

  return (
    <div className="page-wrap grid-pattern">

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 32 }}>
        <div>
          <div className="eyebrow">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
            Authority Command Center
          </div>
          <h1 className="page-title">Worker Intelligence Hub</h1>
          <p style={{ color: 'var(--t-md)', marginTop: 8, fontSize: '.9rem' }}>Real-time behavior monitoring and performance analytics.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="live-indicator"><div className="live-dot" />Live Feed</div>
          <button className="btn btn-ghost" style={{ gap: 8 }}><Bell size={15} /> Alerts</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {kpis.map((k, i) => (
          <motion.div key={i} className="card card-glow-blue" style={{ padding: '22px 24px' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ padding: 10, borderRadius: 10, background: k.glow, border: `1px solid ${k.color}30` }}>
                <k.icon size={20} color={k.color} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: '2.2rem', fontWeight: 700, color: k.color, textShadow: `0 0 20px ${k.color}60`, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--t-lo)', marginTop: 8 }}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Worker Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 20, background: 'var(--blue)', borderRadius: 99 }} />
                <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Live Personnel Feed</h2>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['all','working','idle','phone','fatigue'].map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`chip ${tab === t ? 'chip-solid-blue' : 'chip-blue'}`} style={{ cursor: 'pointer', border: 'none', fontSize: '.6rem' }}>
                    {t === 'all' ? 'All' : STATUS_LABELS[t].split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Status</th>
                    <th>Credit Score</th>
                    <th>Focus</th>
                    <th>Risk</th>
                    <th style={{ textAlign: 'right' }}>Bonus Est.</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map(w => (
                      <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bg-4)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', fontWeight: 800, color: 'var(--blue-br)', fontFamily: 'var(--font-h)', flexShrink: 0 }}>
                              {w.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--t-hi)' }}>{w.name}</div>
                              <div className="mono" style={{ color: 'var(--t-lo)', fontSize: '.62rem' }}>{w.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span className={`status-dot ${w.status}`} />
                            <span style={{ fontSize: '.78rem', fontWeight: 700, color: STATUS_COLORS[w.status] }}>{STATUS_LABELS[w.status]}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', align: 'center', gap: 8 }}>
                            <span style={{ fontFamily: 'var(--font-h)', fontSize: '1.1rem', fontWeight: 700, color: w.credit < 150 ? 'var(--red-br)' : w.credit < 180 ? 'var(--amber-br)' : 'var(--teal-br)' }}>{w.credit}</span>
                            <span style={{ fontSize: '.62rem', color: 'var(--t-lo)', alignSelf: 'flex-end', marginBottom: 2 }}>/ 200</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ width: 80 }}>
                            <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--t-md)', marginBottom: 5 }}>{w.focus}%</div>
                            <div className="progress-track">
                              <div className={`progress-fill ${w.focus > 70 ? 'teal' : w.focus > 40 ? 'amber' : 'red'}`} style={{ width: `${w.focus}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ width: 80 }}>
                            <div style={{ fontSize: '.72rem', fontWeight: 700, color: w.risk > 60 ? 'var(--red-br)' : 'var(--t-md)', marginBottom: 5 }}>{w.risk}%</div>
                            <div className="progress-track">
                              <div className={`progress-fill ${w.risk > 60 ? 'red' : w.risk > 30 ? 'amber' : 'blue'}`} style={{ width: `${w.risk}%` }} />
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-h)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--amber-br)' }}>₹{(w.credit * 0.5).toFixed(0)}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Focus Trend Chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TrendingUp size={18} color="var(--blue-br)" />
                <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.95rem' }}>Behavior Trend — Today</h3>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                {[{ c: 'var(--teal-br)', l: 'Focus' }, { c: 'var(--red-br)', l: 'Risk' }].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 3, borderRadius: 99, background: item.c }} />
                    <span style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--t-lo)' }}>{item.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--teal)" stopOpacity={.3} />
                    <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--red)" stopOpacity={.3} />
                    <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10 }} domain={[0,100]} />
                <Tooltip contentStyle={TooltipStyle} labelStyle={{ color: 'var(--t-hi)', fontWeight: 700, marginBottom: 4 }} itemStyle={{ color: 'var(--t-md)', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }} />
                <Area type="monotone" dataKey="focus" stroke="var(--teal)" strokeWidth={2.5} fill="url(#gFocus)" dot={false} />
                <Area type="monotone" dataKey="risk"  stroke="var(--red)"  strokeWidth={2.5} fill="url(#gRisk)"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column – Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} color="var(--red-br)" />
                <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem', color: 'var(--red-br)' }}>Active Alerts</h3>
              </div>
              <div className="live-indicator"><div className="live-dot" />Live</div>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {ALERTS.map(a => (
                <div key={a.id} className={`alert-card ${a.severity}`} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className={`chip ${a.severity === 'critical' ? 'chip-solid-red' : a.severity === 'high' ? 'chip-solid-amber' : 'chip-blue'}`}>{a.severity}</span>
                    <span className="mono" style={{ color: 'var(--t-lo)', fontSize: '.65rem' }}>{a.time}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--t-hi)', marginBottom: 4 }}>{a.type}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--t-md)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--blue-br)', fontWeight: 600 }}>{a.worker}</span>
                  </div>
                  <div style={{ fontSize: '.72rem', color: 'var(--t-md)', fontStyle: 'italic', marginBottom: 8 }}>"{a.reason}"</div>
                  {a.snapshot && (
                    <div className="chip chip-teal" style={{ fontSize: '.58rem' }}>📸 Snapshot Captured</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(99,102,241,.05))', borderColor: 'var(--border-hi)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -20, right: -20, opacity: .05 }}><Zap size={140} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ padding: 8, borderRadius: 10, background: 'var(--blue-g)', border: '1px solid rgba(59,130,246,.25)' }}><Zap size={16} color="var(--blue-br)" /></div>
                <span style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--blue-br)' }}>Raksha Neural Advisory</span>
              </div>
              <p style={{ fontSize: '.82rem', color: 'var(--t-md)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>
                "Sneha Pillai has been flagged 3x in this session. Credit deducted by 30 pts. Recommend supervisor intervention in Zone B."
              </p>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '.7rem', letterSpacing: '.1em' }}>
                Deploy Supervisor Alert
              </button>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem', marginBottom: 20 }}>Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={workers.map(w => ({ name: w.name.split(' ')[0], risk: w.risk }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 9, fontWeight: 600 }} />
                <YAxis hide domain={[0,100]} />
                <Tooltip contentStyle={TooltipStyle} />
                <Bar dataKey="risk" radius={[6,6,0,0]}>
                  {workers.map((w, i) => (
                    <rect key={i} fill={w.risk > 60 ? 'var(--red)' : w.risk > 30 ? 'var(--amber)' : 'var(--teal)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Responsive fallback for mobile */}
      <style>{`@media(max-width: 900px){.dash-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
};

export default Dashboard;
