import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LogProvider } from './context/LogContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout/Layout';
import { WelcomeModal } from './components/WelcomeModal/WelcomeModal';
import { Dashboard } from './pages/Dashboard';
import { Logs } from './pages/Logs';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LogProvider>
        <DataProvider>
          <BrowserRouter>
            <WelcomeModal />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="logs" element={<Logs />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </LogProvider>
    </AuthProvider>
  );
}

export default App;
