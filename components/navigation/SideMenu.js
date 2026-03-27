import { useEffect, useMemo, useRef, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import useUsuarioStore from '@/components/initialized/stored/useUsuarioStore';
import { getMenuItemsByRole } from '@/components/navigation/menuItems';
import styles from './SideMenu.module.scss';

const SHAPE = {
  WIDTH: 65,
  MIN_PADDING_Y: 24,
  ITEM_SIZE: 32,
  GAP: 18,
  NOTCH_RADIUS: 27,
  SHOULDER_RADIUS: 10,
  ACTIVE_OFFSET: 10,
  RADIUS: 0, // sin bordes redondeados en el cuerpo
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildPath(height, cy, paddingY) {
  const { WIDTH: w, NOTCH_RADIUS: nr, SHOULDER_RADIUS: sr, RADIUS: r, ITEM_SIZE: sz } = SHAPE;
  const minY = paddingY + sz / 2;
  const maxY = height - (paddingY + sz / 2);
  const cY = clamp(cy, minY, maxY);
  const y1 = cY - nr;
  const y2 = cY + nr;

  return [
    `M0,0`,
    `L${w - r},0`,
    r > 0 ? `Q${w},0 ${w},${r}` : `L${w},0`,
    `L${w},${y1 - sr}`,
    `Q${w},${y1} ${w - sr},${y1}`,
    // notch as circular cut-out with soft shoulders
    `A ${nr} ${nr} 0 0 0 ${w - sr - nr},${cY}`,
    `A ${nr} ${nr} 0 0 0 ${w - sr},${y2}`,
    `Q${w},${y2} ${w},${y2 + sr}`,
    `L${w},${height - r}`,
    r > 0 ? `Q${w},${height} ${w - r},${height}` : `L${w - r},${height}`,
    `L${r},${height}`,
    r > 0 ? `Q0,${height} 0,${height - r}` : `L0,${height}`,
    `L0,${r}`,
    r > 0 ? `Q0,0 ${r},0` : `L0,0`,
    `Z`,
  ].join(' ');
}

function buildBarPath(height) {
  const { WIDTH: w, RADIUS: r } = SHAPE;
  return [
    `M0,0`,
    `L${w - r},0`,
    r > 0 ? `Q${w},0 ${w},${r}` : `L${w},0`,
    `L${w},${height - r}`,
    r > 0 ? `Q${w},${height} ${w - r},${height}` : `L${w - r},${height}`,
    `L${r},${height}`,
    r > 0 ? `Q0,${height} 0,${height - r}` : `L0,${height}`,
    `L0,${r}`,
    r > 0 ? `Q0,0 ${r},0` : `L0,0`,
    `Z`,
  ].join(' ');
}

function normalizePath(path = '') {
  return String(path || '').split('?')[0].split('#')[0];
}

function matchesPath(item, pathname, asPath) {
  if (!item) return false;
  const cleanPathname = normalizePath(pathname);
  const cleanAsPath = normalizePath(asPath);
  if (item.baseUrl) {
    return (
      cleanPathname === item.baseUrl ||
      cleanPathname.startsWith(item.baseUrl + '/') ||
      cleanAsPath === item.baseUrl ||
      cleanAsPath.startsWith(item.baseUrl + '/')
    );
  }
  if (item.url) {
    return (
      cleanPathname === item.url ||
      cleanPathname.startsWith(item.url) ||
      cleanAsPath === item.url ||
      cleanAsPath.startsWith(item.url)
    );
  }
  return false;
}

export default function SideMenu({ onSelect }) {
  const router = useRouter();
  const rol = useUsuarioStore((state) => state.dataUsuario?.rol);
  const items = useMemo(() => getMenuItemsByRole(rol), [rol]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [notchY, setNotchY] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const itemSize = SHAPE.ITEM_SIZE;
  const gap = SHAPE.GAP;

  const paddingY = useMemo(() => {
    if (!menuHeight) return SHAPE.MIN_PADDING_Y;
    const totalItems = items.length * itemSize + Math.max(0, items.length - 1) * gap;
    const free = Math.max(menuHeight - totalItems, 0);
    return Math.max(SHAPE.MIN_PADDING_Y, free / 2);
  }, [menuHeight, items.length, itemSize, gap]);

  const targetY =
    selectedIndex < 0 ? 0 : paddingY + selectedIndex * (itemSize + gap) + itemSize / 2;

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      setMenuHeight(containerRef.current.offsetHeight || 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = typeof window !== 'undefined' ? window.innerWidth <= 450 : false;
      setIsMobile(mobile);
      if (!mobile) setOpenMobile(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedIndex < 0) return;
    cancelAnimationFrame(animRef.current);
    const animate = () => {
      setNotchY((prev) => {
        const diff = targetY - prev;
        const next = Math.abs(diff) < 0.5 ? targetY : prev + diff * 0.18;
        return next;
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [targetY, selectedIndex]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      onSelect?.(items[selectedIndex]);
    }
  }, [selectedIndex, items, onSelect]);

  useEffect(() => {
    if (!items.length) return;
    const idx = items.findIndex((item) => matchesPath(item, router.pathname, router.asPath));
    const nextIndex = idx >= 0 ? idx : -1;
    if (nextIndex !== selectedIndex) {
      setSelectedIndex(nextIndex);
    }
  }, [router.asPath, router.pathname, items, selectedIndex]);

  return (
    <>
      {isMobile && (
        <button
          className={styles.mobileToggle}
          aria-label={openMobile ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpenMobile((prev) => !prev)}
        >
          {openMobile ? <FiX /> : <FiMenu />}
        </button>
      )}
      {isMobile && openMobile && <div className={styles.backdrop} onClick={() => setOpenMobile(false)} />}
      <aside
        className={`${styles.menu} ${isMobile ? styles.mobile : ''} ${openMobile ? styles.open : ''}`}
        ref={containerRef}
        aria-label="Menú principal"
      >
        <svg className={styles.shell} width={SHAPE.WIDTH} height="100%" viewBox={`0 0 ${SHAPE.WIDTH} ${menuHeight || 100}`} preserveAspectRatio="none">
          <path
            d={
              selectedIndex < 0
                ? buildBarPath(menuHeight || 100)
                : buildPath(menuHeight || 100, notchY || paddingY, paddingY)
            }
            className={styles.path}
          />
        </svg>
        <div className={styles.items}>
          {items.map((item, idx) => {
            const isActive = selectedIndex >= 0 && idx === selectedIndex;
            return (
              <button
              key={item.id || idx}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => {
                setSelectedIndex(idx);
                onSelect?.(item);
                const targetUrl = item.url || '/';
                router.push(targetUrl);
                if (isMobile) setOpenMobile(false);
              }}
              aria-label={item.id}
              data-label={item.label}
            >
              <span className={styles.icon}>{item.icon}</span>
            </button>
          );
        })}
        </div>
      </aside>
    </>
  );
}
