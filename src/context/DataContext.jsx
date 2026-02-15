import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { getStoredData, setStoredData } from '../utils/storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getStoredData());
  }, []);

  const addEntry = useCallback((entry) => {
    const newEntry = {
      id: Date.now(),
      fecha: entry.fecha || new Date().toISOString().slice(0, 10),
      concepto: entry.concepto || '',
      categoria: entry.categoria || 'General',
      cantidad: Number(entry.cantidad) || 0,
      ingresos: Number(entry.ingresos) || 0,
    };
    setEntries((prev) => {
      const next = [newEntry, ...prev];
      setStoredData(next);
      return next;
    });
    return newEntry;
  }, []);

  const removeEntry = useCallback((id) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      setStoredData(next);
      return next;
    });
  }, []);

  const getEntriesByRange = useCallback(
    (from, to) => {
      if (!from && !to) return entries;
      return entries.filter((e) => {
        const d = new Date(e.fecha).getTime();
        if (from && d < from.getTime()) return false;
        if (to && d > to.getTime()) return false;
        return true;
      });
    },
    [entries]
  );

  return (
    <DataContext.Provider value={{ entries, addEntry, removeEntry, getEntriesByRange }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
