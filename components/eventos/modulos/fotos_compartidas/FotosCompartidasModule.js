import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiCopy, FiExternalLink, FiImage, FiPlus, FiVideo } from 'react-icons/fi';
import Button from '@/components/ui/actions/Button';
import EventClientModuleShell from '@/components/eventos/shared/EventClientModuleShell';
import { createShareGalleryAlbum, getShareGalleryAlbums } from '@/components/initialized/data/shareGalleryApi';
import { showError, showSuccess } from '@/components/initialized/Toast';
import styles from './fotosCompartidas.module.scss';

function formatDate(value) {
  if (!value) return 'Sin fecha';
  try {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return 'Sin fecha';
  }
}

function AlbumCreateModal({ open, saving, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setNombre('');
    setDescripcion('');
    setLogoUrl('');
    setErrors({});
  }, [open]);

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();
    const cleanName = nombre.trim();
    const cleanLogoUrl = logoUrl.trim();
    if (!cleanName) {
      setErrors({ nombre: 'El nombre del álbum es obligatorio.' });
      return;
    }

    if (cleanLogoUrl && !/^https?:\/\/\S+$/i.test(cleanLogoUrl)) {
      setErrors({ logoUrl: 'Usa una URL válida que inicie con http:// o https://.' });
      return;
    }

    onSubmit({
      nombre: cleanName,
      descripcion: descripcion.trim(),
      logoUrl: cleanLogoUrl,
    });
  }

  return (
    <div className={styles.modalOverlay} role="presentation">
      <form className={styles.modal} onSubmit={handleSubmit}>
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className={styles.modalTitleBlock}>
          <h2>Crear álbum</h2>
        </div>

        <label className={styles.field}>
          <span>Nombre</span>
          <input
            value={nombre}
            onChange={(event) => {
              setNombre(event.target.value);
              setErrors((current) => ({ ...current, nombre: '' }));
            }}
            placeholder="Fotos de la recepción"
            maxLength={140}
          />
          {errors.nombre ? <strong className={styles.fieldError}>{errors.nombre}</strong> : null}
        </label>

        <label className={styles.field}>
          <span>Descripción</span>
          <textarea
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Texto opcional para orientar a los invitados."
          />
        </label>

        <label className={styles.field}>
          <span>Logo del álbum</span>
          <input
            value={logoUrl}
            onChange={(event) => {
              setLogoUrl(event.target.value);
              setErrors((current) => ({ ...current, logoUrl: '' }));
            }}
            placeholder="https://..."
            maxLength={1000}
          />
          {errors.logoUrl ? <strong className={styles.fieldError}>{errors.logoUrl}</strong> : null}
        </label>

        <div className={styles.modalActions}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Creando...' : 'Crear álbum'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function FotosCompartidasModule({ idEvento, canCreateAlbums = false, embedded = false }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadAlbums = useCallback(async () => {
    if (!idEvento) {
      setAlbums([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getShareGalleryAlbums(idEvento);
      setAlbums(Array.isArray(response?.albums) ? response.albums : []);
    } catch (error) {
      setAlbums([]);
      showError(error?.data?.message || 'No fue posible cargar los albumes.');
    } finally {
      setLoading(false);
    }
  }, [idEvento]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      await loadAlbums();
      if (cancelled) return;
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [idEvento, loadAlbums]);

  const summary = useMemo(() => {
    const totals = albums.reduce(
      (acc, album) => ({
        photos: acc.photos + Number(album.photoCount || 0),
        videos: acc.videos + Number(album.videoCount || 0),
        media: acc.media + Number(album.mediaCount || 0),
      }),
      { photos: 0, videos: 0, media: 0 }
    );

    return [
      { label: 'Álbumes', value: albums.length },
      { label: 'Fotos', value: totals.photos },
      { label: 'Videos', value: totals.videos },
    ];
  }, [albums]);

  async function handleCreateAlbum(payload) {
    try {
      setSaving(true);
      await createShareGalleryAlbum(idEvento, payload);
      showSuccess('Álbum creado.');
      setIsCreateOpen(false);
      await loadAlbums();
    } catch (error) {
      showError(error?.data?.message || 'No fue posible crear el álbum.');
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess('Enlace copiado.');
    } catch {
      showError('No fue posible copiar el enlace.');
    }
  }

  return (
    <EventClientModuleShell
      eyebrow=""
      title="Fotos compartidas"
      description="Álbumes públicos para recibir fotos y videos de los invitados durante el evento."
      actions={canCreateAlbums ? (
        <Button iconLeading={<FiPlus />} onClick={() => setIsCreateOpen(true)}>
          Crear álbum
        </Button>
      ) : null}
      className={embedded ? styles.embedded : ''}
    >
      <section className={styles.summaryCard}>
        {summary.map((item) => (
          <div key={item.label} className={styles.summaryItem}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      {!idEvento ? (
        <section className={styles.emptyCard}>
          <h3>No hay evento activo</h3>
          <p>Selecciona un evento para ver los álbumes de fotos compartidas.</p>
        </section>
      ) : loading ? (
        <section className={styles.emptyCard}>
          <h3>Cargando álbumes...</h3>
          <p>Estamos preparando la galería del evento.</p>
        </section>
      ) : albums.length ? (
        <section className={styles.albumGrid}>
          {albums.map((album) => (
            <article key={album.id} className={styles.albumCard}>
              {album.logoUrl ? (
                <div className={styles.albumLogoPreview}>
                  <img src={album.logoUrl} alt={`Logo de ${album.nombre}`} />
                </div>
              ) : null}

              <div className={styles.albumHead}>
                <div>
                  <h3>{album.nombre}</h3>
                  <span>{formatDate(album.createdAt)}</span>
                </div>
                <span className={styles.statePill}>{album.estado}</span>
              </div>

              {album.descripcion ? <p>{album.descripcion}</p> : null}

              <div className={styles.albumMetrics}>
                <span><FiImage /> {album.photoCount || 0}</span>
                <span><FiVideo /> {album.videoCount || 0}</span>
              </div>

              <div className={styles.qrBlock}>
                {album.qrUrl ? <img src={album.qrUrl} alt={`QR de ${album.nombre}`} /> : null}
                <div>
                  <strong>URL pública</strong>
                  <code>{album.publicUrl}</code>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Button variant="secondary" onClick={() => copyLink(album.publicUrl)} iconLeading={<FiCopy />}>
                  Copiar
                </Button>
                <Button as="a" href={album.publicUrl} target="_blank" rel="noreferrer" iconLeading={<FiExternalLink />}>
                  Abrir
                </Button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className={styles.emptyCard}>
          <h3>No hay álbumes creados</h3>
          <p>{canCreateAlbums ? 'Crea el primer álbum para generar el QR del evento.' : 'El equipo de Altezza aún no ha publicado álbumes para este evento.'}</p>
        </section>
      )}

      <AlbumCreateModal
        open={isCreateOpen}
        saving={saving}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateAlbum}
      />
    </EventClientModuleShell>
  );
}
