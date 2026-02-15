import { subDays, subMonths } from 'date-fns';

// Métricas simuladas para gráficas y KPI
export function getMetricsByDateRange(from, to) {
  const days = Math.max(1, Math.ceil((to - from) / (24 * 60 * 60 * 1000)));
  const ventas = [];
  const ingresos = [];
  const categorias = ['Producto A', 'Producto B', 'Producto C', 'Servicios', 'Otros'];
  const porCategoria = categorias.map((c) => ({ name: c, value: 10 + Math.floor(Math.random() * 40) }));

  for (let i = days - 1; i >= 0; i--) {
    const d = subDays(to, i);
    ventas.push({
      fecha: d.toISOString().slice(0, 10),
      cantidad: 80 + Math.floor(Math.random() * 120),
      ingresos: 12000 + Math.floor(Math.random() * 18000),
    });
    ingresos.push({
      name: d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      ingresos: 12000 + Math.floor(Math.random() * 18000),
      gastos: 4000 + Math.floor(Math.random() * 6000),
    });
  }

  return {
    ventas,
    ingresos,
    porCategoria,
    kpis: {
      ingresosTotales: ventas.reduce((a, b) => a + b.ingresos, 0),
      ventasTotales: ventas.reduce((a, b) => a + b.cantidad, 0),
      ticketMedio: ventas.length
        ? Math.round(ventas.reduce((a, b) => a + b.ingresos, 0) / ventas.reduce((a, b) => a + b.cantidad, 0))
        : 0,
      crecimiento: 2.4 + (Math.random() * 4),
    },
  };
}

// Datos por defecto (últimos 30 días)
export function getDefaultMetrics() {
  const to = new Date();
  const from = subMonths(to, 1);
  return getMetricsByDateRange(from, to);
}
