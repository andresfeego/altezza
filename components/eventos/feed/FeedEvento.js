import BarraEvento from './BarraEvento';
import ResumenDatosEvento from '@/components/eventos/modulos/datos_evento/ResumenDatosEvento';
import FeedInvitadosPreview from '@/components/eventos/feed/FeedInvitadosPreview';
import FeedInvitacionesPreview from '@/components/eventos/feed/FeedInvitacionesPreview';
import FeedModulePreview from '@/components/eventos/feed/FeedModulePreview';
import LoadingScreen from '@/components/ui/LoadingScreen';
import useEventoStore from '@/components/initialized/stored/useEventoStore';
import {
  getEnabledClientModules,
  resolveClientModuleUrl,
} from '@/components/constants/clientModules';
import styles from './feedEvento.module.scss';

export default function FeedEvento({ evento }) {
  const idEventoActivo = useEventoStore((state) => state.idEventoActivo);
  const modulosCliente = useEventoStore((state) => state.modulosCliente);

  if (!evento || !evento.idEvento) {
    return <LoadingScreen mensaje="Cargando evento..." />;
  }

  const eventId = idEventoActivo || evento.idEvento;
  const enabledModules = getEnabledClientModules(modulosCliente).filter((moduleDef) => moduleDef.key !== 'feed');
  const hasDatosEvento = enabledModules.some((moduleDef) => moduleDef.key === 'datos_evento');
  const previewModules = enabledModules.filter((moduleDef) => moduleDef.key !== 'datos_evento');

  const summaryCopyByModule = {
    invitados: 'Gestiona la base principal de invitados y entra al detalle para continuar su configuracion.',
    invitaciones: 'Accede al espacio de invitaciones cuando este modulo forme parte de la experiencia del evento.',
    acomodacion: 'Revisa la entrada del modulo de acomodacion y continua su configuracion cuando el evento lo requiera.',
    pendientes: 'Consulta el modulo de pendientes para construir el seguimiento operativo del evento.',
    timming: 'El cronograma del evento aparecera aqui cuando el modulo este habilitado.',
    wedding_day: 'La vista del gran dia se activa segun la configuracion del evento y su fase operativa.',
    inspiracion: 'Accede a las referencias visuales del evento y continua explorando el modulo completo.',
    fotos_compartidas: 'Consulta la galeria compartida del evento cuando este modulo haga parte de la experiencia activa.',
    paletas_colores: 'Explora la direccion cromatica del evento desde el modulo correspondiente.',
    pastel: 'Entra al modulo de pastel para revisar decisiones y referencias del evento.',
    calculador_trago: 'Abre el calculador para revisar cantidades segun la experiencia activa del evento.',
    tips_boda: 'Accede a los contenidos editoriales cuando este modulo este habilitado para el evento.',
  };

  return (
    <div className={styles.contenedorFeed}>
      <BarraEvento
        tipo={evento.nombreTipoEvento}
        nombre={evento.nombreEvento}
      />

      <div className={styles.gridModulos}>
        {hasDatosEvento ? <ResumenDatosEvento evento={evento} /> : null}

        {previewModules.map((moduleDef) => (
          moduleDef.key === 'invitados' ? (
            <FeedInvitadosPreview
              key={moduleDef.key}
              eventId={eventId}
              href={resolveClientModuleUrl(moduleDef, eventId)}
            />
          ) : moduleDef.key === 'invitaciones' ? (
            <FeedInvitacionesPreview
              key={moduleDef.key}
              eventId={eventId}
              href={resolveClientModuleUrl(moduleDef, eventId)}
            />
          ) : (
            <FeedModulePreview
              key={moduleDef.key}
              title={moduleDef.label}
              description={summaryCopyByModule[moduleDef.key] || `Accede al modulo ${moduleDef.label} desde la experiencia de este evento.`}
              href={resolveClientModuleUrl(moduleDef, eventId)}
            />
          )
        ))}
      </div>
    </div>
  );
}
