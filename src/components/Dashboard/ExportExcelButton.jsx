import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import { useLogs } from '../../context/LogContext';
import styles from './ExportExcelButton.module.css';

function buildSheetWithHeader(data) {
  const dateStr = new Date().toLocaleString('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const headers = data.length
    ? ['Fecha', 'Concepto', 'Categoría', 'Cantidad', 'Ingresos (€)']
    : ['Mensaje'];
  const rows = data.length
    ? data.map((r) => [
        r.fecha ?? '',
        r.concepto ?? '',
        r.categoria ?? '',
        r.cantidad ?? '',
        r.ingresos ?? '',
      ])
    : [['Sin datos para exportar']];
  const aoa = [
    ['Panel Empresarial'],
    ['Reporte exportado', dateStr],
    [],
    headers,
    ...rows,
  ];
  return XLSX.utils.aoa_to_sheet(aoa);
}

export function ExportExcelButton({ data, filename = 'reporte' }) {
  const { user, hasPermission } = useAuth();
  const { addLog } = useLogs();

  if (!hasPermission('export')) return null;

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    if (Array.isArray(data)) {
      const ws = data.length > 0
        ? buildSheetWithHeader(data)
        : buildSheetWithHeader([{ Fecha: '', Concepto: '', Categoría: '', Cantidad: '', Ingresos: 'Sin datos' }]);
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    } else if (data?.sheets) {
      data.sheets.forEach(({ name, rows }) => {
        const ws = buildSheetWithHeader(rows.length ? rows : [{ Mensaje: 'Sin datos' }]);
        XLSX.utils.book_append_sheet(wb, ws, name);
      });
    } else {
      const ws = buildSheetWithHeader([{ mensaje: 'Sin datos para exportar' }]);
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    }

    const fileName = `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
    addLog({
      action: 'export',
      user: user.name,
      detail: `Exportación Excel: ${fileName}`,
      severity: 'info',
    });
  };

  return (
    <button type="button" className={styles.btn} onClick={handleExport}>
      <span className={styles.icon}>📥</span>
      Exportar a Excel
    </button>
  );
}
