import { Column } from "@/components/ui/data-table";
import { MarketItem } from "./marketData";

export const columns: Column<MarketItem>[] = [
  {
    key: "pair",
    header: "Symbol",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 text-white flex items-center justify-center font-bold text-[10px] border border-white/10 shadow-inner">
          {item.pair.split("/")[0]}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-wide">{item.pair}</span>
          <span className="text-[10px] text-white/40">Global Market</span>
        </div>
      </div>
    ),
  },
  {
    key: "price",
    header: "Price",
    sortable: true,
    render: (item) => (
      <span className="font-mono font-medium text-white/90">
        {item.price.toFixed(item.price > 100 ? 2 : 4)}
      </span>
    ),
  },
  {
    key: "change",
    header: "24h %",
    sortable: true,
    render: (item) => (
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${item.change >= 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
      >
        {item.change >= 0 ? "+" : ""}
        {item.change}%
      </span>
    ),
  },
  {
    key: "spread",
    header: "Spread",
    sortable: true,
    render: (item) => (
      <span className="text-white/50 text-xs">{item.spread}</span>
    ),
  },
  {
    key: "high",
    header: "High",
    render: (item) => (
      <span className="text-white/50 font-mono text-xs">
        {item.high.toFixed(item.price > 100 ? 2 : 4)}
      </span>
    ),
  },
  {
    key: "low",
    header: "Low",
    render: (item) => (
      <span className="text-white/50 font-mono text-xs">
        {item.low.toFixed(item.price > 100 ? 2 : 4)}
      </span>
    ),
  },
];
