import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map as MapIcon, Navigation, User, AlertTriangle, Shield, Info, Layers, Crosshair, ChevronRight, Activity, Zap } from 'lucide-react';

const Map = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewMode, setViewMode] = useState('thermal');

  const zones = [
    { id: 'Zone-01', name: 'Primary Crusher', risk: 'low', workers: 14, temp: '24°C', safety: '98%' },
    { id: 'Zone-02', name: 'Secondary Storage', risk: 'medium', workers: 8, temp: '28°C', safety: '85%' },
    { id: 'Zone-03', name: 'Conveyor Delta', risk: 'high', workers: 5, temp: '34°C', safety: '72%' },
    { id: 'Zone-04', name: 'Refining Block', risk: 'critical', workers: 3, temp: '42°C', safety: '45%' },
  ];

  const workers = [
    { id: 1, x: '25%', y: '30%', name: 'John D.', status: 'safe' },
    { id: 2, x: '45%', y: '45%', name: 'Aria S.', status: 'critical' },
    { id: 3, x: '70%', y: '60%', name: 'Robert B.', status: 'warning' },
    { id: 4, x: '35%', y: '75%', name: 'Cersei L.', status: 'safe' },
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-[#fdfdfd] grid-paper">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 block mb-2">Spatial Intelligence</span>
          <h1 className="text-4xl font-extrabold heading-font text-slate-900 tracking-tight text-slate-900 border-none">Personnel Risk Map</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Global workforce positioning and real-time environmental hazard tracking.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           {['thermal', 'standard', 'satellite'].map((m) => (
             <button 
               key={m}
               onClick={() => setViewMode(m)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === m ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[70vh]">
        {/* Interactive Map Canvas */}
        <div className="lg:col-span-8 glass-card border-white bg-white/40 overflow-hidden relative group">
          <div className="absolute inset-0 bg-slate-50/50"></div>
          
          {/* Custom Map Visual (SVG) */}
          <div className="absolute inset-0 p-12 overflow-hidden flex items-center justify-center">
             <svg viewBox="0 0 800 500" className="w-full h-auto opacity-100 transition-all duration-700">
                {/* Simplified Industrial Layout */}
                <rect x="100" y="100" width="250" height="150" fill="white" stroke="#e2e8f0" strokeWidth="2" rx="12" />
                <rect x="400" y="80" width="300" height="180" fill="white" stroke="#e2e8f0" strokeWidth="2" rx="12" />
                <rect x="150" y="300" width="350" height="120" fill="white" stroke="#e2e8f0" strokeWidth="2" rx="12" />
                <rect x="550" y="320" width="180" height="130" fill="white" stroke="#e2e8f0" strokeWidth="2" rx="12" />
                
                {/* Heatmap Layer Simulation for Thermal Mode */}
                {viewMode === 'thermal' && (
                  <g opacity="0.4">
                    <circle cx="200" cy="180" r="80" fill="url(#heat-low)" />
                    <circle cx="550" cy="180" r="100" fill="url(#heat-medium)" />
                    <circle cx="350" cy="380" r="90" fill="url(#heat-high)" />
                    <circle cx="650" cy="400" r="70" fill="url(#heat-critical)" />
                  </g>
                )}
                
                <defs>
                  <radialGradient id="heat-low" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-medium" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-high" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-critical" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#991b1b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
                  </radialGradient>
                </defs>
             </svg>
          </div>

          {/* Worker Points Overlay */}
          <div className="absolute inset-0">
             {workers.map(worker => (
               <motion.div 
                 key={worker.id}
                 style={{ left: worker.x, top: worker.y }}
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute -translate-x-1/2 -translate-y-1/2 group/point"
               >
                 <div className={`w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center transition-all ${worker.status === 'safe' ? 'bg-blue-600' : worker.status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-600 animate-ping'}`}>
                    <User size={14} className="text-white" />
                 </div>
                 
                 {/* Label - showing on point hover */}
                 <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white border border-slate-100 rounded-lg shadow-xl opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap border-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{worker.name}</span>
                 </div>
               </motion.div>
             ))}
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-3">
             <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 transition-all shadow-xl shadow-slate-200/50 hover:shadow-2xl active:scale-95"><Crosshair size={20} /></button>
             <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 transition-all shadow-xl shadow-slate-200/50 hover:shadow-2xl active:scale-95"><Layers size={20} /></button>
          </div>

          {/* Coordinate Overlay */}
          <div className="absolute top-8 left-8 p-4 bg-slate-900/10 backdrop-blur-md rounded-2xl border border-white/20">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-900/60 uppercase tracking-widest">Lat: 12.9716° N</span>
                <span className="text-[10px] font-black text-slate-900/60 uppercase tracking-widest">Lon: 77.5946° E</span>
             </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8 flex flex-col h-full">
           <div className="glass-card bg-white border-white p-8 flex-1 overflow-y-auto">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 pb-4 border-b border-slate-50">Zone Diagnostics</h3>
              
              <div className="space-y-4">
                 {zones.map(zone => (
                    <motion.div 
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer group ${selectedZone === zone.id ? 'bg-blue-50 border-blue-100 shadow-lg' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-md'}`}
                    >
                       <div className="flex justify-between items-start mb-4">
                          <h4 className={`text-sm font-extrabold uppercase tracking-tight group-hover:text-blue-600 transition-colors ${selectedZone === zone.id ? 'text-blue-600' : 'text-slate-900'}`}>{zone.name}</h4>
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${zone.risk === 'critical' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : zone.risk === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                             {zone.risk}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Personnel</p>
                             <p className="text-xs font-bold text-slate-900 uppercase italic leading-none">{zone.workers} active</p>
                          </div>
                          <div>
                             <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Safety Ref</p>
                             <p className="text-xs font-bold text-slate-900 uppercase italic leading-none">{zone.safety}</p>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Tactical Insight Card */}
           <div className="glass-card bg-slate-900 p-8 text-white relative overflow-hidden group border-none min-h-[220px]">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                 <Zap size={100} />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                 <h3 className="text-sm font-extrabold heading-font uppercase text-blue-400 tracking-widest mb-6">Thermal Uplink</h3>
                 <p className="text-xs leading-relaxed font-medium mb-auto opacity-80 italic">
                    "Sector D refinery block detected at 42°C. Critical heat spike in refining block requires immediate ventilation override."
                 </p>
                 <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">Gps_Status: Nominal</span>
                    <button className="bg-blue-600 p-2 rounded-lg text-white group-hover:bg-white group-hover:text-blue-600 transition-colors"><ChevronRight size={16} /></button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
