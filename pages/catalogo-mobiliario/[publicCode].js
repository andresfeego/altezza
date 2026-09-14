import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getPublicMobiliarioCatalog } from '@/components/initialized/data/mobiliarioApi';
import styles from './catalogo.module.scss';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
const MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

function CatalogStatus({ unavailable = false }) {
  return <main className={styles.status}><img src="/images/logo_altezza.png" alt="Altezza" />{unavailable ? <><h1>Este catálogo no está disponible</h1><p>El enlace puede haber cambiado o estar temporalmente desactivado.</p></> : <span role="status">Cargando catálogo…</span>}</main>;
}

function ProductSpread({ product, index }) {
  const measures = (product.variants || []).filter((item) => item.medidas?.trim());
  return <article id={`producto-${product.publicCode}`} className={`${styles.spread} ${index % 2 ? styles.reverse : ''}`}>
    <div className={styles.decorImage}><img loading="lazy" src={product.imagenDecoracion?.url} alt={product.imagenDecoracion?.altText || `Decoración con ${product.nombre}`} /></div>
    <div className={styles.spreadTitle}><h2>{product.nombre}</h2><span>REF. {product.codigo}</span></div>
    <div className={styles.productPortrait}><img loading="lazy" src={product.imagenProducto?.url} alt={product.imagenProducto?.altText || product.nombre} /></div>
    <div className={styles.productBands}>
    {measures.length > 0 && <ul className={styles.measureBands} aria-label="Medidas disponibles">{measures.map((item, i) => <li key={i}>{item.medidas}</li>)}</ul>}
    <div className={styles.colorBand}><span className={styles.srOnly}>Color: </span>{product.color}</div>
    </div>
  </article>;
}

// Keep layout height constant while the sticky shell consumes its invisible upper
// space. Transforms never feed back into measurements or move the product list.
function useCatalogHeader(enabled) {
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const measureRef = useRef(null);
  const filtersRef = useRef(null);
  const titleRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const page = pageRef.current;
    const header = headerRef.current;
    const filters = filtersRef.current;
    const title = titleRef.current;
    const logo = logoRef.current;
    const desktop = window.matchMedia('(min-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let anchorFrame = 0;
    let disposed = false;
    let needsMeasurement = true;
    let metrics = { expanded: 0, filters: 0, range: 0, titleOffset: 0, titleScale: 1, logoScale: 1 };

    function render() {
      frame = 0;
      if (disposed) return;
      if (needsMeasurement) {
        needsMeasurement = false;
        const filterHeight = filters.offsetHeight;
        const titleSize = parseFloat(getComputedStyle(title).fontSize);
        const compactTitleSize = parseFloat(getComputedStyle(page).getPropertyValue('--catalog-compact-title-size'));
        const expanded = desktop.matches ? measureRef.current.offsetHeight : 0;
        metrics = {
          expanded, filters: filterHeight, range: Math.max(0, expanded - filterHeight),
          titleOffset: (title.parentElement.offsetHeight - title.offsetHeight) / 2,
          titleScale: Math.min(1, compactTitleSize / titleSize),
          logoScale: Math.min(1, 32 / (logo.offsetHeight || 32)),
        };
        header.style.setProperty('--catalog-expanded-height', `${expanded}px`);
        header.style.setProperty('--catalog-filter-height', `${filterHeight}px`);
        header.style.setProperty('--catalog-collapse-range', `${metrics.range}px`);
        page.style.setProperty('--catalog-sticky-height', `${filterHeight * (desktop.matches ? 2 : 1)}px`);
        page.style.setProperty('--catalog-scroll-room', `${desktop.matches ? metrics.range : 0}px`);
      }
      const collapsed = desktop.matches ? Math.min(metrics.range, Math.max(0, window.scrollY)) : 0;
      const progress = metrics.range ? collapsed / metrics.range : 0;
      const decoration = reducedMotion.matches ? Number(progress > 0) : progress;
      header.style.setProperty('--catalog-collapsed', `${collapsed}px`);
      header.style.setProperty('--catalog-decoration-opacity', String(1 - decoration));
      header.style.setProperty('--catalog-title-shift', `${metrics.titleOffset * decoration}px`);
      header.style.setProperty('--catalog-title-scale', String(1 + (metrics.titleScale - 1) * decoration));
      header.style.setProperty('--catalog-logo-scale', String(1 + (metrics.logoScale - 1) * decoration));
    }
    function schedule() {
      if (!frame && !disposed) frame = window.requestAnimationFrame(render);
    }
    function measure() { needsMeasurement = true; schedule(); }
    function alignHash() {
      window.cancelAnimationFrame(anchorFrame);
      anchorFrame = window.requestAnimationFrame(() => {
        if (disposed || !window.location.hash.startsWith('#producto-')) return;
        let id;
        try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (target && page.contains(target)) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      });
    }
    const observer = new ResizeObserver(measure);
    [measureRef.current, filters, title.parentElement, logo].forEach((element) => observer.observe(element));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('hashchange', alignHash);
    desktop.addEventListener('change', measure);
    reducedMotion.addEventListener('change', schedule);
    logo.addEventListener('load', measure);
    document.fonts.addEventListener('loadingdone', measure);
    document.fonts.ready.then(() => { if (!disposed) { measure(); alignHash(); } });
    render();
    return () => {
      disposed = true;
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(anchorFrame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('hashchange', alignHash);
      desktop.removeEventListener('change', measure);
      reducedMotion.removeEventListener('change', schedule);
      logo.removeEventListener('load', measure);
      document.fonts.removeEventListener('loadingdone', measure);
    };
  }, [enabled]);
  return { pageRef, headerRef, measureRef, filtersRef, titleRef, logoRef };
}

export default function PublicMobiliarioCatalog() {
  const router = useRouter();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const header = useCatalogHeader(!loading && !unavailable);

  useEffect(() => {
    if (!router.isReady) return undefined;
    let current = true;
    setLoading(true); setUnavailable(false); setSearch(''); setCategory('all');
    getPublicMobiliarioCatalog(router.query.publicCode)
      .then((data) => { if (current) setCatalog(data); })
      .catch(() => { if (current) setUnavailable(true); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [router.isReady, router.query.publicCode]);

  const products = useMemo(() => {
    const term = normalize(search);
    return (catalog?.products || []).filter((product) =>
      (category === 'all' || String(product.categoriaId) === category)
      && [product.nombre, product.color, product.codigo].some((value) => normalize(value).includes(term)));
  }, [catalog, category, search]);
  const [year, month] = String(catalog?.config?.edicion || '').split('-');
  const edition = MONTHS[Number(month) - 1] ? `${MONTHS[Number(month) - 1]} ${year}` : '';

  return <>
    <Head><title>{unavailable ? 'Catálogo no disponible' : 'Catálogo de mobiliario'} | Altezza</title><meta name="robots" content="noindex, nofollow" /><meta name="description" content="Colección de mobiliario y menaje para eventos de Altezza." /></Head>
    {loading || unavailable ? <CatalogStatus unavailable={unavailable} /> : <main ref={header.pageRef} className={styles.page} style={{ '--catalog-first': catalog?.config?.colorPrimario, '--catalog-second': catalog?.config?.colorSecundario }}>
      <div ref={header.headerRef} className={styles.catalogHeader}>
      <div ref={header.measureRef} className={styles.bannerMeasure} aria-hidden="true" />
      <header className={styles.banner}>
        <img className={styles.bannerPhoto} src="/images/image_catalogo_banner.jpeg" alt="Montaje de mesa para eventos" />
        <div className={styles.bannerTitle}><h1 ref={header.titleRef}>MOBILIARIO</h1><p>CATÁLOGO{edition ? ` ${edition}` : ''}</p></div>
        <img ref={header.logoRef} className={styles.bannerLogo} src="/images/logo_altezza.png" alt="Altezza · Eventos inolvidables" />
      </header>
      <section ref={header.filtersRef} className={styles.filters} aria-label="Filtros del catálogo">
        <label className={styles.categoryFilter}><span className={styles.srOnly}>Categoría</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Todas las categorías</option>{catalog?.categories?.map((item) => <option value={String(item.id)} key={item.id}>{item.nombre}</option>)}</select></label>
        <label className={styles.search}><span className={styles.srOnly}>Buscar</span><div><FiSearch aria-hidden="true" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, color o código" /></div></label>
      </section>
      </div>
      <p className={styles.srOnly} role="status">{products.length} productos encontrados</p>
      <section className={styles.collection} aria-label="Mobiliario">
        {products.length ? products.map((product, index) => <ProductSpread product={product} index={index} key={product.publicCode} />) : <div className={styles.empty}><h2>{catalog?.products?.length ? 'No encontramos piezas con estos filtros.' : 'Pronto encontrarás nuestra colección aquí.'}</h2>{catalog?.products?.length > 0 && <button type="button" onClick={() => { setSearch(''); setCategory('all'); }}>Ver toda la colección</button>}</div>}
      </section>
      <footer className={styles.footer}>
        <img src="/images/logo_altezza_negro.png" alt="Altezza · Eventos inolvidables" />
        <p>© {new Intl.DateTimeFormat('es-CO', { year: 'numeric', timeZone: 'America/Bogota' }).format(new Date())} Altezza. Todos los derechos reservados.</p>
      </footer>
    </main>}
  </>;
}
