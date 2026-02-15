import { useAuth } from '../../context/AuthContext';
import { useLogs } from '../../context/LogContext';
import { exportReportPdf } from '../../utils/exportPdf';
import styles from './ExportExcelButton.module.css';

export function ExportPdfButton({ data, filename = 'reporte' }) {
  const { user, hasPermission } = useAuth();
  const { addLog } = useLogs();

  if (!hasPermission('export')) return null;

  const handleExport = () => {
    const name = exportReportPdf({ data, filename });
    addLog({
      action: 'export',
      user: user.name,
      detail: `Exportación PDF: ${name}`,
      severity: 'info',
    });
  };

  return (
    <button type="button" className={styles.btnPdf} onClick={handleExport}>
      <span className={styles.icon}>📄</span>
      Exportar a PDF
    </button>
  );
}
