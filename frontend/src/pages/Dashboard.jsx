import { useState, useEffect } from 'react';
import { getVendors, testRoute } from '../services/api';
import VendorCard from '../components/VendorCard';
import { Activity, Play, Zap, ShieldAlert, BadgeIndianRupee, PieChart } from 'lucide-react';

export default function Dashboard() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routingResult, setRoutingResult] = useState(null);
  const [testPayload, setTestPayload] = useState({ capability: 'PAN_VERIFICATION', pan: 'ABCDE1234F', name: 'Rahul Sharma' });

  const fetchVendors = async () => {
    try {
      const res = await getVendors();
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    }
  };

  useEffect(() => {
    fetchVendors();
    const interval = setInterval(fetchVendors, 3000); // Poll faster for the demo
    return () => clearInterval(interval);
  }, []);

  const handleTestRoute = async (strategy) => {
    setLoading(true);
    setRoutingResult(null);
    try {
      const res = await testRoute({
        capability: testPayload.capability,
        strategy: strategy,
        payload: testPayload,
        requirements: { maxLatencyMs: 1500 } // Demo parameter
      });
      setRoutingResult(res.data);
    } catch (error) {
      setRoutingResult(error.response?.data || { error: 'Request Failed' });
    }
    setLoading(false);
    fetchVendors(); // Refresh metrics immediately
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Platform Dashboard</h1>
        <p className="text-slate-600">Real-time health metrics and routing simulation for your vendor network.</p>
      </header>

      {/* Simulator Section */}
      <section className="glass rounded-2xl p-6 border border-blue-500/30 shadow-lg shadow-blue-500/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Live Router Simulator</h2>
            <p className="text-sm text-slate-600">Trigger a PAN Verification request and watch the engine decide.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center h-full">
            <div className="flex flex-col gap-3 mb-6 items-center w-full max-w-[240px] mx-auto">
              <button 
                onClick={() => handleTestRoute('lowest_cost')} 
                disabled={loading}
                className="flex items-center justify-center cursor-pointer gap-2 w-full px-4 py-3 text-sm bg-slate-200 hover:bg-slate-300 text-black font-medium rounded-xl border border-slate-400 transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
              >
                <BadgeIndianRupee size={16} className="text-emerald-500" /> 
                Lowest Cost Route
              </button>
              
              <button 
                onClick={() => handleTestRoute('lowest_latency')} 
                disabled={loading}
                className="flex items-center justify-center cursor-pointer gap-2 w-full px-4 py-3 text-sm bg-slate-200 hover:bg-slate-300 text-black font-medium rounded-xl border border-slate-400 transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
              >
                <Zap size={16} className="text-amber-500" /> 
                Lowest Latency Route
              </button>
              
              <button 
                onClick={() => handleTestRoute('failover')} 
                disabled={loading}
                className="flex items-center justify-center cursor-pointer gap-2 w-full px-4 py-3 text-sm bg-slate-200 hover:bg-slate-300 text-black font-medium rounded-xl border border-slate-400 transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
              >
                <ShieldAlert size={16} className="text-rose-500" /> 
                Priority Failover
              </button>

              <button 
                onClick={() => handleTestRoute('weighted')} 
                disabled={loading}
                className="flex items-center justify-center cursor-pointer gap-2 w-full px-4 py-3 text-sm bg-slate-200 hover:bg-slate-300 text-black font-medium rounded-xl border border-slate-400 transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 shadow-sm"
              >
                <PieChart size={16} className="text-purple-500" /> 
                Weighted Route
              </button>
            </div>

            {routingResult && (
              <div className={`p-4 rounded-xl border ${routingResult.status === 'SUCCESS' ? 'bg-emerald-100 border-emerald-400' : 'bg-rose-100 border-rose-400'} animate-fade-in`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold ${routingResult.status === 'SUCCESS' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    Result: {routingResult.status}
                  </h3>
                  {routingResult.latencyMs && (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-slate-300 text-slate-700 font-mono">
                      {routingResult.latencyMs}ms
                    </span>
                  )}
                </div>
                {routingResult.vendorUsed && (
                  <p className="text-sm text-slate-800 mb-2">
                    Routed to: <strong className="text-black bg-white border border-slate-300 px-2 py-0.5 rounded ml-1">{routingResult.vendorUsed}</strong>
                  </p>
                )}
                {routingResult.routingReason && (
                  <p className="text-xs text-slate-700 italic mb-3">Reason: {routingResult.routingReason}</p>
                )}
                {routingResult.error && (
                  <p className="text-sm text-rose-600">{routingResult.error}</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-100 p-5 rounded-xl border border-slate-300 shadow-inner">
            <h3 className="font-bold text-black mb-4">Request Payload (Input)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Capability</label>
                <input 
                  type="text" 
                  list="capability-options"
                  value={testPayload.capability}
                  onChange={(e) => setTestPayload({...testPayload, capability: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mb-2"
                />
                <datalist id="capability-options">
                  {[...new Set(vendors.map(v => v.capability))].map(cap => (
                    <option key={cap} value={cap} />
                  ))}
                  <option value="PAN_VERIFICATION" />
                  <option value="OCR" />
                  <option value="FACE_MATCH" />
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">PAN Number</label>
                <input 
                  type="text" 
                  value={testPayload.pan}
                  onChange={(e) => setTestPayload({...testPayload, pan: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={testPayload.name}
                  onChange={(e) => setTestPayload({...testPayload, name: e.target.value})}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm text-black focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr></hr>
      {/* Vendors Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Activity size={20} className="text-slate-600" />
          <h2 className="text-xl font-bold text-black">Vendor Health Status</h2>
        </div>
        
        {vendors.length === 0 ? (
          <div className="glass p-10 text-center rounded-2xl text-slate-600">
            No vendors configured in the system. Use the "Add Vendor" tab to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
