import { motion } from 'framer-motion';
import {
    BadgeCheck, BarChart3, Clock, Fingerprint,
    ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Activity, ShieldCheck, Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import FloatingCard3D from '../components/3d/FloatingCard3D';
import Scene3D from '../components/3d/Scene3D';
import VideoBackground from '../components/VideoBackground';

const featureDetails = [
    {
        id: 'quality',
        title: 'Verified Quality Metrics',
        icon: BadgeCheck,
        color: 'text-teal-600',
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        description: 'We eliminate the guesswork in healthcare. Our proprietary quality score is built on 50+ data points including patient outcomes and infrastructure.',
        details: [
            'Independent NABL/NABH Verification status',
            'Real-time patient satisfaction tracking',
            'Infrastructure & specialized equipment audit',
            'Doctor qualification & experience index',
        ],
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 'pricing',
        title: 'Inclusive Pricing Index',
        icon: BarChart3,
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        description: 'Transparency is our core value. Compare total treatment costs, not just consultation fees. No hidden markups or charges.',
        details: [
            'Standardized package pricing for surgeries',
            'Itemized cost breakdown (Pharmacy, Lab)',
            'Price matching with city benchmarks',
            'Medical insurance coverage calculator',
        ],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 'booking',
        title: 'Express Digital Booking',
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        description: 'Skip the reception queue. Our direct hospital integration allows you to book verified time slots instantly with real-time sync.',
        details: [
            'Real-time slot availability (2-min sync)',
            'Digital check-in with QR code',
            'Appointment rescheduling in one click',
            'Automated SMS & WhatsApp reminders',
        ],
        image: 'https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&q=80&w=1000',
    },
];

export default function Features() {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }, [hash]);

    return (
        <div className="bg-warm min-h-screen relative transition-colors duration-300">
            <VideoBackground
                src="https://player.vimeo.com/external/494366500.hd.mp4?s=348705f459149723dd60a6ae578278a9c8de0638&profile_id=172"
                opacity={0.7}
            />

            <div className="absolute inset-0 z-[1] pointer-events-none opacity-30">
                <Scene3D />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 py-24">

                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="text-teal-700 dark:text-teal-400 text-xs font-black uppercase tracking-widest">Platform Intelligence</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                        Healthcare Search <br /><span className="text-teal-600">Reimagined</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Discover how we leverage proprietary datasets and real-time connectivity to provide a seamless clinical search and booking experience.
                    </p>
                </div>

                {/* Product Features */}
                <div className="space-y-40">
                    {featureDetails.map((f, i) => (
                        <div key={f.id} id={f.id} className={`flex flex-col lg:flex-row items-center gap-16 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                            {/* Visual Part */}
                            <motion.div
                                initial={{ opacity: 0, x: i % 2 === 1 ? 40 : -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="flex-1 w-full"
                            >
                                <FloatingCard3D intensity={5}>
                                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-teal-500/10 border border-slate-200 dark:border-slate-800">
                                        <img src={f.image} alt={f.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                    </div>
                                </FloatingCard3D>
                            </motion.div>

                            {/* Info Part */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex-1"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${f.bg} flex items-center justify-center mb-8 shadow-sm`}>
                                    <f.icon className={`w-8 h-8 ${f.color}`} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">{f.title}</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10">{f.description}</p>

                                <div className="space-y-4 mb-12">
                                    {f.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full ${f.bg} flex items-center justify-center`}>
                                                <CheckCircle2 className={`w-3.5 h-3.5 ${f.color}`} />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-tight">{detail}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link to="/search" className="inline-flex items-center gap-3 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/30 transition-all active:scale-95 group">
                                    Launch Search <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                <div className="mt-40 p-12 lg:p-20 rounded-[40px] bg-slate-900 text-white relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Sparkles className="w-12 h-12 text-teal-400 mx-auto mb-8" />
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready for Better Care?</h2>
                        <p className="text-slate-400 text-lg mb-12 font-medium">Join thousands of patients who trust MediCompare for their healthcare transparency journey.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register" className="px-10 py-5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">Create Free Account</Link>
                            <Link to="/" className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">Back to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
