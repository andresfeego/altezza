# Regla visual de Lemoncello

Esta regla recoge la instrucción explícita del usuario para todas las imágenes
nuevas o editadas de esta tarjeta. Aplica solamente a `wedding-lemoncello`.

## Referencias obligatorias

Antes de generar o editar una ilustración, inspeccionar y adjuntar al generador:

1. `assets/references/watercolor-style-master.jpg`: referencia principal original
   del usuario (botella y limones). Define técnica pictórica y gama cromática.
2. `assets/images/landscape-proportioned.png`: escena aprobada. Define cómo debe
   integrarse visualmente el recurso en la tarjeta existente.

Las referencias adicionales definen únicamente forma, composición, objeto o
identidad. No deben sustituir estas referencias de estilo. Una generación reciente
no se convierte automáticamente en referencia maestra. La antigua canastilla
`vespa-basket.png` fue rechazada por su estilo: puede guiar formas, nunca acabado.

## Técnica y paleta

- Acuarela tradicional suave: veladuras translúcidas, pigmento y papel visibles
  dentro de la pintura, bordes orgánicos, pinceladas sueltas y luces de papel.
- Color diluido y luminoso: azul cielo/pastel, amarillo mantequilla, crema/marfil;
  azul marino como acento moderado. Vegetación oliva/salvia desaturada y mimbre
  en ocre/paja claro. Las flores pueden usar azul muy pálido con un toque de lavanda.
- Contraste moderado; evitar contornos negros o marrones marcados, trama de mimbre
  hiperdefinida, colores estridentes, naranja intenso y violeta saturado.
- No introducir aspecto vectorial, caricatura con contornos, sticker digital,
  render 3D, acabado fotográfico, plástico brillante ni interfaces de aplicación.
- Suavidad no significa desenfoque: conservar formas legibles y textura de pincel.

## Generación e integración

- En cada prompt, nombrar el rol de cada referencia y repetir estas restricciones.
  Guardar prompt y procedencia en `assets/prompts.json`.
- Verificar estilo a tamaño original Y dentro de la escena móvil antes de darlo
  por terminado. Si no coincide, corregir el recurso; no cambiar la escena aprobada
  para acomodar un estilo nuevo.
- Conservar proporciones naturales. Escalar uniformemente, con altura automática;
  nunca estirar un eje para llenar un contenedor.
- Sprites con alfa real. Mantener capas independientes para animación y conservar
  los originales. Usar nombres versionados para sustituciones.
- Dirección actual: todas las transiciones entre escenas son horizontales.
  El usuario retiró la exigencia de bordes exteriores difuminados. Los paisajes
  pueden llenar un rectángulo, pero deben conectar visualmente mediante costa,
  cielo, vegetación y suelo continuos; no mostrar un corte entre módulos.
  Los objetos animados independientes siguen necesitando transparencia real.
- En elementos abiertos (balcones, barandas, follaje), los huecos deben conservar
  alfa efectivo y mostrar las capas posteriores. Reservar capas independientes
  para paisaje, primer plano y futuras animaciones.
- La Vespa aprobada permanece intacta. Sus añadidos se superponen como capas;
  no se redibuja ni se altera su color, tamaño o geometría al cambiar la canastilla.
- Label, fecha y demás contenido variable vienen del contrato compartido de la
  tarjeta. No hornear esos datos en las ilustraciones.

Esta regla permanece vigente para futuras iteraciones salvo cambio explícito
de dirección visual solicitado por el usuario.
