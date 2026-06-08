import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart2, Users, AlertTriangle, Zap } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const DAILY_TREND = [
  { day: 'Mon', focus: 72, risk: 28, productivity: 68, credit: 175 },
  { day: 'Tue', focus: 68, risk: 35, productivity: 62, credit: 168 },
  { day: 'Wed', focus: 80, risk: 22, productivity: 76, credit: 180 },
  { day: 'Thu', focus: 75, risk: 30, productivity: 70, credit: 172 },
  { day: 'Fri', focus: 88, risk: 15, productivity: 84, credit: 186 },
  { day: 'Sat', focus: 82, risk: 20, productivity: 79, credit: 182 },
  { day: 'Sun', focus: 90, risk: 12, productivity: 87, credit: 190 },
];

const WORKER_PERF = [
  { name: 'Arjun S.',   focus: 88, credit: 182, risk: 12, violations: 1 },
  { name: 'Rahul V.',   focus: 94, credit: 198, risk: 8,  violations: 0 },
  { name: 'Vikram S.',  focus: 71, credit: 165, risk: 34, violations: 3 },
  { name: 'Priya N.',   focus: 58, credit: 145, risk: 62, violations: 5 },
  { name: 'Sneha P.',   focus: 32, credit: 112, risk: 88, violations: 8 },
];

const BEHAVIOR_MIX = [
  { hour: '08:00', working: 85, idle: 10, phone: 2, fatigue: 3 },
  { hour: '09:00', working: 80, idle: 12, phone: 5, fatigue: 3 },
  { hour: '10:00', working: 78, idle: 10, phone: 8, fatigue: 4 },
  { hour: '11:00', working: 82, idle: 8,  phone: 6, fatigue: 4 },
  { hour: '12:00', working: 60, idle: 25, phone: 10, fatigue: 5 },
  { hour: '13:00', working: 72, idle: 15, phone: 8, fatigue: 5 },
  { hour: '14:00', working: 75, idle: 12, phone: 6, fatigue: 7 },
  { hour: '15:00', working: 80, idle: 10, phone: 4, fatigue: 6 },
];

const INSIGHTS = [
  { text: 'Team focus improved by 12% vs last week', icon: TrendingUp, color: 'var(--teal-br)', bg: 'var(--teal-g)' },
  { text: 'Phone violations peaked at 12:00 — lunch break needs monitoring', icon: AlertTriangle, color: 'var(--amber-br)', bg: 'var(--amber-g)' },
  { text: 'Rahul Verma ranks #1 for performance this week', icon: Zap, color: 'var(--blue-br)', bg: 'var(--blue-g)' },
  { text: 'Fatigue events +2 compared to last shift — consider rotation', icon: TrendingDown, color: 'var(--red-br)', bg: 'var(--red-g)' },
];

const TS = { backgroundColor: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10 };

const Analytics = () => {
  const [range, setRange] = useState('week');

  return (
    <div className="page-wrap grid-pattern">

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <div className="eyebrow"><BarChart2 size={14} /> Behavior Intelligence</div>
          <h1 className="page-title">Performance Analytics</h1>
          <p style={{ color: 'var(--t-md)', marginTop: 6, fontSize: '.88rem' }}>Track trends, detect degradation, and improve workforce outcomes.</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['day', 'week', 'month'].map(r => (
            <button key={r} onClick={() => setRange(r)} className={`chip ${range === r ? 'chip-solid-blue' : 'chip-blue'}`} style={{ cursor: 'pointer', border: 'none', padding: '6px 16px', fontSize: '.65rem', textTransform: 'capitalize' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 12, marginBottom: 24 }}>
        {INSIGHTS.map((ins, i) => (
          <div key={i} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, background: ins.bg, borderColor: `${ins.color}30` }}>
            <div style={{ padding: 8, borderRadius: 10, background: `${ins.color}20`, flexShrink: 0 }}><ins.icon size={16} color={ins.color} /></div>
            <p style={{ fontSize: '.78rem', color: 'var(--t-hi)', fontWeight: 600, lineHeight: 1.55 }}>{ins.text}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Focus & Risk Trend */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <TrendingUp size={17} color="var(--blue-br)" />
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem' }}>Focus & Risk Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DAILY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10 }} domain={[0,100]} />
              <Tooltip contentStyle={TS} />
              <Line type="monotone" dataKey="focus" stroke="var(--teal)" strokeWidth={2.5} dot={{ fill: 'var(--teal)', r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="risk"  stroke="var(--red)"  strokeWidth={2.5} dot={{ fill: 'var(--red)',  r: 3 }} activeDot={{ r: 5 }} strokeDasharray="4 2" />
              <Legend wrapperStyle={{ fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--t-lo)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Credit Score Trend */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Zap size={17} color="var(--amber-br)" />
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem' }}>Avg Credit Score</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={DAILY_TREND}>
              <defs>
                <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--amber)" stopOpacity={.3} />
                  <stop offset="95%" stopColor="var(--amber)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10, fontWeight: 600 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10 }} domain={[140,200]} />
              <Tooltip contentStyle={TS} />
              <Area type="monotone" dataKey="credit" stroke="var(--amber)" strokeWidth={2.5} fill="url(#creditGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Behavior Mix */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={17} color="var(--blue-br)" />
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem' }}>Behavior Mix — Hourly</h3>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[{ c: 'var(--teal)', l: 'Working' }, { c: 'var(--amber)', l: 'Idle' }, { c: 'var(--red)', l: 'Phone' }, { c: '#a855f7', l: 'Fatigue' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 99, background: item.c }} />
                <span style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--t-lo)' }}>{item.l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={BEHAVIOR_MIX} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(59,130,246,.07)" vertical={false} />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10, fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--t-lo)', fontSize: 10 }} />
            <Tooltip contentStyle={TS} />
            <Bar dataKey="working" stackId="a" fill="var(--teal)"  radius={[0,0,0,0]} />
            <Bar dataKey="idle"    stackId="a" fill="var(--amber)" />
            <Bar dataKey="phone"   stackId="a" fill="var(--red)" />
            <Bar dataKey="fatigue" stackId="a" fill="#a855f7" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── PREDICTIVE RISK FORECASTING (HACKATHON REQUIREMENT) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
         <div className="card" style={{ padding: 24, background: 'var(--blue-g)', borderColor: 'var(--blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
               <Brain size={18} color="var(--blue-br)" />
               <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: '1rem', color: 'var(--blue-br)' }}>Neural Risk Forecast — Shift B</h3>
               <div className="chip chip-blue" style={{ marginLeft: 'auto' }}>AI Model: SafeSphere-X2</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
               {[
                  { label: 'Accident Prob.', val: '4.2%', col: 'var(--teal-br)', trend: 'down' },
                  { label: 'Fatigue Spike', val: '14:30', col: 'var(--amber-br)', trend: 'up' },
                  { label: 'PPE Compliance', val: '98.8%', col: 'var(--teal-br)', trend: 'up' },
                  { label: 'Predicted Alerts', val: '2-4', col: 'var(--blue-br)', trend: 'down' },
               ].map((idx, i) => (
                  <div key={i} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ fontSize: '.58rem', fontWeight: 800, color: 'var(--t-lo)', textTransform: 'uppercase', marginBottom: 8 }}>{idx.label}</div>
                     <div style={{ fontSize: '1.4rem', fontWeight: 800, color: idx.col, fontFamily: 'var(--font-h)' }}>{idx.val}</div>
                  </div>
               ))}
            </div>
            
            <div style={{ marginTop: 24, padding: 20, borderRadius: 12, background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Zap size={15} color="var(--amber-br)" />
                  <span style={{ fontSize: '.75rem', fontWeight: 800, color: 'white' }}>Predictive Insight</span>
               </div>
               <p style={{ fontSize: '.82rem', color: 'var(--t-md)', lineHeight: 1.6 }}>
                 "Risk modeling predicts a potential fatigue cluster at 14:30 in Assembly Line B. Recommendation: Shift employee breaks 15 minutes earlier to mitigate focus degradation."
               </p>
            </div>
         </div>
         
         <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-h)', fontSize: '.9rem', fontWeight: 800, marginBottom: 16, textTransform: 'uppercase' }}>Hazard Heatmap Prediction</h3>
            <div style={{ height: 180, background: 'var(--bg-1)', borderRadius: 12, position: 'relative', border: '1px solid var(--border)', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: '20%', left: '30%', width: 60, height: 60, background: 'rgba(239, 68, 68, 0.4)', filter: 'blur(20px)', borderRadius: '50%', animation: 'pulse-ring 2s infinite' }} />
               <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 40, height: 40, background: 'rgba(245, 158, 11, 0.3)', filter: 'blur(15px)', borderRadius: '50%' }} />
               <div style={{ position: 'absolute', inset: 0, padding: 12, fontSize: '.6rem', color: 'var(--t-lo)', fontWeight: 800 }}>Zone Visualizer</div>
            </div>
            <p style={{ fontSize: '.68rem', color: 'var(--t-lo)', marginTop: 12, textAlign: 'center' }}>Zone A (Melting Furnace) flagged for thermal hazard prediction</p>
         </div>
      </div>

      {/* Worker Performance Leaderboard */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 20, background: 'var(--blue)', borderRadius: 99 }} />
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', fontSize: '.9rem' }}>Performance Leaderboard</h3>
          </div>
          <span className="chip chip-blue">This Week</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Worker</th>
              <th>Focus Score</th>
              <th>Credit Score</th>
              <th>Risk Score</th>
              <th>Violations</th>
              <th style={{ textAlign: 'right' }}>Bonus</th>
            </tr>
          </thead>
          <tbody>
            {WORKER_PERF.sort((a,b) => b.focus - a.focus).map((w, i) => (
              <tr key={i}>
                <td>
                  <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.1rem', color: i === 0 ? 'var(--amber-br)' : i === 1 ? 'var(--t-md)' : 'var(--t-lo)' }}>#{i+1}</span>
                </td>
                <td style={{ fontWeight: 700, fontSize: '.88rem' }}>{w.name}</td>
                <td>
                  <div style={{ display: 'flex', align: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-h)', fontSize: '1rem', fontWeight: 700, color: w.focus > 80 ? 'var(--teal-br)' : w.focus > 60 ? 'var(--amber-br)' : 'var(--red-br)' }}>{w.focus}%</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: w.credit >= 180 ? 'var(--teal-br)' : w.credit >= 150 ? 'var(--amber-br)' : 'var(--red-br)' }}>{w.credit}</td>
                <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: w.risk < 20 ? 'var(--teal-br)' : w.risk < 50 ? 'var(--amber-br)' : 'var(--red-br)' }}>{w.risk}%</td>
                <td><span className={`chip ${w.violations === 0 ? 'chip-teal' : w.violations < 4 ? 'chip-amber' : 'chip-red'}`}>{w.violations}</span></td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--amber-br)', fontSize: '1rem' }}>₹{(w.credit * 0.5).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
