import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLogs } from '../../context/LogContext';
import { useAuth } from '../../context/AuthContext';
import styles from './AddDataForm.module.css';

const CATEGORIAS = ['General', 'Producto A', 'Producto B', 'Producto C', 'Servicios', 'Otros'];

export function AddDataForm() {
  const { addEntry } = useData();
  const { addLog } = useLogs();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fecha: new Date().toISOString().slice(0, 10),
    concepto: '',
    categoria: 'General',
    cantidad: 0,
    ingresos: 0,
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'cantidad' || name === 'ingresos' ? (value === '' ? '' : Number(value)) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEntry(form);
    addLog({
      action: 'add_data',
      user: user.name,
      detail: `Nuevo registro: ${form.concepto || 'Sin concepto'} - ${form.ingresos} €`,
      severity: 'info',
    });
    setSent(true);
    setForm({
      fecha: new Date().toISOString().slice(0, 10),
      concepto: '',
      categoria: 'General',
      cantidad: 0,
      ingresos: 0,
    });
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Añadir datos</h3>
      <p className={styles.hint}>Los datos se guardan en su navegador y se incluyen en Excel y PDF.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label className={styles.label}>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Concepto</label>
          <input
            type="text"
            name="concepto"
            value={form.concepto}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ej. Venta Q1"
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label}>Categoría</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} className={styles.input}>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className={styles.rowGrid}>
          <div className={styles.row}>
            <label className={styles.label}>Cantidad (unidades)</label>
            <input
              type="number"
              name="cantidad"
              value={form.cantidad || ''}
              onChange={handleChange}
              className={styles.input}
              min="0"
              step="1"
            />
          </div>
          <div className={styles.row}>
            <label className={styles.label}>Ingresos (€)</label>
            <input
              type="number"
              name="ingresos"
              value={form.ingresos || ''}
              onChange={handleChange}
              className={styles.input}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <button type="submit" className={styles.submit} disabled={sent}>
          {sent ? '✓ Guardado' : 'Guardar en el navegador'}
        </button>
      </form>
    </div>
  );
}
