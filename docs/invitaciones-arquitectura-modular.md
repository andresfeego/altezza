# Arquitectura modular de invitaciones (estado y plan)

## Contexto
El sistema de invitaciones debe soportar:
- muchos modulos reutilizables (musica, hero, biblica, dresscode, asistencia, sliders, etc.)
- muchos templates (objetivo: ~200)
- composicion dinamica por tarjeta (activar/desactivar/ordenar modulos)
- cambio de template con los mismos modulos, manteniendo contratos de datos

## Decisiones ya implementadas
1. Renderer con registro de templates y resolvers por modulo:
- `components/invitaciones-publicas/registry/templateRegistry.js`
- `components/invitaciones-publicas/registry/moduleDataResolvers.js`

2. Separacion por template en modulos sensibles a visual/assets:
- `envelop_intro`
- `hero_image_1`
- `hero_image_2`

3. Eliminacion de vistas compartidas con acoplamiento de assets cruzados.

## Regla de oro
- Ningun `module-view` compartido debe importar assets de un template especifico.
- Si un modulo depende de assets/estructura visual propios, debe tener:
  - resolver de data por template
  - view por template

## Estado actual
- `wedding_classic` y `wedding_terracota` ya usan separacion por template en `envelop` y `hero`.
- El sistema ya enruta por `templateKey` para resolver data y template component.

## Pendientes para completar migracion (recomendado)
1. Migrar `dresscode` a separacion total por template (resolver + view), aunque ya usa asset por template.
2. Revisar todos los modulos con riesgo de acoplamiento visual para aislarlos:
- `event_details`
- `countdown_image`
- `gift_envelopes`
- `attendance_confirm` (si evoluciona visual por template)

3. Definir contrato formal por modulo (schema versionado):
- campos requeridos
- campos opcionales
- defaults
- validacion de config antes de render

4. Implementar fallback explicito por template/modulo:
- si un template no implementa un modulo, ocultarlo o usar placeholder controlado

5. Agregar pruebas de regresion visual por template:
- snapshots por modulo clave
- smoke de render por combinaciones comunes

## Convencion recomendada para escalar
- Data resolvers:
  - `modules/<Modulo><Template>Module.js` para casos template-specific
  - `modules/<Modulo>Module.js` para casos agnosticos
- Views:
  - `module-views/<Modulo><Template>View.js` para casos template-specific
  - `module-views/<Modulo>View.js` para casos agnosticos
- Registro:
  - toda resolucion centralizada en `registry/moduleDataResolvers.js`
  - toda resolucion de template en `registry/templateRegistry.js`

## Nota operativa
Antes de cambios grandes:
1. crear commit de checkpoint
2. aplicar migracion modulo por modulo
3. validar en classic y terracota
4. dejar trazabilidad en este documento
