import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useLogs } from '../context/LogContext';
import { DateRangeFilter } from '../components/Dashboard/DateRangeFilter';
import { ExportExcelButton } from '../components/Dashboard/ExportExcelButton';
import styles from './Logs.module.css';

const SEVERITY_LABELS = {
  info: 'Info',
  warning: 'Advertencia',
  error: 'Error',
};

export function Logs() {
  const { getLogsFormatted } = useLogs();
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const logs = useMemo(() => {
    return getLogsFormatted(dateRange.from || undefined, dateRange.to || undefined);
  }, [getLogsFormatted, dateRange.from, dateRange.to]);

  const exportData = useMemo(
    () =>
      logs.map((l) => ({
        Fecha: format(new Date(l.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: es }),
        Acción: l.action,
        Usuario: l.user,
        Detalle: l.detail,
        Severidad: l.severity,
      })),
    [logs]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Registro de actividad</h1>
          <p className={styles.subtitle}>Sistema de logs del panel administrativo</p>
        </div>
        <div className={styles.actions}>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <ExportExcelButton data={exportData} filename="logs_actividad" />
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Acción</th>
              <th>Usuario</th>
              <th>Detalle</th>
              <th>Severidad</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  No hay registros en el período seleccionado.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className={styles[`row_${log.severity}`]}>
                  <td className={styles.cellDate}>{log.timestampStr}</td>
                  <td><code className={styles.code}>{log.action}</code></td>
                  <td>{log.user}</td>
                  <td>{log.detail}</td>
                  <td>
                    <span className={styles[`badge_${log.severity}`]}>
                      {SEVERITY_LABELS[log.severity] || log.severity}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
