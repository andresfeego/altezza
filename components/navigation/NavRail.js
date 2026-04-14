import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './NavRail.module.scss';

const SHAPE = {
  WIDTH: 65,
  MIN_PADDING_Y: 24,
  ITEM_SIZE: 32,
  GAP: 18,
  NOTCH_RADIUS: 27,
  SHOULDER_RADIUS: 10,
  RADIUS: 0,
};

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function normalizePath(path = '') {
  return String(path || '').split('?')[0].split('#')[0];
}

function buildPath(height, cy, paddingY) {
  const { WIDTH: w, NOTCH_RADIUS: nr, SHOULDER_RADIUS: sr, RADIUS: r, ITEM_SIZE: sz } = SHAPE;
  const minY = paddingY + sz / 2;
  const maxY = height - (paddingY + sz / 2);
  const cY = clamp(cy, minY, maxY);
  const y1 = cY - nr;
  const y2 = cY + nr;

  return [
    'M0,0',
    `L${w - r},0`,
    r > 0 ? `Q${w},0 ${w},${r}` : `L${w},0`,
    `L${w},${y1 - sr}`,
    `Q${w},${y1} ${w - sr},${y1}`,
    `A ${nr} ${nr} 0 0 0 ${w - sr - nr},${cY}`,
    `A ${nr} ${nr} 0 0 0 ${w - sr},${y2}`,
    `Q${w},${y2} ${w},${y2 + sr}`,
    `L${w},${height - r}`,
    r > 0 ? `Q${w},${height} ${w - r},${height}` : `L${w - r},${height}`,
    `L${r},${height}`,
    r > 0 ? `Q0,${height} 0,${height - r}` : `L0,${height}`,
    `L0,${r}`,
    r > 0 ? `Q0,0 ${r},0` : 'L0,0',
    'Z',
  ].join(' ');
}

function buildBarPath(height) {
  const { WIDTH: w, RADIUS: r } = SHAPE;
  return [
    'M0,0',
    `L${w - r},0`,
    r > 0 ? `Q${w},0 ${w},${r}` : `L${w},0`,
    `L${w},${height - r}`,
    r > 0 ? `Q${w},${height} ${w - r},${height}` : `L${w - r},${height}`,
    `L${r},${height}`,
    r > 0 ? `Q0,${height} 0,${height - r}` : `L0,${height}`,
    `L0,${r}`,
    r > 0 ? `Q0,0 ${r},0` : 'L0,0',
    'Z',
  ].join(' ');
}

function matchesItem(item, pathname, asPath) {
  const itemHref = item?.href || item?.url;
  if (!itemHref) return false;

  const cleanPathname = normalizePath(pathname);
  const cleanAsPath = normalizePath(asPath);
  const candidates = Array.isArray(item.activeMatch) ? item.activeMatch : [itemHref];

  return candidates.some((candidate) => {
    const cleanCandidate = normalizePath(candidate);
    return (
      cleanPathname === cleanCandidate ||
      cleanPathname.startsWith(`${cleanCandidate}/`) ||
      cleanAsPath === cleanCandidate ||
      cleanAsPath.startsWith(`${cleanCandidate}/`)
    );
  });
}

export default function NavRail({
  items = [],
  ariaLabel = 'Navegacion',
  tone = 'context',
  className = '',
}) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [notchY, setNotchY] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);
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
    if (selectedIndex < 0) return;
    cancelAnimationFrame(animRef.current);

    const animate = () => {
      setNotchY((prev) => {
        const diff = targetY - prev;
        return Math.abs(diff) < 0.5 ? targetY : prev + diff * 0.18;
      });
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [selectedIndex, targetY]);

  useEffect(() => {
    if (!items.length) return;
    const idx = items.findIndex((item) => matchesItem(item, router.pathname, router.asPath));
    setSelectedIndex(idx >= 0 ? idx : -1);
  }, [items, router.asPath, router.pathname]);

  return (
    <aside
      ref={containerRef}
      className={joinClasses(styles.menu, tone === 'primary' ? styles.primary : styles.context, className)}
      aria-label={ariaLabel}
    >
      <svg
        className={styles.shell}
        width={SHAPE.WIDTH}
        height="100%"
        viewBox={`0 0 ${SHAPE.WIDTH} ${menuHeight || 100}`}
        preserveAspectRatio="none"
      >
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
              type="button"
              className={joinClasses(styles.item, isActive ? styles.active : '', item.group === 'admin' ? styles.adminItem : '')}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              data-label={item.label}
              onClick={() => {
                const targetHref = item.href || item.url;
                if (!targetHref || normalizePath(router.asPath) === normalizePath(targetHref)) return;
                setSelectedIndex(idx);
                router.push(targetHref);
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
