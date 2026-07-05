import { useState, useEffect } from 'react';
import { getRoutingLogs } from '../services/api';
import RoutingLogTable from '../components/RoutingLogTable';
import { History } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await getRoutingLogs();
      setLogs(res.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Refresh logs every 10 seconds while on this page
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <header className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
          <History size={28} className="text-blue-400" />
          Routing History
        </h1>
        <p className="text-slate-600">Detailed audit log of all routing decisions, latencies, and failovers.</p>
      </header>

      <div className="flex-1 overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-600 gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Loading logs...
          </div>
        ) : (
          <RoutingLogTable logs={logs} />
        )}
      </div>
    </div>
  );
}
