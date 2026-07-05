import { useState } from 'react';
import { createVendor } from '../services/api';
import { ServerCog, PlusCircle } from 'lucide-react';

export default function AddVendor() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    const formData = new FormData(e.target);
    const vendorData = {
      name: formData.get('name'),
      capability: formData.get('capability'),
      costPerRequest: parseFloat(formData.get('cost')),
      timeoutMs: parseInt(formData.get('timeout')),
      priority: parseInt(formData.get('priority')),
      weight: parseInt(formData.get('weight')) || 10,
      rateLimitPerMinute: parseInt(formData.get('rateLimit')),
      supportedFeatures: [formData.get('features')]
    };
    
    try {
      await createVendor(vendorData);
      setSuccess(true);
      e.target.reset();
    } catch(err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
          <ServerCog size={28} className="text-blue" />
          Add New Vendor
        </h1>
        <p className="text-slate-700">Configure a new third-party vendor and add it to the routing engine pool.</p>
      </header>

      <div className="glass rounded-2xl p-8 border border-slate-700/50 shadow-xl shadow-emerald-900/5">
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
            <PlusCircle size={18} /> Vendor successfully added to the system!
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            Failed to add vendor: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Vendor Name</label>
              <input name="name" required placeholder="e.g. Karvy, NSDL" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Capability</label>
              <input name="capability" required defaultValue="PAN_VERIFICATION" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Cost Per Request ($)</label>
              <input name="cost" type="number" step="0.1" required placeholder="1.5" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Timeout (ms)</label>
              <input name="timeout" type="number" required placeholder="2000" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Failover Priority</label>
              <input name="priority" type="number" required placeholder="1 (Highest)" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Rate Limit (per min)</label>
              <input name="rateLimit" type="number" required placeholder="100" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Traffic Weight (%)</label>
              <input name="weight" type="number" required placeholder="50" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Supported Features (Optional)</label>
              <input name="features" placeholder="e.g. OCR, FACE_MATCH" className="w-full bg-slate-300 border border-slate-400 rounded-xl p-3 text-black focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center cursor-pointer gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 focus:ring-2 focus:ring-emerald-400"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <PlusCircle size={20} />
              )}
              Add Vendor to Network
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
