export const ForexView = () => (
  <div className="space-y-6">
    <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/20 to-blue-600/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <h2 className="text-3xl font-bold mb-2">Global Markets</h2>
      <p className="text-white/60">Live forex rates and trends.</p>
    </div>

    <div className="space-y-3">
      {["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"].map((pair, i) => (
        <div
          key={pair}
          className="flex items-center justify-between p-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm border border-white/5">
              {pair.split("/")[0]}
            </div>
            <div>
              <div className="font-bold text-lg">{pair}</div>
              <div className="text-xs text-white/40">0.00012 spread</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-mono font-medium">1.08{i}4</div>
            <div className="text-xs text-green-400">+0.4%</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
