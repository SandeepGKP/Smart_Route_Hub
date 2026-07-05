import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BrainCircuit, Network, PlusCircle } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Routing Logs', path: '/logs', icon: <FileText size={20} /> },
    { name: 'AI Configurator', path: '/ai', icon: <BrainCircuit size={20} /> },
    { name: 'Add Vendor', path: '/add-vendor', icon: <PlusCircle size={20} /> },
  ];

  return (
    <aside className="w-64 glass h-[calc(100vh-2rem)] rounded-2xl m-4 flex flex-col overflow-hidden sticky top-4">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
          <Network size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900">SmartRouter</h1>
          <p className="text-xs text-slate-600 text-center uppercase tracking-wider font-semibold">Hub</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-black shadow-lg shadow-blue-500/20' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Status</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
