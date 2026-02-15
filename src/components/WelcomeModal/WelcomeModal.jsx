import { useState, useEffect } from 'react';
import { getWelcomeDismissed, setWelcomeDismissed } from '../../utils/storage';
import logoSrc from '../../assets/logo.svg';
import styles from './WelcomeModal.module.css';

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!getWelcomeDismissed()) setOpen(true);
  }, []);

  const handleClose = () => {
    setWelcomeDismissed(dontShowAgain);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.logoWrap}>
          <img src={logoSrc} alt="" className={styles.logo} aria-hidden />
        </div>
        <h2 id="modal-title" className={styles.title}>
          Bienvenido al Panel Empresarial
        </h2>
        <div className={styles.content}>
          <p>
            Este panel le permite <strong>gestionar métricas y reportes</strong> de forma centralizada:
          </p>
          <ul>
            <li><strong>Dashboard:</strong> visualice KPIs, gráficas de ingresos y gastos, y distribución por categoría.</li>
            <li><strong>Añadir datos:</strong> registre ventas, conceptos y cantidades; se guardan en su navegador (cookies/almacenamiento local) y se usan en los reportes.</li>
            <li><strong>Exportar:</strong> genere informes en <strong>Excel</strong> y <strong>PDF</strong> con el logo de la empresa y los datos guardados.</li>
            <li><strong>Registro de actividad:</strong> consulte los logs del sistema.</li>
          </ul>
          <p className={styles.note}>
            Los datos que añada se conservan en este dispositivo y se incluyen automáticamente en las exportaciones.
          </p>
        </div>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          <span>No volver a mostrar este mensaje</span>
        </label>
        <button type="button" className={styles.button} onClick={handleClose}>
          Entendido
        </button>
      </div>
    </div>
  );
}
