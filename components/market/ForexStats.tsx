import { MarketStatsCard } from "@/components/ui/cards/MarketStatsCard";
import { Wallet, Activity } from "lucide-react";
import { ReactNode } from "react";

interface ForexStatsProps {
  children?: ReactNode;
}

export const ForexStats = ({ children }: ForexStatsProps) => {
  return (
    <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      <MarketStatsCard
        title="Total Balance"
        value="$14,250.50"
        icon={Wallet}
        trend={{ value: "+2.4%", isPositive: true, label: "today" }}
        gradient="from-emerald-900/40 to-emerald-600/10"
      />
      <MarketStatsCard
        title="Active Positions"
        value="8"
        icon={Activity}
        gradient="from-blue-900/40 to-blue-600/10"
        subContent={
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 6
              Wins
            </div>
            <div className="flex items-center gap-1 text-xs text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 2
              Loss
            </div>
          </div>
        }
      />

      {children}
    </div>
  );
};
