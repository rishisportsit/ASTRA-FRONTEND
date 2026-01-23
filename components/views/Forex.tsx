import { DataTable, Column } from "@/components/reusables/table";
import { Wallet, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ForexPair {
  id: string;
  pair: string;
  price: number;
  change: number;
  spread: number;
  high: number;
  low: number;
}

const forexData: ForexPair[] = [
  { id: "1", pair: "EUR/USD", price: 1.0824, change: 0.42, spread: 0.8, high: 1.0850, low: 1.0790 },
  { id: "2", pair: "GBP/USD", price: 1.2540, change: -0.15, spread: 1.2, high: 1.2580, low: 1.2500 },
  { id: "3", pair: "USD/JPY", price: 148.50, change: 0.80, spread: 0.9, high: 149.10, low: 147.80 },
  { id: "4", pair: "AUD/USD", price: 0.6540, change: -0.25, spread: 1.0, high: 0.6580, low: 0.6520 },
  { id: "5", pair: "USD/CHF", price: 0.8820, change: 0.10, spread: 1.1, high: 0.8850, low: 0.8800 },
  { id: "6", pair: "USD/CAD", price: 1.3560, change: -0.05, spread: 1.3, high: 1.3590, low: 1.3520 },
  { id: "7", pair: "NZD/USD", price: 0.6120, change: 0.30, spread: 1.5, high: 0.6150, low: 0.6090 },
];

const columns: Column<ForexPair>[] = [
  {
    key: "pair",
    header: "Pair",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
          {item.pair.split('/')[0]}
        </div>
        <span className="font-semibold">{item.pair}</span>
      </div>
    )
  },
  {
    key: "price",
    header: "Price",
    sortable: true,
    render: (item) => <span className="font-mono">{item.price.toFixed(4)}</span>
  },
  {
    key: "change",
    header: "24h Change",
    sortable: true,
    render: (item) => (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {item.change >= 0 ? '+' : ''}{item.change}%
      </span>
    )
  },
  {
    key: "spread",
    header: "Spread",
    sortable: true,
    render: (item) => <span className="text-white/60">{item.spread}</span>
  },
  {
    key: "high",
    header: "High",
    render: (item) => <span className="text-white/60 font-mono">{item.high.toFixed(4)}</span>
  },
  {
    key: "low",
    header: "Low",
    render: (item) => <span className="text-white/60 font-mono">{item.low.toFixed(4)}</span>
  },
];

export const ForexView = () => (
  <div className="space-y-6 h-full flex flex-col">
    {/* Stats Grid */}
    <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-900/20 to-emerald-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">Total Balance</h3>
        <div className="text-3xl font-bold text-white mb-2">$14,250.50</div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} />
          <span>+2.4% today</span>
        </div>
      </div>

      {/* Trades Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 to-blue-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">Trades Placed</h3>
        <div className="text-3xl font-bold text-white mb-2">8</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 6 Wins
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> 2 Losses
          </div>
        </div>
      </div>

      {/* Active Symbol Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-900/20 to-amber-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">Top Symbol</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">
            Au
          </div>
          <div>
            <div className="text-xl font-bold text-white">XAU/USD</div>
            <div className="text-[10px] text-white/40">Gold Spot</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-400 text-xs font-medium bg-amber-500/10 w-fit px-2 py-1 rounded-lg">
          <span>5 Trades</span>
        </div>
      </div>
    </div>

    <div className="flex-1 min-h-0">
      <DataTable
        data={forexData}
        columns={columns}
        searchKeys={["pair"]}
        perPage={5}
        className="h-full"
      />
    </div>
  </div>
);
