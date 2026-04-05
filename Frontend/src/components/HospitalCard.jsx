import { motion } from 'framer-motion';
import { Star, MapPin, Building2, Shield, ArrowRight, Activity, Clock, IndianRupee, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function HospitalCard({ hospital, className = '' }) {
    if (!hospital) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={className}
        >
            <Link to={`/hospital/${hospital.slug}`}
                className="flex flex-col md:flex-row glass-card rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/10 group relative border-border/50"
                style={{ textDecoration: 'none' }}
            >
                {/* Image Section */}
                <div className="w-full md:w-80 lg:w-96 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                    <img
                        src={hospital.images?.[0] || `https://images.unsplash.com/photo-${["1519494026892-80bbd2d6fd0d", "1586773860418-d37222d8fce3", "1538108149393-fbbd81895907", "1516549655169-df83a0774514", "1551076805-a13ceeee03d3"][(hospital.name?.length || 0) % 5]}?auto=format&fit=crop&q=80&w=800`}
                        alt={hospital.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-6 left-6 flex flex-col gap-3">
                        {hospital.verified && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-white/20">
                                <ShieldCheck className="w-4 h-4 text-teal-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-900 dark:text-teal-400">Verified</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500 text-white shadow-xl">
                            <span className="text-sm font-bold">{Number(hospital.rating || 4.5).toFixed(1)}</span>
                            <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex flex-col flex-1">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3 text-teal-600 dark:text-teal-400">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{hospital.type || 'Medical Institution'}</span>
                        </div>
                        <h3 className="font-heading text-3xl text-slate-900 dark:text-white mb-3 line-clamp-1">{hospital.name}</h3>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-teal-500" />
                            </div>
                            <span>{hospital.address || hospital.city}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {hospital.services?.slice(0, 3).map((svc, i) => (
                            <div key={i} className="px-4 py-2 rounded-xl bg-secondary text-slate-600 dark:text-slate-300 text-[11px] font-bold border border-border/50">
                                {svc.name}
                            </div>
                        ))}
                        {hospital.services?.length > 3 && (
                            <div className="px-4 py-2 rounded-xl bg-muted text-slate-400 text-[11px] font-bold">
                                +{hospital.services.length - 3} Extra
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                                <IndianRupee className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Est. Consultation</span>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    500 <span className="text-sm text-slate-400 font-medium tracking-normal">onwards</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const stored = localStorage.getItem('compareSlugs');
                                    const slugs = stored ? JSON.parse(stored) : [];
                                    if (!slugs.includes(hospital.slug)) {
                                        const next = [...slugs, hospital.slug].slice(-3);
                                        localStorage.setItem('compareSlugs', JSON.stringify(next));
                                        toast.success('Added to Comparison Node');
                                    } else {
                                        toast.error('Institution already in Deck');
                                    }
                                }}
                                className="h-14 px-8 rounded-2xl bg-secondary text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-border transition-all"
                            >
                                Compare
                            </button>
                            <div className="btn-premium h-14 px-10 text-xs uppercase tracking-widest flex items-center gap-3">
                                Detailed File <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
