import styles from "./MenuItem.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import useUsuarioStore from "@/components/initialized/stored/useUsuarioStore";
import Tooltip from '@mui/material/Tooltip';

export default function MenuItem({
  icon,
  label,
  badge,
  className,
  onClick,
  ruta,
  permiso,
  tooltip,
  collapsed = false
}) {
  const router = useRouter();
  const permisos = useUsuarioStore((state) => state.uiPermisos || []);

  // Validar permisos
  if (permiso && !permisos.includes(permiso)) return null;

  // Detectar si está activo
  const isActive = ruta && router.asPath.startsWith(ruta);

  const content = (
    <div
      className={`
        ${styles.menuItem}
        ${className || ""}
        ${collapsed ? styles.collapsed : ""}
        ${isActive ? styles.active : ""}
      `}
      onClick={onClick}
    >
      <div className={styles.menuIconLabel}>
        {icon}
        {!collapsed && <span className={styles.label}>{label}</span>}
      </div>
      {badge && !collapsed && <span className={styles.badge}>{badge}</span>}
    </div>
  );

  const wrapped = collapsed ? (
    <Tooltip title={tooltip || label} arrow>{content}</Tooltip>
  ) : content;

  return ruta ? <Link href={ruta}>{wrapped}</Link> : wrapped;
}
