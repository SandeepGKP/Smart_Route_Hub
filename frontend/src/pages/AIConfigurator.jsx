import { useState } from 'react';
import { suggestRouting } from '../services/api';
import { BrainCircuit, Sparkles, Wand2 } from 'lucide-react';

export default function AIConfigurator() {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAiSuggest = async () => {
    if (!aiPrompt) return;
    setLoading(true);
    setError(null);
    try {
      const res = await suggestRouting(aiPrompt);
      setAiResult(res.data.config);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 bg-purple-200/20 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BrainCircuit size={32} />
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">Agentic AI Configurator</h1>
        <p className="text-slate-600 max-w-xl mx-auto">
          Use natural language to generate complex JSON routing schemas and vendor configurations instantly via Gemini AI.
        </p>
      </header>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/10">
        <div className="p-6 bg-white border-b border-slate-700/50">
          <label className="block text-sm font-medium text-slate-700 mb-2">Describe your requirement</label>
          <div className="relative">
            <textarea 
              className="w-full bg-white border border-slate-700 rounded-xl p-4 text-black placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              rows="4" 
              placeholder="e.g. Create a vendor named Karvy for PAN_VERIFICATION that costs 1.2, has weight 50, and supports OCR..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
            ></textarea>
            <Sparkles className="absolute top-4 right-4 text-purple-500/30" size={20} />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-slate-600 flex items-center gap-1">
              Powered by Google Gemini <Sparkles size={12}/>
            </p>
            <button 
              onClick={handleAiSuggest} 
              disabled={loading || !aiPrompt} 
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 disabled:text-slate-600 text-black font-medium rounded-xl transition-all shadow-lg shadow-purple-900/20 focus:ring-2 focus:ring-purple-400"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border-l-4 border-rose-500 text-rose-400 m-6 rounded-r-lg text-sm">
            {error}
          </div>
        )}

        {aiResult && !error && (
          <div className="p-6 bg-slate-100 animate-fade-in border-t border-slate-700/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Generated JSON Output</h3>
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(aiResult, null, 2))}
                className="text-xs cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
              >
                Copy to clipboard
              </button>
            </div>
            <pre className="bg-white p-4 rounded-xl text-slate-700 text-sm overflow-x-auto border border-slate-800">
              {JSON.stringify(aiResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
