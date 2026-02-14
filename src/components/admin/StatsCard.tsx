import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: "blue" | "green" | "orange" | "purple";
}

const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue"
}) => {
    return (
        <div className="group bg-secondary/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 
                        hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 
                        transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl border transition-all duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] ${trend.isPositive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                        {trend.isPositive ? '↗' : '↘'} {trend.value}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                    {title}
                </h3>
                <p className="text-5xl font-black italic tracking-tighter leading-none">
                    {value}
                </p>
            </div>
        </div>
    );
};
