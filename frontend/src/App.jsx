import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddVendor from './pages/AddVendor';
import Logs from './pages/Logs';
import AIConfigurator from './pages/AIConfigurator';

function App() {
  return (
    <Router>
      {/* Using solid body background globally to avoid gradient messes */}
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-vendor" element={<AddVendor />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/ai" element={<AIConfigurator />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
