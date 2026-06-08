import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Activity, Heart, Shield, AlertTriangle, TrendingUp, Calendar, MapPin, Zap, Layers, ChevronRight, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const [heartData, setHeartData] = useState([]);
  const worker = {
    id: 'W-2139',
    name: 'Aria Stark',
    role: 'Zone Supervisor',
    sector: 'Sector Delta',
    shift: '08:00 - 16:00',
    biometrics: {
      avgHeartRate: 78,
      fatigueIndex: 68,
      riskScore: 74,
      compliance: '99.2%'
    },
    alerts: [
      { id: 1, type: 'PPE Violation', date: '2024-03-18', severity: 'high' },
      { id: 2, type: 'High Heart Rate', date: '2024-03-15', severity: 'medium' },
      { id: 3, type: 'Fatigue Threshold', date: '2024-03-10', severity: 'low' },
    ]
  };

  useEffect(() => {
    // Generate initial data
    const data = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      rate: 70 + Math.floor(Math.random() * 20)
    }));
    setHeartData(data);

    const interval = setInterval(() => {
      setHeartData(prev => [
        ...prev.slice(1),
        { time: prev[prev.length - 1].time + 1, rate: 70 + Math.floor(Math.random() * 20) }
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-[#fdfdfd] grid-paper">
      {/* Profile Header Block */}
      <div className="glass-card bg-white border-white p-12 mb-12 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-700">
            <User size={260} className="text-slate-900" />
         </div>
         <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
            <div className="w-48 h-48 rounded-[48px] border-8 border-slate-50 overflow-hidden shadow-2xl shadow-slate-200">
               <img src="https://i.pravatar.cc/300?u=W-2139" alt="U" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col pt-4">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                  <h1 className="text-5xl font-extrabold heading-font text-slate-900 tracking-tight">{worker.name}</h1>
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">Active Node</span>
               </div>
               <p className="text-xl font-extrabold heading-font text-blue-600 uppercase tracking-widest mb-8 decoration-blue-200 underline underline-offset-8 italic">{worker.role}</p>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-slate-50 pt-8">
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Registry Node</span>
                     <span className="text-sm font-bold text-slate-900">{worker.id}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><Layers size={12} /> Operation Zone</span>
                     <span className="text-sm font-bold text-slate-900">{worker.sector}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> Shift Cycle</span>
                     <span className="text-sm font-bold text-slate-900">{worker.shift}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                     <button className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline transition-all">Audit Global Log <ChevronRight size={14} /></button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-10">
            {/* Heart Rate Telemetry Chart */}
            <div className="glass-card bg-white border-white p-10 h-[460px] flex flex-col">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100"><Heart size={20} className="animate-pulse" /></div>
                     <div>
                        <h3 className="text-lg font-extrabold heading-font text-slate-900 uppercase tracking-tight">Vitals Stream</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Link Latency: 2ms</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-xl">
                     <span className="text-2xl font-extrabold heading-font leading-none">{heartData[heartData.length-1]?.rate}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">bpm</span>
                  </div>
               </div>
               <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={heartData}>
                        <defs>
                           <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" hide />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[60, 110]} />
                        <Tooltip content={() => null} />
                        <Area type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorPulse)" animationDuration={1000} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-8 flex justify-center gap-8 border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resting Avg:</span>
                     <span className="text-sm font-extrabold text-slate-900">72 bpm</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Peak Recorded:</span>
                     <span className="text-sm font-extrabold text-red-600">114 bpm</span>
                  </div>
               </div>
            </div>

            {/* Alert History Audit */}
            <div className="glass-card bg-white border-white p-10">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100"><Activity size={20} /></div>
                     <div>
                        <h3 className="text-lg font-extrabold heading-font text-slate-900 uppercase tracking-tight">Compliance History</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Vision Safety Logs</p>
                     </div>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-50 px-4 py-2 rounded-xl bg-blue-50">Full Audit History</button>
               </div>
               <div className="space-y-4">
                  {worker.alerts.map((alert, i) => (
                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                       <div className="flex items-center gap-6">
                          <div className={`w-3 h-3 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                          <div>
                             <h4 className="text-sm font-extrabold uppercase tracking-tight text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{alert.type}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {alert.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${alert.severity === 'high' ? 'bg-red-100 text-red-600 border border-red-100' : alert.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                             {alert.severity} P-Level
                          </span>
                          <button className="p-2 text-slate-400 group-hover:text-slate-900"><MoreHorizontal size={18} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-10">
            {/* Risk Fingerprint Card */}
            <div className="glass-card bg-slate-900 p-10 text-white relative overflow-hidden group border-none shadow-2xl shadow-blue-600/30">
               <div className="absolute top-0 right-0 p-10 opacity-20 pointer-events-none group-hover:rotate-6 transition-transform duration-700">
                  <Shield size={160} className="text-blue-400" />
               </div>
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-blue-400">
                        <TrendingUp size={24} />
                     </div>
                     <h3 className="text-sm font-extrabold heading-font uppercase text-white tracking-widest">Neural Safety Index</h3>
                  </div>
                  
                  <div className="flex flex-col items-center mb-12">
                     <div className="text-7xl font-extrabold heading-font text-white mb-2">{worker.biometrics.riskScore}</div>
                     <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.5em] text-center">Risk Vector Score</span>
                     <div className="w-full h-2 bg-white/10 rounded-full mt-8 overflow-hidden p-[2px]">
                        <div className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_#2563eb]" style={{ width: `${worker.biometrics.riskScore}%` }}></div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                     <div>
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1 font-mono">Telemetry Node</span>
                        <span className="text-sm font-extrabold text-white uppercase italic">Active</span>
                     </div>
                     <div>
                        <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1 font-mono">Neural Drift</span>
                        <span className="text-sm font-extrabold text-blue-400 uppercase italic leading-none">Safe Range</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Fatigue Analytics */}
            <div className="glass-card bg-white border-white p-10">
               <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100"><Activity size={20} /></div>
                  <h3 className="text-sm font-extrabold heading-font uppercase text-slate-900 tracking-widest">Neural Fatigue Unit</h3>
               </div>
               
               <div className="space-y-10">
                  <div>
                     <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Current Load Index</span>
                        <span className="text-2xl font-extrabold text-slate-900">{worker.biometrics.fatigueIndex}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-[1px]">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${worker.biometrics.fatigueIndex}%` }}></div>
                     </div>
                     <p className="mt-4 text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tight italic">
                        * Fatigue index calculated via neural drift tracking and biometric heart-rate variability over shift cycle.
                     </p>
                  </div>
                  
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
                     <div className="p-2.5 bg-white rounded-xl shadow-sm text-blue-600 relative z-10"><Zap size={20} /></div>
                     <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Rotation Strategy</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Stage 1 Rest cycle in 42m</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
