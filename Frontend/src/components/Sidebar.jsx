import { useSearchParams } from 'react-router-dom';
import { Star, ArrowUpDown, SlidersHorizontal, CheckCircle2, Heart, ShieldCheck, Activity } from 'lucide-react';

export default function Sidebar({ mobile = false }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const sort = searchParams.get('sort') || 'rating';
    const minRating = searchParams.get('minRating') || '0';
    const activeServices = searchParams.getAll('service');

    const updateFilters = (key, value) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (key === 'service') {
                const services = newParams.getAll('service');
                if (services.includes(value)) {
                    newParams.delete('service');
                    services.filter(s => s !== value).forEach(s => newParams.append('service', s));
                } else {
                    newParams.append('service', value);
                }
            } else {
                newParams.set(key, value);
            }
            return newParams;
        });
    };

    const categories = [
        'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
        'Pediatrics', 'Dermatology', 'Diagnostics', 'Surgeries',
    ];

    const Section = ({ icon: Icon, label, children }) => (
        <div className="mb-12 last:mb-0">
            <div className="flex items-center gap-3 mb-6">
                <Icon className="w-4 h-4 text-teal-500" />
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</h4>
            </div>
            {children}
        </div>
    );

    return (
        <div className="flex flex-col">
            {/* Sort */}
            <Section icon={ArrowUpDown} label="Sort Optimization">
                <div className="flex flex-col gap-3">
                    {[
                        { id: 'rating', label: 'Clinical Rating', icon: Star },
                        { id: 'price', label: 'Treatment Cost', icon: ShieldCheck },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => updateFilters('sort', item.id)}
                            className={`w-full text-left px-5 py-4 rounded-xl text-xs font-bold transition-all ${sort === item.id
                                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                                : 'bg-secondary text-slate-500 border border-transparent hover:border-border hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Rating */}
            <Section icon={Star} label="Minimum Quality">
                <div className="flex flex-col gap-3">
                    {['4.5', '4.0', '3.5', '0'].map(rating => (
                        <button
                            key={rating}
                            onClick={() => updateFilters('minRating', rating)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold transition-all ${minRating === rating
                                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 border border-teal-500/20'
                                : 'bg-secondary text-slate-500 border border-transparent hover:border-border hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${minRating === rating ? 'border-teal-500' : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                {minRating === rating && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                            </div>
                            {rating === '0' ? 'All Verified' : `${rating}+ Clinical Stars`}
                        </button>
                    ))}
                </div>
            </Section>

            {/* Specialties */}
            <Section icon={Activity} label="Specialties">
                <div className="flex flex-col gap-3">
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {categories.map(cat => {
                            const active = activeServices.includes(cat);
                            return (
                                <label
                                    key={cat}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold cursor-pointer transition-all ${active
                                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 border border-teal-500/20'
                                        : 'bg-secondary text-slate-500 border border-transparent hover:border-border hover:bg-white dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <input type="checkbox" className="hidden" checked={active} onChange={() => updateFilters('service', cat)} />
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${active ? 'bg-teal-600 border-teal-600' : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                        {active && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    {cat}
                                </label>
                            );
                        })}
                    </div>
                </div>
            </Section>
        </div>
    );
}
