import { MapPin } from 'lucide-react';

export default function DistanceBadge({ distanceKm, className = '' }) {
    if (!distanceKm && distanceKm !== 0) return null;

    const formattedDistance = distanceKm < 1 
        ? `${(distanceKm * 1000).toFixed(0)}m` 
        : `${distanceKm.toFixed(1)}km`;

    return (
        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest shadow-sm ${className}`}>
            <MapPin className="w-3.5 h-3.5" />
            {formattedDistance} Away
        </span>
    );
}
