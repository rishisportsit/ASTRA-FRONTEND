import { DataTable, Column } from "@/components/ui/data-table";
import {
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Bitcoin,
} from "lucide-react";

interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  high: number;
  low: number;
}

const cryptoData: CryptoCoin[] = [
  {
    id: "1",
    symbol: "BTC",
    name: "Bitcoin",
    price: 43250.5,
    change: 2.5,
    volume: "1.2B",
    high: 43500.0,
    low: 42800.0,
  },
  {
    id: "2",
    symbol: "ETH",
    name: "Ethereum",
    price: 2350.2,
    change: 1.8,
    volume: "850M",
    high: 2380.0,
    low: 2320.0,
  },
  {
    id: "3",
    symbol: "SOL",
    name: "Solana",
    price: 98.5,
    change: 5.2,
    volume: "350M",
    high: 102.0,
    low: 95.0,
  },
  {
    id: "4",
    symbol: "XRP",
    name: "Ripple",
    price: 0.52,
    change: -1.2,
    volume: "120M",
    high: 0.54,
    low: 0.51,
  },
  {
    id: "5",
    symbol: "BNB",
    name: "Binance Coin",
    price: 305.8,
    change: 0.5,
    volume: "95M",
    high: 308.0,
    low: 302.0,
  },
];

const columns: Column<CryptoCoin>[] = [
  {
    key: "symbol",
    header: "Asset",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
          {item.symbol[0]}
        </div>
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-xs text-white/40">{item.symbol}</div>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "Price ($)",
    sortable: true,
    render: (item) => (
      <span className="font-mono">
        $
        {item.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: "change",
    header: "24h Change",
    sortable: true,
    render: (item) => (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium ${item.change >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
      >
        {item.change >= 0 ? "+" : ""}
        {item.change}%
      </span>
    ),
  },
  {
    key: "volume",
    header: "Volume",
    sortable: true,
    render: (item) => <span className="text-white/60">{item.volume}</span>,
  },
  {
    key: "high",
    header: "High",
    render: (item) => (
      <span className="text-white/60 font-mono">
        $
        {item.high.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
  {
    key: "low",
    header: "Low",
    render: (item) => (
      <span className="text-white/60 font-mono">
        $
        {item.low.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  },
];

export const CryptoView = () => (
  <div className="space-y-6 h-full flex flex-col">
    {/* Stats Grid */}
    <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Balance Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-indigo-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">
          Total Balance
        </h3>
        <div className="text-3xl font-bold text-white mb-2">$45,231.50</div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} />
          <span>+2.4% today</span>
        </div>
      </div>

      {/* Trades Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">
          Open Positions
        </h3>
        <div className="text-3xl font-bold text-white mb-2">3</div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 2 Long
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> 1 Short
          </div>
        </div>
      </div>

      {/* Active Symbol Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-900/20 to-yellow-600/10 backdrop-blur-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Bitcoin size={80} />
        </div>
        <h3 className="text-white/60 font-medium text-sm mb-1">Top gainer</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold border border-yellow-500/20">
            <Bitcoin size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Bitcoin</div>
            <div className="text-[10px] text-white/40">BTC/USD</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
          <span>+2.5%</span>
        </div>
      </div>
    </div>

    {/* Data Table */}
    <div className="flex-1 min-h-0">
      <DataTable
        data={cryptoData}
        columns={columns}
        searchKeys={["symbol", "name"]}
        perPage={5}
        className="h-full"
      />
    </div>
  </div>
);
