import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function exportReportPdf({ data, filename = 'reporte' }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = margin;

  // Logo (dibujado para compatibilidad en todos los visores PDF)
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin, y, 24, 24, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('EC', margin + 12, y + 14, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  y += 28;

  // Título
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Panel Empresarial', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Reporte generado el ${format(new Date(), "dd 'de' MMMM yyyy, HH:mm", { locale: es })}`,
    margin,
    y
  );
  doc.setTextColor(0, 0, 0);
  y += 14;

  // Tabla de datos
  if (Array.isArray(data) && data.length > 0) {
    const headers = ['Fecha', 'Concepto', 'Categoría', 'Cantidad', 'Ingresos (€)'];
    const colW = (pageW - 2 * margin) / headers.length;
    const rowH = 8;
    const headY = y;

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, headY, pageW - 2 * margin, rowH, 'F');
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    headers.forEach((h, i) => {
      doc.text(h, margin + i * colW + 2, headY + 5.5);
    });
    doc.setFont(undefined, 'normal');
    y += rowH;

    data.forEach((row, idx) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      const fill = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
      doc.setFillColor(...fill);
      doc.rect(margin, y, pageW - 2 * margin, rowH, 'F');
      const fecha = row.fecha ? format(new Date(row.fecha), 'dd/MM/yyyy', { locale: es }) : '-';
      const concepto = String(row.concepto || '-').slice(0, 22);
      const categoria = String(row.categoria || '-').slice(0, 12);
      const cantidad = row.cantidad != null ? String(row.cantidad) : '-';
      const ingresos = row.ingresos != null ? new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(row.ingresos) : '-';
      doc.setFontSize(8);
      doc.text(fecha, margin + 2, y + 5.5);
      doc.text(concepto, margin + colW + 2, y + 5.5);
      doc.text(categoria, margin + 2 * colW + 2, y + 5.5);
      doc.text(cantidad, margin + 3 * colW + 2, y + 5.5);
      doc.text(ingresos, margin + 4 * colW + 2, y + 5.5);
      y += rowH;
    });
    y += 6;
  } else {
    doc.setFontSize(10);
    doc.text('No hay datos para mostrar en el período seleccionado.', margin, y);
    y += 10;
  }

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    'Documento generado por Panel Empresarial · Confidencial',
    margin,
    doc.internal.pageSize.getHeight() - 10
  );

  const name = `${filename}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.pdf`;
  doc.save(name);
  return name;
}
