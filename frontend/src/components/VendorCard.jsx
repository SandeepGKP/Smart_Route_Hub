import { Activity, Zap, CheckCircle2, XCircle } from 'lucide-react';

export default function VendorCard({ vendor }) {
  const isHealthy = !vendor.metrics.isDown;
  const successRate = Math.round(vendor.metrics.successRate);
  
  return (
    <div className="glass p-5 rounded-2xl transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-blue-900/20 group relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isHealthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-black m-0">{vendor.name}</h3>
            <span className="text-xs text-slate-600 uppercase font-semibold tracking-wider">{vendor.capability}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isHealthy ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} flex items-center gap-1`}>
          {isHealthy ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
          {isHealthy ? 'HEALTHY' : 'DOWN'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div className="bg-slate-100 rounded-xl p-3 border border-slate-700/30">
          <div className="text-xs text-slate-600 mb-1">Cost</div>
          <div className="font-bold text-slate-700">${vendor.costPerRequest}</div>
        </div>
        <div className="bg-slate-100 rounded-xl p-3 border border-slate-700/30">
          <div className="text-xs text-slate-600 mb-1">Latency</div>
          <div className="font-bold text-slate-700 flex items-center gap-1">
            <Zap size={14} className="text-amber-400"/>
            {Math.round(vendor.metrics.averageLatencyMs)}ms
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl p-3 border border-slate-700/30">
          <div className="text-xs text-slate-600 mb-1">Success</div>
          <div className={`font-bold ${successRate < 70 ? 'text-rose-400' : successRate < 90 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {successRate}%
          </div>
        </div>
        <div className="bg-slate-100 rounded-xl p-3 border border-slate-700/30">
          <div className="text-xs text-slate-600 mb-1">Weight</div>
          <div className="font-bold text-purple-400">
            {vendor.weight || 10}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm border-t border-slate-700/50 pt-4 mt-2 relative z-10">
        <div className="text-slate-600">Total Requests</div>
        <div className="font-mono font-bold text-black bg-slate-200 px-3 py-1 rounded-lg">
          {vendor.metrics.totalRequests.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
