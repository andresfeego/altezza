import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiLink2, FiShield, FiUsers } from 'react-icons/fi';
import { LuUserRoundCog } from 'react-icons/lu';
import { getUsuariosSistema } from '@/components/initialized/data/helpersGetDB';
import styles from '@/components/admin/dashboard/AdminDashboard.module.scss';

export default function AdminUsuariosPreview() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadUsuarios() {
      try {
        const data = await getUsuariosSistema();
        if (mounted) {
          setUsuarios(data || []);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadUsuarios();

    return () => {
      mounted = false;
    };
  }, []);

  const metricas = useMemo(() => {
    const activos = usuarios.filter((usuario) => Number(usuario.estado ?? 1) === 1).length;
    const conEvento = usuarios.filter((usuario) => usuario.eventosAsignados?.length).length;

    return {
      total: usuarios.length,
      activos,
      conEvento,
    };
  }, [usuarios]);

  return (
    <Link href="/admin/usuarios" className={styles.previewCard}>
      <div className={styles.previewTop}>
        <span className={styles.previewIcon}>
          <LuUserRoundCog size={18} />
        </span>
        <span className={styles.previewState}>Activo</span>
      </div>
      <h3>Usuarios</h3>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryTop}>
            <FiUsers size={14} />
            <span className={styles.summaryMetric}>{metricas.total}</span>
          </div>
          <span className={styles.summaryLabel}>Registrados</span>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryTop}>
            <FiShield size={14} />
            <span className={styles.summaryMetric}>{metricas.activos}</span>
          </div>
          <span className={styles.summaryLabel}>Activos</span>
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryTop}>
            <FiLink2 size={14} />
            <span className={styles.summaryMetric}>{metricas.conEvento}</span>
          </div>
          <span className={styles.summaryLabel}>Con evento</span>
        </div>
      </div>
      <span className={styles.summaryHint}>Resumen conectado al modulo de administracion de usuarios.</span>
    </Link>
  );
}
