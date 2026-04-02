import { MapPin, Navigation2, Cross } from 'lucide-react';

export default function LocationButton({ onClick, loading, className = '' }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center justify-center gap-3 px-6 h-12 rounded-xl bg-secondary border border-border/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-xl hover:border-teal-500/50 min-w-[200px] group ${className}`}
            title="Calibrate Current Coordinate"
            type="button"
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-teal-500 border-t-secondary rounded-full animate-spin"></div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600">Calibrating...</span>
                </>
            ) : (
                <>
                    <Navigation2 className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Sync Location</span>
                </>
            )}
        </button>
    );
}
