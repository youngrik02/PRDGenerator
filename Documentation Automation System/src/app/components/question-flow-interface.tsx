'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Save, X, AlertCircle, CheckCircle2, Sparkles, HelpCircle, FileText, Send, PieChart, Users, Zap, Search, Layout, Trophy, ArrowRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEVEN_QUESTIONS, Question, Example } from '../lib/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function QuestionFlowInterface({ onComplete }: { onComplete: (responses: Map<string, string>) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, string>>(new Map());
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [validationState, setValidationState] = useState<'valid' | 'incomplete' | 'needs-metrics'>('incomplete');
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const currentQuestion = SEVEN_QUESTIONS[currentIndex];
  const currentResponse = responses.get(currentQuestion.id) || '';

  // Auto-save functionality
  useEffect(() => {
    if (currentResponse.length === 0) return;
    
    const autoSave = setTimeout(() => {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 800);
    }, 2000);
    return () => clearTimeout(autoSave);
  }, [currentResponse]);

  // Validation logic
  useEffect(() => {
    const hasMetrics = /\d+%|\$\d+|^\d+\s(?:hours|users|days)/i.test(currentResponse);
    const meetsLength = currentResponse.length >= currentQuestion.minCharacters;
    
    if (meetsLength && (!currentQuestion.validationRules.requiresMetrics || hasMetrics)) {
      setValidationState('valid');
    } else if (meetsLength && !hasMetrics && currentQuestion.validationRules.requiresMetrics) {
      setValidationState('needs-metrics');
    } else {
      setValidationState('incomplete');
    }
    setCharCount(currentResponse.length);
  }, [currentResponse, currentQuestion]);

  const handleNext = () => {
    if (currentIndex < SEVEN_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResponseChange = (value: string) => {
    const newResponses = new Map(responses);
    newResponses.set(currentQuestion.id, value);
    setResponses(newResponses);
  };

  const applyExample = (content: string) => {
    handleResponseChange(content);
    setShowAISuggestions(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-600">
                  Step {currentIndex + 1} of {SEVEN_QUESTIONS.length}
                </span>
                <span className="text-xs text-neutral-400">
                  {currentQuestion.title.substring(0, 30)}...
                </span>
              </div>
              <div className="flex-1 max-w-xs h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / SEVEN_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  {isSaving ? 'Saving...' : lastSaved ? `Last saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Draft ready'}
                </span>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>
              <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="space-y-8"
          >
            {/* Question Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                AI-Guided Intake
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                {currentQuestion.title}
              </h1>
              <p className="text-xl text-neutral-500 max-w-2xl">
                {currentQuestion.description}
              </p>
            </div>

            {/* Sub-prompts / Help Card */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary-600">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-900">Consider including these details:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentQuestion.subPrompts.map((prompt, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="w-1 h-1 rounded-full bg-primary-400" />
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Response Input Area */}
            <div className="space-y-4">
              <div className="relative group">
                <textarea
                  value={currentResponse}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className={cn(
                    "w-full min-h-[320px] px-6 py-6 text-lg rounded-2xl border-2 bg-white transition-all duration-300 resize-none focus:outline-none placeholder:text-neutral-300",
                    validationState === 'valid' && "border-success/30 focus:border-success focus:ring-4 focus:ring-success/5",
                    validationState === 'needs-metrics' && "border-warning/30 focus:border-warning focus:ring-4 focus:ring-warning/5",
                    validationState === 'incomplete' && "border-neutral-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5"
                  )}
                />
                
                {/* Floating validation indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                   {validationState === 'valid' ? (
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold animate-in fade-in zoom-in duration-300">
                       <CheckCircle2 className="w-3.5 h-3.5" />
                       Strong Response
                     </div>
                   ) : validationState === 'needs-metrics' ? (
                     <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-bold animate-in fade-in zoom-in duration-300">
                       <AlertCircle className="w-3.5 h-3.5" />
                       Add Metrics
                     </div>
                   ) : (
                     <div className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-500 text-xs font-bold">
                       {charCount} / {currentQuestion.minCharacters} chars
                     </div>
                   )}
                </div>

                {/* AI Suggestion Trigger */}
                <button 
                  onClick={() => setShowAISuggestions(!showAISuggestions)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-all shadow-lg active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  See Examples
                </button>
              </div>

              {/* Character Progress Bar */}
              <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    validationState === 'valid' ? 'bg-success' : 'bg-primary-500'
                  )}
                  style={{ width: `${Math.min(100, (charCount / currentQuestion.minCharacters) * 100)}%` }}
                />
              </div>
            </div>

            {/* AI Suggestion Panel (Collapsible) */}
            <AnimatePresence>
              {showAISuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-primary-900 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Top-Tier Examples
                      </h3>
                      <button 
                        onClick={() => setShowAISuggestions(false)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {currentQuestion.examples.length > 0 ? (
                        currentQuestion.examples.map((ex) => (
                          <div key={ex.id} className="bg-white rounded-xl p-5 border border-primary-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded uppercase">
                                {ex.projectType}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium">
                                {ex.context}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-700 leading-relaxed italic">
                              "{ex.content}"
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ex.metrics.map((m, i) => (
                                <span key={i} className="text-[10px] font-semibold text-success bg-success/5 px-2 py-0.5 rounded border border-success/10">
                                  {m}
                                </span>
                              ))}
                            </div>
                            <button 
                              onClick={() => applyExample(ex.content)}
                              className="w-full mt-2 py-2 text-xs font-bold text-primary-600 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              Apply this template <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-primary-600">No examples for this step yet, but focus on clear, measurable outcomes!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-neutral-200 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all",
              currentIndex === 0 ? "text-neutral-300 cursor-not-allowed" : "text-neutral-600 hover:bg-neutral-50 active:scale-95"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-neutral-900">
                {Math.round(((currentIndex + 1) / SEVEN_QUESTIONS.length) * 100)}% Complete
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                {SEVEN_QUESTIONS.length - currentIndex - 1} steps remaining
              </span>
            </div>
            
            <button
              onClick={handleNext}
              disabled={validationState === 'incomplete'}
              className={cn(
                "group relative flex items-center gap-2 px-10 py-3 text-sm font-bold rounded-xl transition-all shadow-xl",
                validationState === 'incomplete' 
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed shadow-none" 
                  : "bg-primary-600 text-white hover:bg-primary-700 active:scale-95 hover:shadow-primary-600/20"
              )}
            >
              {currentIndex === SEVEN_QUESTIONS.length - 1 ? 'Generate Document' : 'Next Step'}
              <ChevronRight className={cn("w-5 h-5 transition-transform", validationState !== 'incomplete' && "group-hover:translate-x-1")} />
              
              {validationState === 'needs-metrics' && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-neutral-900 text-white text-[10px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Psst: Adding numbers makes this 40% more effective!
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900" />
                </div>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
