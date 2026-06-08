import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, Gift, Bell, Shield, Activity, ChevronRight, CheckCircle2, AlertCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const WORKER = {
  id: 'W-003',
  name: 'Rahul Verma',
  role: 'Assembly Line Operator',
  shift: 'Morning (08:00 – 16:00)',
  credit: 182,
  focus: 88,
  risk: 14,
  bonus: 91,
  trend: 'improving',
};

const DEDUCTIONS = [
  { reason: 'Idle Behavior (08:45)', pts: -5,  time: '08:45' },
  { reason: 'Unsafe Posture (10:12)', pts: -8,  time: '10:12' },
];

const FOCUS_TREND = [
  { time: '09:00', focus: 72, risk: 28 },
  { time: '09:30', focus: 80, risk: 22 },
  { time: '10:00', focus: 88, risk: 14 },
  { time: '10:30', focus: 84, risk: 18 },
  { time: '11:00', focus: 92, risk: 10 },
  { time: '11:30', focus: 88, risk: 14 },
];

const RADAR_DATA = [
  { subject: 'Attention', A: 88 },
  { subject: 'Posture', A: 74 },
  { subject: 'Consistency', A: 91 },
  { subject: 'Activity', A: 82 },
  { subject: 'Safety', A: 96 },
  { subject: 'Engagement', A: 85 },
];

const ALERTS_RECEIVED = [
  { type: 'Posture Alert',  time: '10:12', severity: 'medium', resolved: true },
  { type: 'Idle Warning',   time: '08:45', severity: 'medium', resolved: true },
];

const TIPS = [
  'Maintain upright posture — it improves your posture score by +8 pts',
  'Keep focus sessions below 90 min then take a 5-min break for best scores',
  'Your consistency score is excellent! Keep it up.',
];

const TooltipStyle = { backgroundColor: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10 };

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [liveAlert, setLiveAlert] = useState(null);

  // Cross-tab real-time listener from AI Camera
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'raksha_violation') {
        const data = JSON.parse(e.newValue);
        setLiveAlert(data.state);
        
        // Regional Language TTS Engine (Hindi)
        const msgs = {
          phone: "Kripaya apna phone rakh dein. Kaam par dhyaan dijiye.",
          fatigue: "Chetawani! So jana mana hai. Stop, Stop, Stop.",
          unsafe: "Chetawani! Kripaya apna safety gear aur helmet pehne.",
          idle: "Kripaya apni jagah par wapas jayein."
        };
        
        if (msgs[data.state] && window.speechSynthesis) {
          window.speechSynthesis.cancel(); // clear queue
          const ut = new SpeechSynthesisUtterance(msgs[data.state]);
          ut.lang = 'hi-IN'; // Hindi voice
          ut.rate = 0.9;
          ut.pitch = 1.1;
          window.speechSynthesis.speak(ut);
        }

        // Auto dismiss after 6 seconds
        setTimeout(() => setLiveAlert(null), 6000);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const creditColor = WORKER.credit >= 180 ? 'var(--teal-br)' : WORKER.credit >= 150 ? 'var(--amber-br)' : 'var(--red-br)';
  const pct = WORKER.credit / 200;

  return (
    <div className="page-wrap grid-pattern">

      {/* EMERGENCY TAKEOVER OVERLAY */}
      <AnimatePresence>
        {liveAlert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(239, 68, 68, 0.9)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 20 }}
          >
            <motion.div 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              style={{ background: '#0a0a0f', padding: '50px', borderRadius: 24, textAlign: 'center', border: '2px solid var(--red-br)', boxShadow: '0 0 100px rgba(239, 68, 68, 0.5)', maxWidth: 600 }}
            >
              <AlertTriangle size={80} color="var(--red-br)" style={{ margin: '0 auto 20px', animation: 'spin 2s linear infinite' }} />
              <h2 style={{ fontFamily: 'var(--font-h)', fontSize: '2.5rem', color: 'white', textTransform: 'uppercase', marginBottom: 16 }}>AI Violation Detected</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--red-br)', fontWeight: 700, marginBottom: 10 }}>
                {liveAlert === 'phone' ? 'UNAUTHORIZED PHONE USAGE IN WORK ZONE' : 
                 liveAlert === 'fatigue' ? 'DANGEROUS FATIGUE / SLEEPING DETECTED' : 
                 liveAlert === 'unsafe' ? 'MISSING CRITICAL SAFETY EQUIPMENT (HELMET/VEST)' : 
                 'WORKER ABSENT FROM ASSIGNED STATION'}
              </p>
              <p style={{ color: 'var(--t-md)', fontSize: '1rem', marginTop: 20 }}>A audio warning has been played. Please correct your behavior immediately to prevent further point deductions.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--blue), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.3rem', color: 'white', boxShadow: 'var(--glow-blue)' }}>
            {WORKER.name.split(' ').map(n=>n[0]).join('')}
          </div>
          <div>
            <div className="eyebrow">Worker Intelligence View</div>
            <h1 className="page-title" style={{ fontSize: '1.8rem' }}>{WORKER.name}</h1>
            <p style={{ color: 'var(--t-md)', fontSize: '.82rem', marginTop: 4 }}>{WORKER.role} · {WORKER.shift}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="chip chip-teal">
            <TrendingUp size={12} />
            Trend: Improving
          </div>
          <div className="chip chip-blue mono">{WORKER.id}</div>
        </div>
      </div>

      {/* Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>

        {/* Credit Score - Special */}
        <motion.div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(20,184,166,.1), rgba(59,130,246,.08))', borderColor: `${creditColor}40`, gridColumn: 'span 1' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--t-lo)', marginBottom: 10 }}>Credit Score</div>
          {/* Circular progress */}
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 12px' }}>
            <svg viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--bg-4)" strokeWidth="6" />
              <circle cx="40" cy="40" r="34" fill="none" stroke={creditColor} strokeWidth="6" strokeDasharray={`${pct * 213.6} 213.6`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${creditColor})` }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.4rem', color: creditColor }}>{WORKER.credit}</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '.68rem', color: 'var(--t-lo)', fontWeight: 600 }}>of 200 pts</div>
          <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
          {DEDUCTIONS.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.7rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--t-md)' }}>{d.reason}</span>
              <span style={{ color: 'var(--red-br)', fontWeight: 700 }}>{d.pts}</span>
            </div>
          ))}
        </motion.div>

        {/* Focus Score */}
        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .07 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--t-lo)', marginBottom: 10 }}>Focus Score</div>
          <div style={{ fontFamily: 'var(--font-h)', fontSize: '3rem', fontWeight: 700, color: 'var(--blue-br)', textShadow: '0 0 20px rgba(59,130,246,.5)', lineHeight: 1 }}>{WORKER.focus}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--t-lo)', margin: '6px 0 16px', fontWeight: 600 }}>/ 100 points</div>
          <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-4)', overflow: 'hidden' }}>
            <div style={{ width: `${WORKER.focus}%`, height: '100%', background: 'linear-gradient(90deg, var(--blue), var(--blue-br))', borderRadius: 99, boxShadow: '0 0 10px var(--blue)' }} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={14} color="var(--teal-br)" />
            <span style={{ fontSize: '.72rem', color: 'var(--teal-br)', fontWeight: 700 }}>+15% from yesterday</span>
          </div>
        </motion.div>

        {/* Risk Score */}
        <motion.div className="card" style={{ padding: 24 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .14 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--t-lo)', marginBottom: 10 }}>Risk Score</div>
          <div style={{ fontFamily: 'var(--font-h)', fontSize: '3rem', fontWeight: 700, color: WORKER.risk < 30 ? 'var(--teal-br)' : WORKER.risk < 60 ? 'var(--amber-br)' : 'var(--red-br)', lineHeight: 1 }}>{WORKER.risk}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--t-lo)', margin: '6px 0 16px', fontWeight: 600 }}>/ 100 (lower = safer)</div>
          <div style={{ height: 6, borderRadius: 99, background: 'var(--bg-4)', overflow: 'hidden' }}>
            <div style={{ width: `${WORKER.risk}%`, height: '100%', background: 'linear-gradient(90deg, var(--teal), var(--teal-br))', borderRadius: 99, boxShadow: '0 0 10px var(--teal)' }} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingDown size={14} color="var(--teal-br)" />
            <span style={{ fontSize: '.72rem', color: 'var(--teal-br)', fontWeight: 700 }}>Risk reduced by 8 pts today</span>
          </div>
        </motion.div>

        {/* Bonus Estimate */}
        <motion.div className="card" style={{ padding: 24, background: 'rgba(245,158,11,.07)', borderColor: 'rgba(245,158,11,.3)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .21 }}>
          <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--t-lo)', marginBottom: 10 }}>
            <Gift size={12} style={{ display: 'inline', marginRight: 6 }} />Bonus Estimate
          </div>
          <div style={{ fontFamily: 'var(--font-h)', fontSize: '3rem', fontWeight: 700, color: 'var(--amber-br)', lineHeight: 1 }}>₹{WORKER.bonus}</div>
          <div style={{ fontSize: '.68rem', color: 'var(--t-lo)', margin: '6px 0 16px', fontWeight: 600 }}>{WORKER.credit} pts × 0.5 = ₹{WORKER.bonus}</div>
          <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
          <div style={{ fontSize: '.72rem', color: 'var(--amber-br)', fontWeight: 700 }}>
            💡 Reach 200 pts → ₹100 bonus
          </div>
        </motion.div>

        {/* IoT WEARABLE SYNC (HACKATHON REQUIREMENT) */}
        <motion.div className="card" style={{ padding: '20px 24px', background: 'var(--blue-g)', borderColor: 'var(--blue)' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .3 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Activity size={15} color="var(--blue-br)" />
              <div style={{ fontSize: '.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--blue-br)' }}>IoT Wearable Hub</div>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
                 <div style={{ fontSize: '.55rem', color: 'var(--t-lo)', fontWeight: 700, marginBottom: 4 }}>HEART RATE</div>
                 <div style={{ fontFamily: 'var(--font-h)', fontSize: '1.4rem', color: 'var(--red-br)', fontWeight: 700 }}>74 <span style={{ fontSize: '.6rem' }}>BPM</span></div>
              </div>
              <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
                 <div style={{ fontSize: '.55rem', color: 'var(--t-lo)', fontWeight: 700, marginBottom: 4 }}>BODY TEMP</div>
                 <div style={{ fontFamily: 'var(--font-h)', fontSize: '1.4rem', color: 'var(--teal-br)', fontWeight: 700 }}>98.6<span style={{ fontSize: '.6rem' }}>°F</span></div>
              </div>
           </div>
           
           <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--teal-br)', fontSize: '.68rem', fontWeight: 600 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal-br)', animation: 'pulse-ring 1s infinite' }} />
              Health Sensors Synchronized
           </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Focus Trend Chart */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Activity size={16} color="var(--blue-br)" />
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem' }}>Your Performance Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={FOCUS_TREND}>
                <defs>
                  <linearGradient id="wFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue)" stopOpacity={.3} />
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10 }} domain={[0,100]} />
                <Tooltip contentStyle={TooltipStyle} />
                <Area type="monotone" dataKey="focus" stroke="var(--blue)" strokeWidth={2.5} fill="url(#wFocus)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Radar */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem', marginBottom: 20 }}>Performance Dimensions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--t-lo)', fontSize: 11, fontWeight: 700 }} />
                <Radar dataKey="A" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* AI Feedback */}
          <div className="card" style={{ padding: 22, background: 'linear-gradient(135deg, rgba(59,130,246,.08), rgba(99,102,241,.06))', borderColor: 'var(--border-hi)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Star size={16} color="var(--amber-br)" />
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.88rem', color: 'var(--amber-br)' }}>AI Feedback</h3>
            </div>
            <p style={{ fontSize: '.82rem', color: 'var(--t-md)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
              "Your focus improved by 15% today! Consistent performance in morning session. Reduce the occasional idle periods to maximize your bonus."
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="chip chip-teal"><CheckCircle2 size={11} /> Great focus</div>
              <div className="chip chip-amber"><AlertCircle size={11} /> Reduce idle</div>
            </div>
          </div>

          {/* Alerts Received */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={15} color="var(--amber-br)" />
                <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.88rem' }}>Alerts Received</h3>
              </div>
              <span className="chip chip-amber">{ALERTS_RECEIVED.length} today</span>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ALERTS_RECEIVED.map((a, i) => (
                <div key={i} className={`alert-card ${a.severity}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--t-hi)' }}>{a.type}</span>
                    <span className="mono" style={{ fontSize: '.6rem', color: 'var(--t-lo)' }}>{a.time}</span>
                  </div>
                  {a.resolved && <span className="chip chip-teal" style={{ fontSize: '.58rem' }}><CheckCircle2 size={10} /> Resolved</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Lightbulb size={15} color="var(--amber-br)" />
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '.88rem' }}>Improvement Tips</h3>
            </div>
            {TIPS.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue-br)', flexShrink: 0, marginTop: 7, boxShadow: '0 0 6px var(--blue)' }} />
                <p style={{ fontSize: '.78rem', color: 'var(--t-md)', lineHeight: 1.6 }}>{tip}</p>
              </div>
            ))}
          </div>

          {/* Privacy notice */}
          <div className="card" style={{ padding: 16, background: 'rgba(20,184,166,.06)', borderColor: 'rgba(20,184,166,.2)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Shield size={16} color="var(--teal-br)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '.72rem', color: 'var(--teal-br)', lineHeight: 1.6, fontWeight: 500 }}>
                Your data is transparent and private. All scoring deductions are explained. You can view, dispute, and appeal any record.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
