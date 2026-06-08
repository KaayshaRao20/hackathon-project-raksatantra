import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Shield, Zap, AlertTriangle, ArrowRight, User } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Neural Link established. I am SafeSphere AI. How can I assist your operational safety today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulated AI Response
    setTimeout(() => {
      let response = "Neural drift analysis finalized. Operational parameters remain within safety bounds.";
      if (input.toLowerCase().includes('risk')) response = "Alert: High biological stress indicators detected in Sector Delta. Personnel ID #W2139 (Aria Stark) requires immediate fatigue override.";
      if (input.toLowerCase().includes('map')) response = "Spatial visualization nodes updated. Zone-03 (Conveyor Delta) showing elevated heat frequency. Tactical override recommended.";
      if (input.toLowerCase().includes('who')) response = "Personnel ID #W2088 (Jamie Lannister) currently at 88% risk score due to critical PPE non-compliance in the Refinery block.";
      
      setMessages([...newMessages, { role: 'bot', content: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-6 w-[400px] glass-card bg-white border-white shadow-2xl flex flex-col h-[520px] overflow-hidden"
          >
            {/* AI Assistant Header */}
            <div className="p-8 bg-slate-900 border-b border-white/5 flex items-center justify-between relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <Zap size={100} className="text-white" />
               </div>
               <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                     <Bot className="text-white" size={24} />
                  </div>
                  <div>
                     <h3 className="text-sm font-extrabold heading-font uppercase text-white tracking-widest leading-none mb-1.5 underline underline-offset-4 decoration-blue-500 italic">SafeSphere Neural</h3>
                     <span className="text-[9px] text-blue-400 font-black uppercase tracking-[0.25em] leading-none">Core Unit active</span>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="relative z-10 p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all">
                  <X size={18} />
               </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex flex-col max-w-[85%] group">
                     {msg.role === 'bot' && (
                        <div className="flex items-center gap-2 mb-2 ml-1">
                           <Shield size={10} className="text-blue-600" />
                           <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Neural Advisory</span>
                        </div>
                     )}
                     <div className={`p-5 rounded-3xl ${msg.role === 'bot' ? 'bg-white text-slate-900 border border-slate-100 shadow-sm leading-relaxed text-sm font-medium' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 leading-relaxed text-sm font-medium'}`}>
                        {msg.content}
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Control Center Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50">
               <div className="relative group">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Query Operational Node..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-6 pr-14 outline-none text-slate-900 font-bold uppercase tracking-widest text-[10px] placeholder:text-slate-300 transition-all focus:bg-white focus:border-blue-500/50"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-90">
                     <Send size={16} />
                  </button>
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-18 h-18 bg-slate-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-900/40 relative group overflow-hidden border-2 border-white"
        style={{ width: '72px', height: '72px' }}
      >
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <X size={28} className="relative z-10" /> : <Bot size={28} className="relative z-10" />}
        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <Zap size={14} className="text-white fill-white" />
        </div>
      </motion.button>
    </div>
  );
};

export default AIAssistant;
