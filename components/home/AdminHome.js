import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';
import styles from './AdminHome.module.scss';

export default function AdminHome() {
  return <div className={styles.content}><AdminDashboard /></div>;
}
