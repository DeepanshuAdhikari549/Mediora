import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Heart, Calendar, Phone, Shield } from 'lucide-react';
import { aiApi } from '../lib/api';

const SUGGESTIONS = [
    { label: 'Find nearby hospitals', icon: Heart },
    { label: 'Check surgery prices', icon: Sparkles },
    { label: 'Book an appointment', icon: Calendar },
    { label: 'Emergency contact', icon: Phone },
];

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'MediCompare Intelligence Active. I am your Clinical Liaison. How can I assist your medical journey today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (content) => {
        const text = content || input;
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await aiApi.chat(text);
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('AI error:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm having trouble connecting to my clinical database. Please check your connection and try again." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-[200]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
                        className="w-[420px] h-[650px] glass-card rounded-[3rem] border-border/50 overflow-hidden flex flex-col shadow-2xl relative"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-5">
                            <div className="shimmer w-full h-full" />
                        </div>

                        {/* Header */}
                        <div className="p-8 bg-teal-600 text-white flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-heading text-lg leading-none mb-1">MediLiaison</div>
                                    <div className="text-[10px] text-teal-100 font-bold flex items-center gap-2 uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" /> Intelligence Operational
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                            {messages.map((m, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} 
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed tracking-tight ${m.role === 'user'
                                            ? 'bg-teal-600 text-white rounded-tr-none shadow-xl shadow-teal-500/10'
                                            : 'bg-secondary text-slate-700 dark:text-slate-300 rounded-tl-none border border-border/30'
                                        }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-secondary p-5 rounded-[1.5rem] rounded-tl-none border border-border/30 flex gap-1.5 items-center">
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Core */}
                        <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-border/50">
                            {messages.length < 3 && (
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {SUGGESTIONS.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(s.label)}
                                            className="px-4 py-2 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest border border-teal-500/20 hover:bg-teal-500 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <s.icon className="w-3.5 h-3.5" /> {s.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Execute medical query..."
                                    className="w-full h-14 pl-6 pr-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all placeholder:opacity-50"
                                />
                                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 text-white rounded-[0.75rem] flex items-center justify-center hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-90">
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="mt-6 flex items-center justify-center gap-3 text-slate-400">
                                <Shield className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Encrypted Session Node</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1, y: -10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-20 h-20 bg-teal-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(13,148,136,0.3)] relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MessageSquare className="w-8 h-8" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-4 h-4 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg"
                        />
                        <div className="absolute inset-0 shimmer opacity-20" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
