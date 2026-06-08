import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Camera, Filter, Search, CheckCircle2, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const ALERTS_DATA = [
  { id: 'AL-082', worker: 'Sneha Pillai',   type: 'Phone Usage',     severity: 'critical', time: '11:08:02', status: 'active',   reason: 'Mobile device detected for >90 seconds', evidence: 'snapshot', deduction: -10, zone: 'Zone B' },
  { id: 'AL-081', worker: 'Priya Nair',     type: 'Idle Behavior',   severity: 'high',     time: '11:02:45', status: 'active',   reason: 'No movement detected for 8+ minutes',     evidence: 'snapshot', deduction: -5,  zone: 'Zone A' },
  { id: 'AL-080', worker: 'Vikram Singh',   type: 'Fatigue Signal',  severity: 'high',     time: '10:54:11', status: 'active',   reason: 'Head tilt pattern + low movement 15 min',  evidence: null,       deduction: -8,  zone: 'Zone C' },
  { id: 'AL-079', worker: 'Arjun Sharma',   type: 'Posture Alert',   severity: 'medium',   time: '10:42:30', status: 'resolved', reason: 'Unsafe posture sustained for >5 minutes',  evidence: 'snapshot', deduction: -8,  zone: 'Zone A' },
  { id: 'AL-078', worker: 'Rahul Verma',    type: 'Idle Behavior',   severity: 'medium',   time: '09:50:10', status: 'resolved', reason: 'Brief inactivity period (3 minutes)',       evidence: null,       deduction: -5,  zone: 'Zone A' },
  { id: 'AL-077', worker: 'Sneha Pillai',   type: 'Phone Usage',     severity: 'critical', time: '09:22:44', status: 'resolved', reason: 'Mobile device detected for >2 minutes',    evidence: 'snapshot', deduction: -10, zone: 'Zone B' },
];

const SEV_COLOR  = { critical: 'var(--red-br)',   high: 'var(--amber-br)', medium: 'var(--blue-br)' };
const SEV_BG     = { critical: 'var(--red-g)',    high: 'var(--amber-g)', medium: 'var(--blue-g)' };
const SEV_BORDER = { critical: 'rgba(239,68,68,.25)', high: 'rgba(245,158,11,.25)', medium: 'rgba(59,130,246,.25)' };

const Alerts = () => {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = ALERTS_DATA.filter(a => {
    if (filter === 'active' && a.status !== 'active') return false;
    if (filter === 'resolved' && a.status !== 'resolved') return false;
    if (filter === 'critical' && a.severity !== 'critical') return false;
    if (search && !a.worker.toLowerCase().includes(search.toLowerCase()) && !a.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: ALERTS_DATA.length,
    active: ALERTS_DATA.filter(a => a.status === 'active').length,
    critical: ALERTS_DATA.filter(a => a.severity === 'critical').length,
    resolved: ALERTS_DATA.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="page-wrap grid-pattern">

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 28 }}>
        <div>
          <div className="eyebrow"><AlertTriangle size={13} /> Incident Management</div>
          <h1 className="page-title">Smart Alert Center</h1>
          <p style={{ color: 'var(--t-md)', marginTop: 6, fontSize: '.88rem' }}>Context-aware alerts with AI-captured evidence and explainable reasons.</p>
        </div>
        <div className="live-indicator"><div className="live-dot" />{counts.active} Active Now</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Alerts', value: counts.total,    color: 'var(--blue-br)' },
          { label: 'Active',       value: counts.active,   color: 'var(--red-br)' },
          { label: 'Critical',     value: counts.critical, color: 'var(--red-br)' },
          { label: 'Resolved',     value: counts.resolved, color: 'var(--teal-br)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--t-lo)', marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'All'], ['active', 'Active'], ['critical', 'Critical'], ['resolved', 'Resolved']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`chip ${filter === val ? 'chip-solid-blue' : 'chip-blue'}`} style={{ cursor: 'pointer', border: 'none', fontSize: '.65rem', padding: '5px 14px' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-lo)' }} />
          <input className="form-input" placeholder="Search worker or event..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38, width: 240, fontSize: '.8rem' }} />
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {filtered.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ background: 'var(--bg-2)', border: `1px solid ${SEV_BORDER[a.severity]}`, borderLeft: `3px solid ${SEV_COLOR[a.severity]}`, borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
            >
              {/* Main Row */}
              <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Severity indicator */}
                  <div style={{ padding: '8px', borderRadius: 10, background: SEV_BG[a.severity] }}>
                    <AlertTriangle size={17} color={SEV_COLOR[a.severity]} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: '.92rem', color: 'var(--t-hi)' }}>{a.type}</span>
                      <span className={`chip ${a.severity === 'critical' ? 'chip-solid-red' : a.severity === 'high' ? 'chip-solid-amber' : 'chip-blue'}`} style={{ fontSize: '.58rem' }}>{a.severity}</span>
                      {a.status === 'resolved' && <span className="chip chip-teal" style={{ fontSize: '.58rem' }}><CheckCircle2 size={10} /> Resolved</span>}
                    </div>
                    <div style={{ fontSize: '.78rem', color: 'var(--t-md)', marginTop: 3 }}>
                      <span style={{ color: 'var(--blue-br)', fontWeight: 600 }}>{a.worker}</span>
                      <span style={{ color: 'var(--t-lo)' }}> · {a.zone}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {a.evidence && <div className="chip chip-red" style={{ fontSize: '.58rem' }}><Camera size={10} /> Snapshot</div>}
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--red-br)' }}>{a.deduction} pts</span>
                  <span className="mono" style={{ color: 'var(--t-lo)', fontSize: '.68rem' }}>{a.time}</span>
                  {expanded === a.id ? <ChevronUp size={16} color="var(--t-lo)" /> : <ChevronDown size={16} color="var(--t-lo)" />}
                </div>
              </div>

              {/* Expanded */}
              <AnimatePresence>
                {expanded === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ borderTop: `1px solid ${SEV_BORDER[a.severity]}`, overflow: 'hidden' }}
                  >
                    <div style={{ padding: '20px 22px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--t-lo)', marginBottom: 8 }}>Explainable AI Reason</div>
                        <div style={{ padding: '12px 16px', background: `${SEV_BG[a.severity]}`, border: `1px solid ${SEV_BORDER[a.severity]}`, borderRadius: 10, fontSize: '.82rem', color: 'var(--t-hi)', lineHeight: 1.7, fontStyle: 'italic' }}>
                          "Alert triggered: <strong>{a.reason}</strong> — Deduction applied: {a.deduction} pts."
                        </div>
                      </div>

                      {a.evidence && (
                        <div>
                          <div style={{ fontSize: '.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.14em', color: 'var(--t-lo)', marginBottom: 8 }}>AI Snapshot Evidence</div>
                          <div style={{ width: 180, height: 110, borderRadius: 10, background: 'var(--bg-4)', border: `1px solid ${SEV_BORDER[a.severity]}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <Camera size={28} color={SEV_COLOR[a.severity]} />
                            <span style={{ fontSize: '.62rem', color: 'var(--t-lo)', fontWeight: 700, textAlign: 'center' }}>Frame captured at {a.time}</span>
                          </div>
                        </div>
                      )}

                      {a.status === 'active' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'flex-end' }}>
                          <button className="btn btn-danger" style={{ fontSize: '.7rem', gap: 8 }}><Zap size={14} /> Escalate</button>
                          <button className="btn btn-ghost" style={{ fontSize: '.7rem' }}>Mark Resolved</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--t-lo)' }}>
            <CheckCircle2 size={40} style={{ margin: '0 auto 16px', color: 'var(--teal-br)' }} />
            <p style={{ fontWeight: 700, fontSize: '.88rem' }}>No alerts match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
