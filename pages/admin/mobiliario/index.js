import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArchive, FiBox, FiCamera, FiCopy, FiEdit2, FiExternalLink, FiGrid, FiLayers, FiLink, FiList, FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { TbArrowsSort } from 'react-icons/tb';
import ProductOrderModal from '@/components/admin/mobiliario/ProductOrderModal';
import { IoColorPaletteOutline } from 'react-icons/io5';
import PageShell from '@/components/ui/layout/PageShell';
import PageHeader from '@/components/ui/layout/PageHeader';
import Button from '@/components/ui/actions/Button';
import ActionMenu from '@/components/ui/actions/ActionMenu';
import shellStyles from '@/components/admin/shared/AdminModuleShell.module.scss';
import {
  CategoriesModal,
  MovementsModal,
  ProductModal,
} from '@/components/admin/mobiliario/MobiliarioModals';
import {
  generateMobiliarioCatalog,
  getMobiliarioCatalogConfig,
  getMobiliarioProduct,
  listMobiliarioCategories,
  listMobiliarioProducts,
  regenerateMobiliarioCatalog,
  setMobiliarioCatalogState,
  setMobiliarioProductState,
} from '@/components/initialized/data/mobiliarioApi';
import styles from './mobiliario.module.scss';
import CatalogStyleForm from '@/components/admin/mobiliario/CatalogStyleForm';

function StateBadge({ state }) {
  return <span className={`${styles.badge} ${styles[state] || ''}`}>{state}</span>;
}

function buildCatalogUrl(publicCode) {
  const path = `/catalogo-mobiliario/${encodeURIComponent(publicCode || '')}`;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, '')}${path}`;
  }
  const configuredOrigin = String(process.env.NEXT_PUBLIC_SITE_ORIGIN || '').trim().replace(/\/$/, '');
  return configuredOrigin ? `${configuredOrigin}${path}` : path;
}

export default function AdminMobiliarioPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ productos: 0, publicados: 0, disponibles: 0, fueraServicio: 0 });
  const [catalog, setCatalog] = useState(null);
  const [filters, setFilters] = useState({ search: '', categoryId: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menu, setMenu] = useState(null);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);
  const catalogUrl = catalog?.publicCode ? buildCatalogUrl(catalog.publicCode) : '';

  const load = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) setLoading(true); setError('');
    try {
      const [productResponse, categoryResponse, catalogResponse] = await Promise.all([
        listMobiliarioProducts(filters), listMobiliarioCategories(), getMobiliarioCatalogConfig(),
      ]);
      setProducts(productResponse.items || []); setSummary(productResponse.summary || {});
      setCategories(categoryResponse.items || []); setCatalog(catalogResponse.item || null);
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { const timer = setTimeout(() => load(), filters.search ? 250 : 0); return () => clearTimeout(timer); }, [load, filters.search]);

  async function openProductModal(type, row) {
    try { const response = await getMobiliarioProduct(row.id); setSelected(response.item); setModal(type); } catch (requestError) { toast.error(requestError.message); }
  }

  async function changeState(row, state) {
    try { await setMobiliarioProductState(row.id, state); toast.success(state === 'publicado' ? 'Producto publicado.' : 'Estado actualizado.'); await load({ quiet: true }); }
    catch (requestError) { toast.error(requestError.message); }
  }

  async function catalogAction(action) {
    try {
      if (action === 'generate') setCatalog((await generateMobiliarioCatalog()).item);
      if (action === 'toggle') setCatalog((await setMobiliarioCatalogState(!catalog.activo)).item);
      if (action === 'regenerate') {
        setCatalog((await regenerateMobiliarioCatalog()).item);
        setConfirmRegenerate(false);
      }
      toast.success('Catálogo público actualizado.');
    } catch (requestError) { toast.error(requestError.message); }
  }

  const metrics = useMemo(() => [
    { label: 'Productos', value: summary.productos || 0, icon: <FiBox /> },
    { label: 'Publicados', value: summary.publicados || 0, icon: <FiGrid /> },
    { label: 'Unidades disponibles', value: summary.disponibles || 0, icon: <FiLayers /> },
    { label: 'Fuera de servicio', value: summary.fueraServicio || 0, icon: <FiArchive /> },
  ], [summary]);

  function actionItems(row) {
    return [
      { id: 'edit', label: 'Editar ficha', icon: <FiEdit2 />, onClick: () => openProductModal('edit', row) },
      { id: 'movements', label: 'Movimientos', icon: <FiList />, onClick: () => openProductModal('movements', row) },
      { id: 'state', label: row.estado === 'publicado' ? 'Pasar a borrador' : 'Publicar', icon: <FiExternalLink />, onClick: () => changeState(row, row.estado === 'publicado' ? 'borrador' : 'publicado') },
      { id: 'archive', label: 'Archivar', icon: <FiArchive />, disabled: row.estado === 'archivado', onClick: () => changeState(row, 'archivado') },
    ];
  }

  const closeModal = () => { setModal(null); setSelected(null); };
  const refreshSelected = async () => { if (selected?.id) setSelected((await getMobiliarioProduct(selected.id)).item); await load({ quiet: true }); };
  const refreshCategories = async () => { const response = await listMobiliarioCategories(); setCategories(response.items || []); await load({ quiet: true }); };

  return <PageShell surface="admin" contentClassName={`${styles.page} ${shellStyles.page}`}>
    <section className={styles.hero}>
      <PageHeader title="Administración de mobiliario" description="Inventario propio de Altezza y contenido del catálogo público." />
      <Button fullWidth iconLeading={<FiPlus />} onClick={() => setModal('create')}>Nuevo producto</Button>
      <div className={styles.summary}>{metrics.map((metric) => <div key={metric.label}><span>{metric.icon}</span><strong>{metric.value}</strong><small>{metric.label}</small></div>)}</div>
    </section>

    <section className={styles.catalogCard}>
      <div><span className={styles.cardIcon}><FiLink /></span><div><h2>Catálogo público</h2><p>{catalog ? (catalog.activo ? 'La URL está activa y refleja los cambios publicados.' : 'La URL está desactivada temporalmente.') : 'Genera una única URL estable para todo el catálogo.'}</p></div></div>
      <div className={styles.catalogActions}>{!catalog ? <Button onClick={() => catalogAction('generate')}>Generar URL</Button> : <><Button variant="secondary" iconLeading={<FiCopy />} onClick={() => { navigator.clipboard.writeText(catalogUrl); toast.success('URL copiada.'); }}>Copiar URL</Button><Button variant="secondary" iconLeading={<IoColorPaletteOutline />} onClick={() => setModal('catalog-colors')}>Colores catálogo</Button><Button as="a" variant="secondary" href={catalogUrl} target="_blank" rel="noreferrer" iconLeading={<FiExternalLink />}>Ir al catálogo</Button><Button variant="secondary" onClick={() => catalogAction('toggle')}>{catalog.activo ? 'Desactivar' : 'Reactivar'}</Button><Button variant="ghost" iconLeading={<FiRefreshCw />} onClick={() => setConfirmRegenerate(true)}>Generar nueva URL</Button></>}</div>
      {confirmRegenerate ? <div className={styles.catalogConfirmation} role="alert"><strong>¿Estás seguro?</strong><span>Las URL anteriores dejarán de servir inmediatamente.</span><div><Button variant="ghost" onClick={() => setConfirmRegenerate(false)}>Cancelar</Button><Button onClick={() => catalogAction('regenerate')}>Sí, generar nueva URL</Button></div></div> : null}
    </section>

    <section className={styles.inventoryCard}>
      <div className={styles.sectionHeading}><div><h2>Inventario</h2><p>Administra la ficha visual, los tamaños y sus movimientos.</p></div><div className={styles.inventoryActions}><Button variant="secondary" iconLeading={<TbArrowsSort />} onClick={() => setModal('product-order')}>Ordenar productos</Button><Button variant="secondary" iconLeading={<TbArrowsSort />} onClick={() => setModal('categories')}>Categorías</Button></div></div>
      <div className={styles.filters}><label className={styles.search}><FiSearch /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Buscar nombre, color, código o medidas" /></label><select value={filters.categoryId} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}><option value="">Todas las categorías</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.nombre}</option>)}</select><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Todos los estados</option><option value="borrador">Borrador</option><option value="publicado">Publicado</option><option value="archivado">Archivado</option></select></div>
      {loading ? <div className={styles.empty}><strong>Cargando inventario…</strong><span>Estamos preparando los productos.</span></div> : error ? <div className={styles.empty}><strong>No fue posible cargar el inventario.</strong><span>{error}</span><Button variant="secondary" onClick={() => load()}>Reintentar</Button></div> : !products.length ? <div className={styles.empty}><strong>No hay productos para mostrar.</strong><span>Crea el primer producto o ajusta los filtros.</span></div> : <>
        <div className={styles.mobileList}>{products.map((row) => <article key={`card-${row.id}`} className={styles.productCard}>{row.imagenPrincipal ? <img src={row.imagenPrincipal.thumbUrl} alt={row.imagenPrincipal.altText} /> : <div className={styles.placeholder}><FiCamera /></div>}<div className={styles.productCardBody}><div className={styles.productTitle}><div><h3>{row.nombre}</h3><small>Ref. {row.codigo}</small><span>{row.categoriaNombre}</span></div><StateBadge state={row.estado} /></div><div className={styles.productStats}><span>{row.variantCount > 1 ? `${row.variantCount} tamaños` : row.variantCount === 1 ? 'Presentación única' : 'Sin inventario'}</span><span>{row.disponible} disponibles</span><span>{row.fueraServicio} fuera de servicio</span></div><ActionMenu contained open={menu === `mobile-${row.id}`} onToggle={() => setMenu(menu === `mobile-${row.id}` ? null : `mobile-${row.id}`)} onClose={() => setMenu(null)} items={actionItems(row)} /></div></article>)}</div>
        <div className={styles.tableWrap}><table><thead><tr><th>Producto</th><th>Categoría</th><th>Estado</th><th>Presentaciones</th><th>Disponible</th><th>Fuera de servicio</th><th>Acciones</th></tr></thead><tbody>{products.map((row) => <tr key={row.id}><td><div className={styles.productCell}>{row.imagenPrincipal ? <img src={row.imagenPrincipal.thumbUrl} alt="" /> : <span><FiCamera /></span>}<div><strong>{row.nombre}</strong><div>Ref. {row.codigo}</div></div></div></td><td>{row.categoriaNombre}</td><td><StateBadge state={row.estado} /></td><td>{row.variantCount > 1 ? `${row.variantCount} tamaños` : row.variantCount === 1 ? 'Única' : 'Pendiente'}</td><td>{row.disponible}</td><td>{row.fueraServicio}</td><td><ActionMenu open={menu === row.id} onToggle={() => setMenu(menu === row.id ? null : row.id)} onClose={() => setMenu(null)} items={actionItems(row)} /></td></tr>)}</tbody></table></div>
      </>}
    </section>

    {modal === 'product-order' ? <ProductOrderModal categories={categories} initialCategoryId={filters.categoryId} onClose={closeModal} onSaved={() => load({ quiet: true })} /> : null}
    {modal === 'catalog-colors' && catalog ? <CatalogStyleForm catalog={catalog} onClose={closeModal} onSaved={(updated) => { setCatalog(updated); closeModal(); }} /> : null}
    {modal === 'create' ? <ProductModal categories={categories} onClose={closeModal} onSaved={() => load({ quiet: true })} /> : null}
    {modal === 'edit' && selected ? <ProductModal product={selected} categories={categories} onClose={closeModal} onSaved={() => load({ quiet: true })} /> : null}
    {modal === 'categories' ? <CategoriesModal categories={categories} onClose={closeModal} onChanged={refreshCategories} /> : null}
    {modal === 'movements' && selected ? <MovementsModal product={selected} onClose={closeModal} onChanged={refreshSelected} /> : null}
  </PageShell>;
}
