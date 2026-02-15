import { createContext, useContext, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LogContext = createContext(null);

const initialLogs = [
  { id: 1, timestamp: new Date(), action: 'login', user: 'María García', detail: 'Inicio de sesión exitoso', severity: 'info' },
  { id: 2, timestamp: new Date(Date.now() - 3600000), action: 'export', user: 'María García', detail: 'Exportación Excel: Reporte ventas Q1', severity: 'info' },
  { id: 3, timestamp: new Date(Date.now() - 7200000), action: 'filter', user: 'Carlos López', detail: 'Filtro aplicado: 01/01/2025 - 31/01/2025', severity: 'info' },
  { id: 4, timestamp: new Date(Date.now() - 86400000), action: 'view', user: 'Ana Martínez', detail: 'Visualización dashboard métricas', severity: 'info' },
  { id: 5, timestamp: new Date(Date.now() - 172800000), action: 'error', user: 'Sistema', detail: 'Timeout en conexión API reportes', severity: 'warning' },
];

export function LogProvider({ children }) {
  const [logs, setLogs] = useState(initialLogs);

  const addLog = useCallback(({ action, user, detail, severity = 'info' }) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date(),
      action,
      user,
      detail,
      severity,
    };
    setLogs((prev) => [entry, ...prev].slice(0, 500));
    return entry;
  }, []);

  const getLogsFormatted = useCallback((from, to) => {
    let list = [...logs];
    if (from) list = list.filter((l) => new Date(l.timestamp) >= from);
    if (to) list = list.filter((l) => new Date(l.timestamp) <= to);
    return list.map((l) => ({
      ...l,
      timestampStr: format(new Date(l.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es }),
    }));
  }, [logs]);

  return (
    <LogContext.Provider value={{ logs, addLog, getLogsFormatted }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogs must be used within LogProvider');
  return ctx;
}
