import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FiImage } from 'react-icons/fi';
import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import { getDetalleEvento } from '@/components/initialized/data/helpersGetDB';
import { showError } from '@/components/initialized/Toast';
import { ADMIN_EVENT_SECTIONS, getAdminEventoSectionHref } from './adminEventoSections';
import workspaceStyles from './AdminEventoWorkspace.module.scss';
import styles from './AdminEventoSectionLayout.module.scss';

export default function AdminEventoSectionLayout({
  idEvento,
  sectionId,
  sectionTitle,
  children,
}) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idEvento) return;

    let cancelled = false;

    async function loadEvento() {
      try {
        setLoading(true);
        const response = await getDetalleEvento(idEvento);
        if (cancelled) return;
        const detail = Array.isArray(response) ? response[0] : response;
        setEvento(detail || null);
      } catch (error) {
        if (cancelled) return;
        setEvento(null);
        showError('No fue posible cargar el detalle del evento.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvento();

    return () => {
      cancelled = true;
    };
  }, [idEvento]);

  const hasImage = Boolean(evento?.imagenPrincipal && evento.imagenPrincipal.length > 10);
  const navigationItems = useMemo(
    () =>
      ADMIN_EVENT_SECTIONS.map((section) => ({
        ...section,
        href: getAdminEventoSectionHref(idEvento, section.id),
        active: section.id === sectionId,
      })),
    [idEvento, sectionId]
  );

  return (
    <div className={`${workspaceStyles.page} ${shellStyles.page}`}>
      <section className={workspaceStyles.hero}>
        <div className={workspaceStyles.heroMedia}>
          {hasImage ? (
            <Image
              src={evento.imagenPrincipal}
              alt={`Imagen del evento ${evento.nombre}`}
              fill
              unoptimized
            />
          ) : (
            <div className={workspaceStyles.mediaPlaceholder}>
              <FiImage />
            </div>
          )}

          <div className={workspaceStyles.heroOverlay}>
            <h1 className={workspaceStyles.heroTitle}>{evento?.nombre || idEvento}</h1>
          </div>
        </div>
      </section>

      <section className={`${workspaceStyles.sectionCard} ${shellStyles.sectionCard} ${workspaceStyles.overlapCard}`}>
        <div className={styles.topMeta}>
          <span className={workspaceStyles.metaPill}>{evento?.id || idEvento}</span>
          <span className={workspaceStyles.metaPill}>{evento?.nombreTipoEvento || evento?.tipoEvento || 'Sin tipo definido'}</span>
          <span className={`${workspaceStyles.metaPill} ${evento?.estado ? workspaceStyles.metaPillActive : ''}`}>
            {evento?.estado ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <nav className={styles.nav} aria-label="Navegacion del evento">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.navLink} ${item.active ? styles.navLinkActive : ''}`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </section>

      <section className={`${workspaceStyles.sectionCard} ${shellStyles.sectionCard}`}>
        <div className={shellStyles.sectionHeader}>
          <h2 className={shellStyles.sectionTitle}>{sectionTitle}</h2>
        </div>

        {children({ evento, loading })}
      </section>
    </div>
  );
}
