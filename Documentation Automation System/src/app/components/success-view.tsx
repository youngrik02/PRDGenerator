'use client';

import { CheckCircle2, FileText, Download, Share2, ArrowLeft, ExternalLink, BarChart3, Clock, Zap, Users, Star, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SEVEN_QUESTIONS } from '../lib/constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const mockChartData = [
  { name: 'Mon', count: 12 },
  { name: 'Tue', count: 18 },
  { name: 'Wed', count: 15 },
  { name: 'Thu', count: 25 },
  { name: 'Fri', count: 32 },
  { name: 'Sat', count: 10 },
  { name: 'Sun', count: 8 },
];

export function SuccessView({ responses, onReset }: { responses: Map<string, string>, onReset: () => void }) {
  const wordCount = Array.from(responses.values()).reduce((acc, text) => acc + text.split(/\s+/).length, 0);
  
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Top Banner */}
      <div className="bg-primary-600 text-white py-16 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,1000 C300,800 400,1200 1000,1000 L1000,0 L0,0 Z" fill="white" />
          </svg>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Document Generated
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Requirement Analysis Complete</h1>
              <p className="text-xl text-primary-100 max-w-xl">
                Your intake has been processed into a structured Business Requirements Document (BRD).
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold shadow-xl shadow-primary-900/20 hover:bg-neutral-50 transition-all active:scale-95">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary-700 text-white border border-white/10 rounded-xl font-bold hover:bg-primary-800 transition-all active:scale-95">
                <Share2 className="w-5 h-5" />
                Share with Stakeholders
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Document Summary */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="border-b border-neutral-100 px-8 py-6 flex items-center justify-between bg-neutral-50/50">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  Generated BRD Draft v1.0
                </h3>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Ready for Review
                </span>
              </div>
              
              <div className="p-8 space-y-8">
                {SEVEN_QUESTIONS.map((q) => (
                  <div key={q.id} className="space-y-3">
                    <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-tighter">
                      {q.title}
                    </h4>
                    <p className="text-neutral-700 leading-relaxed bg-neutral-50/50 p-4 rounded-xl border border-neutral-100">
                      {responses.get(q.id) || "No response provided."}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Analytics/Stats */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-6"
            >
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-100 pb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                Intake Intelligence
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 space-y-1">
                  <p className="text-2xl font-black text-primary-600 leading-none">{wordCount}</p>
                  <p className="text-[10px] font-bold text-primary-700/60 uppercase">Total Words</p>
                </div>
                <div className="p-4 rounded-2xl bg-success/5 border border-success/10 space-y-1">
                  <p className="text-2xl font-black text-success leading-none">94%</p>
                  <p className="text-[10px] font-bold text-success/60 uppercase">Data Quality</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-2xl font-black text-neutral-900 leading-none">12.5m</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Intake Time</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-2xl font-black text-neutral-900 leading-none">High</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Risk Level</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Metric density</span>
                  <span className="text-neutral-900 font-bold">Excellent</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 w-[85%]" />
                </div>
              </div>
            </motion.div>

            {/* Platform Engagement Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 space-y-4"
            >
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center justify-between">
                Platform Activity
                <span className="text-[10px] text-success bg-success/10 px-1.5 py-0.5 rounded">+14%</span>
              </h3>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-neutral-900 rounded-2xl p-6 text-white space-y-4"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary-400">Next Phases</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Design Review</p>
                    <p className="text-xs text-neutral-400 leading-tight">Sync with UX team to map functional requirements to user flows.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 opacity-60">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Engineering Feasibility</p>
                    <p className="text-xs text-neutral-400 leading-tight">Assess backend dependencies and API availability.</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                Launch Phase 1 <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            <button
              onClick={onReset}
              className="w-full py-4 text-neutral-400 hover:text-neutral-600 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Restart New Intake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
