import { Clock, Zap, DollarSign, Target, CheckCircle2, XCircle } from 'lucide-react';

export default function RoutingLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="glass p-10 rounded-2xl text-center text-slate-600">
        <div className="bg-slate-200/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-slate-600" />
        </div>
        <p>No routing logs available yet.</p>
        <p className="text-sm mt-2">Test a route to generate logs.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden border border-slate-700/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-700/50">
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Vendor Used</th>
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Strategy</th>
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reason</th>
              <th className="p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-200/30 transition-colors">
                <td className="p-4">
                  {log.status === 'SUCCESS' ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md w-fit text-xs font-bold">
                      <CheckCircle2 size={14} /> SUCCESS
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md w-fit text-xs font-bold">
                      <XCircle size={14} /> FAILED
                    </div>
                  )}
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{log.vendorUsed}</div>
                  <div className="text-xs text-slate-600">{log.capability}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Target size={14} className="text-blue-400" />
                    {log.routingStrategy}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={log.routingReason || log.errorMessage}>
                  {log.routingReason || log.errorMessage || "N/A"}
                </td>
                <td className="p-4 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm font-medium text-amber-400 bg-amber-500/10 px-2 rounded">
                      <Zap size={12} /> {log.latencyMs}ms
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <DollarSign size={12} /> {log.cost}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
