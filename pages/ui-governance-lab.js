import { useMemo, useState } from 'react';
import { FiBell, FiCopy, FiEdit2, FiGrid, FiPlus, FiSend } from 'react-icons/fi';
import toast, { showError, showInfo, showSuccess } from '@/components/initialized/Toast';
import {
  GovernanceActionMenu,
  GovernanceBadge,
  GovernanceButton,
  GovernanceField,
} from '@/components/ui/governance/GovernancePrimitives';
import styles from './ui-governance-lab.module.scss';

const TOKENS = [
  { label: 'Brand Rose', token: '--ag-brand-rose', color: 'var(--ag-brand-rose)' },
  { label: 'Brand Wine', token: '--ag-brand-wine', color: 'var(--ag-brand-wine)' },
  { label: 'Surface Soft', token: '--ag-surface-soft', color: 'var(--ag-surface-soft)' },
  { label: 'Success', token: '--ag-success', color: 'var(--ag-success)' },
  { label: 'Warning', token: '--ag-warning', color: 'var(--ag-warning)' },
  { label: 'Danger', token: '--ag-danger', color: 'var(--ag-danger)' },
];

const TABLE_ROWS = [
  { id: 'ALT-201', nombre: 'Daniela y Sergio', estado: 'Activo', modulo: 'Cliente Home', alerta: '2 pendientes' },
  { id: 'ALT-198', nombre: 'Laura Mejia', estado: 'Pendiente', modulo: 'Admin Dashboard', alerta: 'Cotizacion nueva' },
  { id: 'ALT-194', nombre: 'Evento Roldan', estado: 'Inactivo', modulo: 'Organizador Home', alerta: 'Sin novedades' },
];

const FONT_SHOWCASE = [
  { name: 'Avenir Next', family: '"Avenir Next", "Helvetica Neue", sans-serif' },
  { name: 'Helvetica Neue', family: '"Helvetica Neue", Arial, sans-serif' },
  { name: 'Segoe UI', family: '"Segoe UI", sans-serif' },
  { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif' },
  { name: 'Gill Sans', family: '"Gill Sans", "Gill Sans MT", sans-serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Palatino', family: '"Palatino Linotype", "Book Antiqua", serif' },
  { name: 'Iowan Old Style', family: '"Iowan Old Style", Georgia, serif' },
  { name: 'Times New Roman', family: '"Times New Roman", serif' },
  { name: 'Verdana', family: 'Verdana, sans-serif' },
];

function ActionToast() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, minWidth: 300, alignItems: 'center' }}>
      <div style={{ display: 'grid', gap: 4 }}>
        <strong style={{ color: 'var(--ag-text-strong)' }}>Clave temporal lista</strong>
        <span style={{ color: 'var(--ag-text-muted)', fontSize: '.9rem' }}>Pulsa copiar para llevarla al portapapeles.</span>
      </div>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText('7lpmrss7');
          toast.dismiss();
          showSuccess('Clave temporal copiada.');
        }}
        style={{
          minHeight: 46,
          padding: '0 14px',
          border: 0,
          borderLeft: '1px solid var(--ag-border-soft)',
          background: 'transparent',
          color: 'var(--ag-brand-wine)',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Copiar
      </button>
    </div>
  );
}

export default function UiGovernanceLabPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailError = useMemo(() => {
    if (!submitted) return '';
    if (!email.trim()) return 'Este campo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ingresa un correo valido.';
    return '';
  }, [email, submitted]);

  const nombreError = useMemo(() => {
    if (!submitted) return '';
    if (!nombre.trim()) return 'Escribe el nombre completo.';
    return '';
  }, [nombre, submitted]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!email.trim() || !nombre.trim() || emailError) {
      showError('Datos incorrectos. Revisa los campos marcados.');
      return;
    }

    showSuccess('Formulario de referencia enviado correctamente.');
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Altezza UI Governance</span>
          <h1>Laboratorio visual de referencia</h1>
          <p>
            Esta URL existe para revisar la base visual del proyecto antes de aplicarla a modulos reales. Aqui se
            validan tokens, componentes, estados UX, tablas, formularios, toasts y patrones de accion.
          </p>
          <div className={styles.heroNotes}>
            <strong>Que deberias revisar aqui</strong>
            <span>Coherencia visual, legibilidad, densidad, jerarquia, respuesta movil y claridad de acciones.</span>
          </div>
        </section>

        <section className={styles.layout}>
          <article className={styles.card}>
            <div className={styles.topBar}>
              <div>
                <h2 className={styles.sectionTitle}>Superficies iniciales</h2>
                <p className={styles.sectionCopy}>Convencion del producto: Dashboard solo para Admin. Home para Cliente, Organizador y Colaborador.</p>
              </div>
              <button type="button" className={styles.actionsButton}>
                <FiGrid size={16} />
                Boton de acciones de pantalla
              </button>
            </div>

            <div className={styles.surfaceStrip}>
              <div className={styles.surfaceCard}>
                <h4>Admin Dashboard</h4>
                <p>Vista operativa con KPI, alertas y accesos rapidos.</p>
              </div>
              <div className={styles.surfaceCard}>
                <h4>Cliente Home</h4>
                <p>Cards resumen por modulo con tono mas emocional y util.</p>
              </div>
              <div className={styles.surfaceCard}>
                <h4>Organizador Home / Colaborador Home</h4>
                <p>Superficies de trabajo orientadas a tareas, estados y modulos asignados.</p>
              </div>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Tokens de color</h2>
            <p className={styles.sectionCopy}>Todos los componentes nuevos deben usar tokens semanticos y no hexadecimales sueltos.</p>
            <div className={styles.grid3}>
              {TOKENS.map((item) => (
                <div className={styles.tokenCard} key={item.token}>
                  <div className={styles.tokenSwatch} style={{ background: item.color }} />
                  <div className={styles.tokenMeta}>
                    <strong>{item.label}</strong>
                    <code>{item.token}</code>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Botones y badges</h2>
            <div className={styles.buttons}>
              <GovernanceButton variant="primary"><FiPlus size={16} />Primario</GovernanceButton>
              <GovernanceButton variant="secondary"><FiEdit2 size={16} />Secundario</GovernanceButton>
              <GovernanceButton variant="ghost"><FiBell size={16} />Ghost</GovernanceButton>
              <GovernanceButton variant="danger">Eliminar</GovernanceButton>
            </div>
            <div className={styles.inlineStack}>
              <GovernanceBadge tone="success">Activo</GovernanceBadge>
              <GovernanceBadge tone="warning">Pendiente</GovernanceBadge>
              <GovernanceBadge tone="danger">Error</GovernanceBadge>
              <GovernanceBadge tone="info">Informativo</GovernanceBadge>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Formulario de referencia</h2>
            <p className={styles.sectionCopy}>Regla actual: toast para el resultado general e inline para el error especifico del campo.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.grid2}>
                <GovernanceField
                  label="Nombre del contacto"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  error={nombreError}
                  hint={!nombreError ? 'Nota: deja vacio y pulsa enviar para revisar el error inline.' : ''}
                />
                <GovernanceField
                  label="Correo"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={emailError}
                  hint={!emailError ? 'Nota: prueba un correo invalido y luego pulsa enviar.' : ''}
                />
              </div>
              <GovernanceField
                as="textarea"
                label="Mensaje"
                value={mensaje}
                onChange={(event) => setMensaje(event.target.value)}
                hint="Nota: este campo no valida aun. La autovalidacion de campos queda pendiente para la siguiente iteracion."
              />
              <div className={styles.inlineStack}>
                <GovernanceButton type="submit"><FiSend size={16} />Enviar demo</GovernanceButton>
                <GovernanceButton type="button" variant="secondary" onClick={() => {
                  setSubmitted(false);
                  setNombre('');
                  setEmail('');
                  setMensaje('');
                }}>
                  Limpiar
                </GovernanceButton>
              </div>
            </form>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Tabla admin refinada</h2>
            <p className={styles.sectionCopy}>La tabla sigue siendo clasica, con acciones visibles y menu de tres puntos disponible cuando haga falta densidad adicional.</p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Superficie</th>
                    <th>Alerta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.nombre}</td>
                      <td>
                        <GovernanceBadge tone={row.estado === 'Activo' ? 'success' : row.estado === 'Pendiente' ? 'warning' : 'danger'}>
                          {row.estado}
                        </GovernanceBadge>
                      </td>
                      <td>{row.modulo}</td>
                      <td>{row.alerta}</td>
                      <td>
                        <div className={styles.tableActions}>
                          <GovernanceButton type="button" variant="secondary">Editar</GovernanceButton>
                          <GovernanceActionMenu
                            items={[
                              { label: 'Copiar enlace', onClick: () => showInfo(`Accion demo en ${row.id}`) },
                              { label: 'Regenerar clave', onClick: () => showSuccess(`Clave temporal regenerada en demo para ${row.id}`) },
                              { label: 'Desactivar', onClick: () => showError(`Accion de desactivar demo para ${row.id}`) },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Muestrario de fuentes</h2>
            <p className={styles.sectionCopy}>
              Usa esta seccion para comparar tipografias con el mismo texto y decidir la direccion visual antes de tocar modulos reales.
            </p>
            <div className={styles.fontsGrid}>
              {FONT_SHOWCASE.map((font) => (
                <div key={font.name} className={styles.fontCard}>
                  <h3 data-font-showcase-name>{font.name}</h3>
                  <span className={styles.fontName} data-font-showcase-meta>{font.family}</span>
                  <p className={styles.fontExample} data-font-showcase-sample={font.name}>
                    Altezza organiza experiencias con una interfaz clara, elegante y moderna para dashboards, homes y modulos.
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Toasts de referencia</h2>
            <div className={styles.buttons}>
              <GovernanceButton type="button" onClick={() => showSuccess('Toast de exito: accion completada correctamente.')}>Exito</GovernanceButton>
              <GovernanceButton type="button" variant="secondary" onClick={() => showInfo('Toast informativo: revisa el siguiente paso del flujo.')}>Info</GovernanceButton>
              <GovernanceButton type="button" variant="danger" onClick={() => showError('Toast de error: no fue posible guardar la accion.')}>Error</GovernanceButton>
              <GovernanceButton
                type="button"
                variant="ghost"
                onClick={() => toast(() => <ActionToast />, { duration: 7000 })}
              >
                <FiCopy size={16} />
                Toast con accion
              </GovernanceButton>
            </div>
          </article>

          <article className={styles.card}>
            <h2 className={styles.sectionTitle}>Notas de prueba</h2>
            <div className={styles.notesList}>
              <div className={styles.note}>
                <strong>Formulario</strong>
                Llena el correo con un valor invalido y pulsa `Enviar demo` para ver el patron `toast + inline`.
              </div>
              <div className={styles.note}>
                <strong>Tabla</strong>
                Prueba el menu de tres puntos y revisa si las acciones se sienten claras sin romper limpieza visual.
              </div>
              <div className={styles.note}>
                <strong>Responsive</strong>
                Reduce la pantalla a movil y confirma que las secciones se apilan con buen aire y lectura.
              </div>
              <div className={styles.note}>
                <strong>Jerarquia</strong>
                Evalua si la pagina se siente premium, sobria y calida sin recargarse.
              </div>
            </div>
          </article>
        </section>
        <style jsx>{`
          [data-font-showcase-name],
          [data-font-showcase-meta] {
            font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif !important;
          }
        `}</style>
        <style jsx global>{`
          [data-font-showcase-sample="Avenir Next"] {
            font-family: "Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif !important;
          }

          [data-font-showcase-sample="Helvetica Neue"] {
            font-family: "Helvetica Neue", Arial, sans-serif !important;
          }

          [data-font-showcase-sample="Segoe UI"] {
            font-family: "Segoe UI", sans-serif !important;
          }

          [data-font-showcase-sample="Trebuchet MS"] {
            font-family: "Trebuchet MS", sans-serif !important;
          }

          [data-font-showcase-sample="Gill Sans"] {
            font-family: "Gill Sans", "Gill Sans MT", sans-serif !important;
          }

          [data-font-showcase-sample="Georgia"] {
            font-family: Georgia, serif !important;
          }

          [data-font-showcase-sample="Palatino"] {
            font-family: "Palatino Linotype", "Book Antiqua", serif !important;
          }

          [data-font-showcase-sample="Iowan Old Style"] {
            font-family: "Iowan Old Style", Georgia, serif !important;
          }

          [data-font-showcase-sample="Times New Roman"] {
            font-family: "Times New Roman", serif !important;
          }

          [data-font-showcase-sample="Verdana"] {
            font-family: Verdana, sans-serif !important;
          }
        `}</style>
      </div>
    </main>
  );
}
