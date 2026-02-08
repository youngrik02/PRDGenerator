'use client';

import { useState } from 'react';
import { QuestionFlowInterface } from './components/question-flow-interface';
import { SuccessView } from './components/success-view';
import { motion, AnimatePresence } from 'motion/react';
import { Layout, Sparkles, ArrowRight, Zap, Target, FileText, Users } from 'lucide-react';
import { saveIntake } from './lib/api';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [view, setView] = useState<'welcome' | 'intake' | 'success'>('welcome');
  const [responses, setResponses] = useState<Map<string, string>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async (finalResponses: Map<string, string>) => {
    setIsSaving(true);

    const result = await saveIntake({
      responses: finalResponses,
      projectName: 'Untitled Project',
      status: 'completed',
    });

    setIsSaving(false);

    if (result.ok) {
      setResponses(finalResponses);
      setView('success');
    } else {
      toast.error(result.error.userMessage);
    }
  };

  return (
    <div className="font-sans antialiased text-neutral-900">
      <AnimatePresence mode="wait">
        {view === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="min-h-screen bg-white flex flex-col justify-center items-center px-6 relative overflow-hidden"
          >
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-40" />
            
            <div className="max-w-3xl w-full space-y-12 relative z-10 text-center">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-sm font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  Documentation Intelligence for Sales Ops
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-6xl md:text-7xl font-bold tracking-tight text-neutral-900"
                >
                  From Vision to <span className="text-primary-600">BRD</span> in Minutes.
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
                >
                  Stop staring at blank pages. Use our AI-powered intake system to capture requirements with precision and generate professional documentation instantly.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={() => setView('intake')}
                  className="group flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-primary-600/20 hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Start New Intake
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="px-8 py-4 bg-white text-neutral-600 border border-neutral-200 rounded-2xl text-lg font-bold hover:bg-neutral-50 transition-all active:scale-95">
                  View Recent Projects
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-neutral-100"
              >
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Rapid Intake</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Metric-Driven</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Auto-BRD</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Collaboration</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {view === 'intake' && (
          <motion.div
            key="intake"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuestionFlowInterface onComplete={handleComplete} isSaving={isSaving} />
          </motion.div>
        )}

        {view === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessView responses={responses} onReset={() => setView('welcome')} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-center" richColors />
    </div>
  );
}
