export const IndianView = () => (
  <div className="space-y-6">
    <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 to-green-500/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <h2 className="text-3xl font-bold mb-2">Indian Markets</h2>
      <p className="text-white/60">NSE & BSE Indices.</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-3xl bg-white/5 p-5 border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-sm hover:bg-white/10 transition-all">
        <div className="text-sm text-white/50 mb-4 font-medium tracking-wide">
          NIFTY 50
        </div>
        <div className="text-2xl font-bold">22,450.00</div>
        <div className="text-sm text-green-400 mt-2 flex items-center gap-1">
          <span>+120.50</span>
          <span className="opacity-60 text-xs">(0.5%)</span>
        </div>
      </div>
      <div className="rounded-3xl bg-white/5 p-5 border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-sm hover:bg-white/10 transition-all">
        <div className="text-sm text-white/50 mb-4 font-medium tracking-wide">
          SENSEX
        </div>
        <div className="text-2xl font-bold">73,100.20</div>
        <div className="text-sm text-red-400 mt-2 flex items-center gap-1">
          <span>-45.10</span>
          <span className="opacity-60 text-xs">(0.1%)</span>
        </div>
      </div>
    </div>

    <div className="rounded-3xl bg-white/5 p-6 border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
      <h3 className="font-semibold mb-4 text-lg">Top Gainers</h3>
      <div className="space-y-3">
        {["TATASTEEL", "RELIANCE", "INFY"].map((stock) => (
          <div
            key={stock}
            className="flex justify-between items-center border-b border-white/5 last:border-0 pb-3 last:pb-0 hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2"
          >
            <span className="font-medium tracking-wide">{stock}</span>
            <span className="text-green-400 font-mono tracking-tight">
              +2.4%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
