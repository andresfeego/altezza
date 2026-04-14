import PageHeader from '@/components/ui/layout/PageHeader';
import styles from './EventClientModuleShell.module.scss';

function joinClasses(...values) {
  return values.filter(Boolean).join(' ');
}

export default function EventClientModuleShell({
  eyebrow = 'Modulo cliente',
  title,
  description,
  actions,
  children,
  className = '',
}) {
  return (
    <section className={joinClasses(styles.shell, className)}>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        align="right"
      />
      {children}
    </section>
  );
}
