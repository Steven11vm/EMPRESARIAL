import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMetricsByDateRange } from '../data/metrics';
import { useData } from '../context/DataContext';
import { DateRangeFilter } from '../components/Dashboard/DateRangeFilter';
import { ExportExcelButton } from '../components/Dashboard/ExportExcelButton';
import { ExportPdfButton } from '../components/Dashboard/ExportPdfButton';
import { AddDataForm } from '../components/Dashboard/AddDataForm';
import styles from './Dashboard.module.css';

const COLORS = ['#1e40af', '#0d9488', '#b45309', '#b91c1c', '#6d28d9'];
const CHART_ANIMATION = { isAnimationActive: true, animationDuration: 800, animationEasing: 'ease-out' };

function buildMetricsFromEntries(entries) {
  const ventasTotales = entries.reduce((a, e) => a + (e.cantidad || 0), 0);
  const ingresosTotales = entries.reduce((a, e) => a + (e.ingresos || 0), 0);
  const byDay = {};
  entries.forEach((e) => {
    const key = e.fecha;
    if (!byDay[key]) byDay[key] = { key, name: format(new Date(key), 'dd MMM', { locale: es }), ingresos: 0, gastos: 0 };
    byDay[key].ingresos += e.ingresos || 0;
  });
  const byCat = {};
  entries.forEach((e) => {
    const c = e.categoria || 'General';
    byCat[c] = (byCat[c] || 0) + (e.cantidad || 0) + (e.ingresos ? 1 : 0);
  });
  const ingresos = Object.values(byDay).sort((a, b) => a.key.localeCompare(b.key));
  const porCategoria = Object.entries(byCat).map(([name, value]) => ({ name, value }));
  return {
    ventas: entries.map((e) => ({ fecha: e.fecha, cantidad: e.cantidad, ingresos: e.ingresos })),
    ingresos: ingresos.length ? ingresos : [{ name: '-', ingresos: 0, gastos: 0 }],
    porCategoria: porCategoria.length ? porCategoria : [{ name: 'Sin datos', value: 1 }],
    kpis: {
      ingresosTotales,
      ventasTotales,
      ticketMedio: ventasTotales ? Math.round(ingresosTotales / ventasTotales) : 0,
      crecimiento: 0,
    },
  };
}

export function Dashboard() {
  const { getEntriesByRange } = useData();
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const entriesInRange = useMemo(
    () => getEntriesByRange(dateRange.from, dateRange.to),
    [getEntriesByRange, dateRange.from, dateRange.to]
  );

  const metrics = useMemo(() => {
    if (entriesInRange.length > 0) {
      return buildMetricsFromEntries(entriesInRange);
    }
    return getMetricsByDateRange(dateRange.from, dateRange.to);
  }, [entriesInRange, dateRange.from, dateRange.to]);

  const kpis = metrics.kpis;
  const chartData = metrics.ingresos;
  const pieData = metrics.porCategoria;
  const exportData = useMemo(
    () => entriesInRange.map(({ id, ...r }) => r),
    [entriesInRange]
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Métricas y análisis del período seleccionado</p>
        </div>
        <div className={styles.actions}>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <ExportExcelButton data={exportData.length ? exportData : metrics.ventas} filename="metricas_dashboard" />
          <ExportPdfButton data={exportData.length ? exportData : metrics.ventas} filename="reporte" />
        </div>
      </header>

      <section className={styles.addDataSection}>
        <AddDataForm />
      </section>

      <section className={styles.kpis}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ingresos totales</span>
          <span className={styles.kpiValue}>
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(kpis.ingresosTotales)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ventas (unidades)</span>
          <span className={styles.kpiValue}>{kpis.ventasTotales.toLocaleString('es-ES')}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Ticket medio</span>
          <span className={styles.kpiValue}>
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(kpis.ticketMedio)}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Crecimiento (%)</span>
          <span className={styles.kpiValue}>{kpis.crecimiento.toFixed(1)}%</span>
        </div>
      </section>

      <div className={styles.charts}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Ingresos vs Gastos</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 16, right: 16, left: 8, bottom: 8 }} {...CHART_ANIMATION}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#475569" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#475569" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value), '']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#1e40af" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="gastos" name="Gastos" stroke="#475569" strokeWidth={2} fillOpacity={1} fill="url(#colorGastos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Ingresos por día</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 16, right: 16, left: 8, bottom: 8 }} {...CHART_ANIMATION}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e40af" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#94a3b8" axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value) => [new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value), 'Ingresos']}
                />
                <Bar dataKey="ingresos" name="Ingresos" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Distribución por categoría</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={56}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                  isAnimationActive
                  animationDuration={800}
                  animationEasing="ease-out"
                  legendType="circle"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 16 }} iconType="circle" iconSize={10} formatter={(value, entry) => `${value} (${entry.payload?.value ?? 0})`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
