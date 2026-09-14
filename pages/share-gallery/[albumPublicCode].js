import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiImage, FiUploadCloud, FiVideo } from 'react-icons/fi';
import Button from '@/components/ui/actions/Button';
import {
  finalizePublicShareGalleryUploads,
  getPublicShareGallery,
  putSignedFile,
  signPublicShareGalleryUploads,
} from '@/components/initialized/data/shareGalleryApi';
import { showError, showSuccess } from '@/components/initialized/Toast';
import {
  createImageThumb,
  createVideoPoster,
  fileToSignPayload,
  getImageMetadata,
  getMediaType,
  getVideoMetadata,
  validateFiles,
} from '@/components/eventos/modulos/fotos_compartidas/shareGalleryUploadUtils';
import styles from './shareGalleryPublic.module.scss';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function MediaTile({ item }) {
  const isVideo = item.mediaType === 'video';

  return (
    <article className={styles.mediaTile}>
      <div className={styles.mediaFrame}>
        {isVideo ? (
          <video
            src={item.internalUrl}
            poster={item.posterUrl || undefined}
            controls
            preload="metadata"
          />
        ) : (
          <img
            src={item.thumbUrl || item.internalUrl}
            alt={item.originalFilename || 'Foto compartida'}
            loading="lazy"
          />
        )}
      </div>
      <div className={styles.mediaMeta}>
        <span>{isVideo ? <FiVideo /> : <FiImage />}</span>
        <strong>{item.uploaderName || 'Invitado'}</strong>
        <small>{formatDate(item.uploadedAt)}</small>
      </div>
    </article>
  );
}

export default function ShareGalleryPublicPage() {
  const router = useRouter();
  const { albumPublicCode } = router.query;
  const [album, setAlbum] = useState(null);
  const [mine, setMine] = useState([]);
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const loadGallery = useCallback(async (nextPage = 1, append = false) => {
    if (!albumPublicCode) return;

    try {
      append ? setLoadingMore(true) : setLoading(true);
      const response = await getPublicShareGallery(albumPublicCode, { page: nextPage, pageSize: 24 });

      setAlbum(response?.album || null);
      setMine(Array.isArray(response?.mine?.items) ? response.mine.items : []);
      setMedia((current) => {
        const items = Array.isArray(response?.media?.items) ? response.media.items : [];
        return append ? [...current, ...items] : items;
      });
      setHasMore(Boolean(response?.media?.hasMore));
      setPage(nextPage);
    } catch (error) {
      showError(error?.data?.message || 'No fue posible cargar la galería.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [albumPublicCode]);

  useEffect(() => {
    if (!albumPublicCode) return;
    loadGallery(1, false);
  }, [albumPublicCode, loadGallery]);

  const selectedFilesInfo = useMemo(() => {
    const files = Array.from(selectedFiles || []);
    return {
      files,
      photos: files.filter((file) => getMediaType(file) === 'image').length,
      videos: files.filter((file) => getMediaType(file) === 'video').length,
    };
  }, [selectedFiles]);

  async function buildFinalizePayload(file, signedItem) {
    const mediaType = getMediaType(file);
    const metadata = mediaType === 'image'
      ? await getImageMetadata(file).catch(() => ({
          fileLastModifiedAt: file.lastModified ? new Date(file.lastModified).toISOString() : null,
        }))
      : await getVideoMetadata(file);

    return {
      mediaPublicCode: signedItem.mediaPublicCode,
      mediaType: signedItem.mediaType,
      mimeType: signedItem.mimeType,
      originalFilename: file.name,
      sizeBytes: file.size,
      r2KeyOriginal: signedItem.r2KeyOriginal,
      r2KeyThumb: signedItem.r2KeyThumb,
      r2KeyPoster: signedItem.r2KeyPoster,
      capturedAt: metadata.fileLastModifiedAt,
      fileLastModifiedAt: metadata.fileLastModifiedAt,
      width: metadata.width,
      height: metadata.height,
      durationSeconds: metadata.durationSeconds,
      uploaderName,
    };
  }

  async function uploadSelectedFiles() {
    const files = selectedFilesInfo.files;
    const validationError = validateFiles(files);
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setUploading(true);
      const signResponse = await signPublicShareGalleryUploads(albumPublicCode, {
        uploaderName: uploaderName.trim(),
        files: files.map(fileToSignPayload),
      });

      const uploads = Array.isArray(signResponse?.uploads) ? signResponse.uploads : [];
      const finalizeFiles = [];

      for (let index = 0; index < uploads.length; index += 1) {
        const signedItem = uploads[index];
        const file = files[index];
        await putSignedFile(signedItem.upload.original, file);

        if (signedItem.upload.thumb && getMediaType(file) === 'image') {
          const thumb = await createImageThumb(file).catch(() => null);
          if (thumb) await putSignedFile(signedItem.upload.thumb, thumb);
        }

        if (signedItem.upload.poster && getMediaType(file) === 'video') {
          const poster = await createVideoPoster(file).catch(() => null);
          if (poster) await putSignedFile(signedItem.upload.poster, poster);
        }

        finalizeFiles.push(await buildFinalizePayload(file, signedItem));
      }

      await finalizePublicShareGalleryUploads(albumPublicCode, {
        uploaderName: uploaderName.trim(),
        files: finalizeFiles,
      });

      showSuccess('Archivos subidos.');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadGallery(1, false);
    } catch (error) {
      showError(error?.data?.message || error?.message || 'No fue posible subir los archivos.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        {album?.logoUrl ? (
          <div className={styles.albumLogo}>
            <img src={album.logoUrl} alt={`Logo de ${album.nombre || 'álbum'}`} />
          </div>
        ) : null}

        <div className={styles.heroText}>
          <h1>{album?.nombre || 'Fotos compartidas'}</h1>
          {album?.descripcion ? <p>{album.descripcion}</p> : null}
        </div>
        <div className={styles.heroStats}>
          <span>{album?.photoCount || 0} fotos</span>
          <span>{album?.videoCount || 0} videos</span>
        </div>
      </section>

      <section className={styles.uploadCard}>
        <div className={styles.uploadHeader}>
          <h2>Sube tus fotos y videos</h2>
          <p>Tu nombre es opcional y ayuda a identificar tus recuerdos dentro del álbum.</p>
        </div>

        <label className={styles.field}>
          <span>Nombre opcional</span>
          <input
            value={uploaderName}
            onChange={(event) => setUploaderName(event.target.value)}
            placeholder="Tu nombre"
            maxLength={140}
          />
        </label>

        <label className={styles.fileDrop}>
          <FiUploadCloud />
          <strong>Seleccionar archivos</strong>
          <span>Hasta 50 archivos por lote. Fotos 25 MB, videos 500 MB.</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,image/webp,video/mp4,video/quicktime,video/webm"
            multiple
            onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
          />
        </label>

        {selectedFilesInfo.files.length ? (
          <div className={styles.selectedSummary}>
            <span>{selectedFilesInfo.files.length} archivos</span>
            <span>{selectedFilesInfo.photos} fotos</span>
            <span>{selectedFilesInfo.videos} videos</span>
          </div>
        ) : null}

        <Button fullWidth onClick={uploadSelectedFiles} disabled={uploading || !selectedFilesInfo.files.length}>
          {uploading ? 'Subiendo...' : 'Subir archivos'}
        </Button>
      </section>

      {loading ? (
        <section className={styles.stateCard}>
          <h2>Cargando galería...</h2>
        </section>
      ) : (
        <>
          {mine.length ? (
            <section className={styles.gallerySection}>
              <h2>Tus fotos</h2>
              <div className={styles.galleryGrid}>
                {mine.map((item) => <MediaTile key={`mine-${item.id}`} item={item} />)}
              </div>
            </section>
          ) : null}

          <section className={styles.gallerySection}>
            <h2>Galería completa</h2>
            {media.length ? (
              <>
                <div className={styles.galleryGrid}>
                  {media.map((item) => <MediaTile key={item.id} item={item} />)}
                </div>
                {hasMore ? (
                  <Button variant="secondary" fullWidth disabled={loadingMore} onClick={() => loadGallery(page + 1, true)}>
                    {loadingMore ? 'Cargando...' : 'Cargar más'}
                  </Button>
                ) : null}
              </>
            ) : (
              <div className={styles.stateCard}>
                <h3>Este álbum aún no tiene archivos</h3>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
