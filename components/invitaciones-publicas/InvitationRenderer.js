import { buildResolvedModules } from './registry/moduleDataResolvers';
import { normalizeTemplateKey } from './registry/templateKey';
import { resolveTemplateComponent } from './registry/templateRegistry';

export default function InvitationRenderer({
  evento,
  invitacion,
  invitadoActual,
  listaInvitados,
  modules,
  attendanceState,
}) {
  const templateKey = normalizeTemplateKey(evento?.templateKey);
  const payload = {
    evento,
    invitacion,
    invitadoActual,
    listaInvitados,
  };

  const resolvedModules = buildResolvedModules(modules, payload, templateKey);
  const TemplateComponent = resolveTemplateComponent(templateKey);

  return (
    <TemplateComponent
      evento={evento}
      invitacion={invitacion}
      invitadoActual={invitadoActual}
      resolvedModules={resolvedModules}
      attendanceState={attendanceState}
    />
  );
}
