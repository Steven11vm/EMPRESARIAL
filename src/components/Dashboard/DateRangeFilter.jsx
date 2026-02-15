import { useState } from 'react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './DateRangeFilter.module.css';

const PRESETS = [
  { label: 'Últimos 7 días', getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: 'Últimos 30 días', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: 'Este mes', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Últimos 3 meses', getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }) },
];

const defaultFrom = subDays(new Date(), 30);
const defaultTo = new Date();

export function DateRangeFilter({ value, onChange }) {
  const [from, setFrom] = useState(
    value?.from ? format(value.from, 'yyyy-MM-dd') : format(defaultFrom, 'yyyy-MM-dd')
  );
  const [to, setTo] = useState(
    value?.to ? format(value.to, 'yyyy-MM-dd') : format(defaultTo, 'yyyy-MM-dd')
  );

  const applyCustom = () => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime()) && fromDate <= toDate) {
      onChange({ from: fromDate, to: toDate });
    }
  };

  const applyPreset = (preset) => {
    const { from: f, to: t } = preset.getValue();
    setFrom(format(f, 'yyyy-MM-dd'));
    setTo(format(t, 'yyyy-MM-dd'));
    onChange({ from: f, to: t });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.presets}>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={styles.presetBtn}
            onClick={() => applyPreset(p)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className={styles.custom}>
        <label className={styles.label}>Desde</label>
        <input
          type="date"
          className={styles.input}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <label className={styles.label}>Hasta</label>
        <input
          type="date"
          className={styles.input}
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button type="button" className={styles.applyBtn} onClick={applyCustom}>
          Aplicar
        </button>
      </div>
    </div>
  );
}
