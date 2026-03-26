# Cuestionario UI Governance — Altezza

> Objetivo: definir reglas visuales y de UX consistentes para construir la skill `altezza-ui-governance`, los tokens de diseño y los componentes reutilizables del proyecto.

## Cómo responder

- En cada punto elige una opción o escribe una combinación.
- Si ninguna opción te convence, escribe tu propia regla en `Respuesta`.
- Si tienes referencias visuales, puedes agregarlas al final.
- Cuando este archivo quede respondido, la siguiente etapa será:
  - crear la skill
  - definir tokens globales
  - proponer componentes base reutilizables
  - aplicar esa base primero en `Login` y `Admin Usuarios`

---

## Nota inicial: cuando creemos la skill vamos a generar una url para mostrar como quedarian los diferentes componentes e ir puliendo la ui governance 

## 1. Dirección visual general

### 1.1 Personalidad de marca

- Opción A: editorial elegante
  Explicación: se apoya en aire, composición limpia, tipografía con carácter, sensación premium y ritmo visual sobrio.
- Opción B: lujo moderno
  Explicación: combina limpieza digital con detalles refinados, contraste controlado y componentes más pulidos tipo producto premium.
- Opción C: cálido artesanal
  Explicación: se siente cercano, humano y sofisticado, con texturas suaves, tonos naturales y menos rigidez visual.
- Opción D: operativo premium
  Explicación: prioriza claridad funcional de plataforma, pero sin verse genérico; ideal para dashboards y flujos administrativos.

Respuesta:
B 

### 1.2 Nivel de expresividad visual

- Opción A: sobrio
  Explicación: interfaz muy contenida, poco adorno, foco en legibilidad y claridad.
- Opción B: equilibrado
  Explicación: mezcla orden funcional con detalles visuales distintivos.
- Opción C: alto carácter
  Explicación: identidad fuerte, más contraste, tipografía protagonista y componentes con más personalidad.

Respuesta:
A
---

## 2. Tipografía

### 2.1 Estilo tipográfico principal

- Opción A: sans elegante
  Explicación: limpia, contemporánea y muy usable para producto.
- Opción B: serif para títulos + sans para interfaz
  Explicación: aporta carácter editorial sin sacrificar legibilidad en formularios y tablas.
- Opción C: sans técnica
  Explicación: más neutra y funcional, útil si la prioridad es operación y velocidad visual.

Respuesta:
A
### 2.2 Jerarquía visual de títulos

- Opción A: títulos grandes y protagónicos
  Explicación: ayuda a que cada pantalla tenga identidad clara.
- Opción B: títulos medianos y compactos
  Explicación: útil si quieres una interfaz más densa y orientada a productividad.

Respuesta:
A
---

## 3. Espaciado y márgenes

### 3.1 Sistema de espaciado global

- Opción A: escala de 4px
  Explicación: máxima precisión y flexibilidad; útil en sistemas complejos.
- Opción B: escala de 8px
  Explicación: estándar muy sólido para producto digital; simple, consistente y fácil de mantener.
- Opción C: escala híbrida 4/8
  Explicación: usa 8px como base y 4px para ajustes finos; suele ser la opción más práctica.

Respuesta:
B
### 3.2 Anchura de contenido principal

- Opción A: contenedor fijo cómodo
  Explicación: mantiene orden visual con una anchura máxima definida para casi todas las pantallas.
- Opción B: contenedor fluido con límites
  Explicación: se adapta mejor a dashboards amplios, pero sigue controlado por `max-width`.
- Opción C: variable por tipo de pantalla
  Explicación: homes y dashboards más amplios; formularios y lectura más contenidos.

Respuesta:
B
### 3.3 Densidad visual

- Opción A: aireada
  Explicación: más espacio entre bloques, mejor percepción premium.
- Opción B: equilibrada
  Explicación: punto medio entre elegancia y productividad.
- Opción C: compacta
  Explicación: muestra más información en menos espacio; útil en admin, pero exige mucho control.

Respuesta:
A
---

## 4. Color

### 4.1 Estrategia de color

- Opción A: paleta corta y muy controlada
  Explicación: pocos colores bien definidos, ideal para consistencia fuerte.
- Opción B: paleta media con roles claros
  Explicación: primario, secundarios, neutros y estados bien separados.
- Opción C: paleta amplia
  Explicación: más flexible, pero más difícil de gobernar.

Respuesta:
La paleta creo que ya la tenemos en /Volumes/02_SSD_1TB/Negocios/Altezza/Web/altezza/components/initialized/variables.scss mejorando los colores de enfasis alertas y demas para que concuenden con la identidad de color 
### 4.2 Temperatura visual

- Opción A: cálida
  Explicación: beige, arena, terracota, champagne, rosa empolvado.
- Opción B: neutra sofisticada
  Explicación: marfil, piedra, carbón, topo, acentos discretos.
- Opción C: fría elegante
  Explicación: grises fríos, azules profundos, marfil y acentos controlados.

Respuesta:
A pero nos guiamos por la paleta del punto anterior 
### 4.3 Uso de color de marca en interfaz

- Opción A: muy medido
  Explicación: el color de marca se reserva para CTA y detalles clave.
- Opción B: presencia moderada
  Explicación: el color de marca aparece en encabezados, acentos y estados destacados.
- Opción C: presencia fuerte
  Explicación: la identidad cromática domina buena parte de la interfaz.

Respuesta:
A
### 4.4 Estados semánticos

- Opción A: clásicos
  Explicación: éxito verde, alerta ámbar, error rojo, info azul.
- Opción B: adaptados a marca
  Explicación: los estados respetan la marca, pero siguen siendo claramente distinguibles.

Respuesta:
B como te dije en eun punto anterior 
---

## 5. Forma de los componentes

### 5.1 Border radius

- Opción A: sutil
  Explicación: apariencia más seria y profesional.
- Opción B: media
  Explicación: amable y moderna sin parecer infantil.
- Opción C: pronunciada
  Explicación: más cálida y contemporánea, útil si quieres una interfaz amable.

Respuesta:
A
### 5.2 Sombras y profundidad

- Opción A: muy sutiles
  Explicación: interfaz limpia y refinada.
- Opción B: medias
  Explicación: separación clara entre capas sin exagerar.
- Opción C: casi sin sombras
  Explicación: el contraste se resuelve más con bordes y fondos.

Respuesta:
A
### 5.3 Estilo de bordes

- Opción A: bordes suaves y visibles
  Explicación: útil para formularios y tablas claras.
- Opción B: bordes casi invisibles
  Explicación: más editorial y elegante.
- Opción C: mezcla según contexto
  Explicación: bordes claros en UI operativa, bordes suaves en áreas más visuales.

Respuesta:
B
---

## 6. Homes y dashboards

### 6.1 Patrón para superficies iniciales

- Opción A: cards modulares
  Explicación: cada módulo aporta una card resumen con CTA.
- Opción B: bloques mixtos
  Explicación: mezcla cards, listas, indicadores y accesos rápidos.
- Opción C: hero + módulos debajo
  Explicación: una cabecera fuerte arriba y luego tarjetas o bloques secundarios.

Respuesta:
A
### 6.2 Home cliente

- Opción A: emocional + funcional
  Explicación: mezcla información del evento con previews útiles y tono aspiracional.
- Opción B: funcional primero
  Explicación: se enfoca en tareas, estado y accesos claros.
- Opción C: visual primero
  Explicación: privilegia imágenes, estilo e inspiración antes que lo operativo.

Respuesta:
A
### 6.3 Dashboard admin

- Opción A: operativo
  Explicación: KPIs, alertas, pendientes y accesos rápidos.
- Opción B: operativo con capa premium
  Explicación: misma estructura funcional, pero con mejor composición visual y jerarquía.

Respuesta:
A
---

## 7. Formularios

### 7.1 Estilo de formularios

- Opción A: clásico limpio
  Explicación: labels arriba, inputs amplios, ayudas discretas.
- Opción B: premium editorial
  Explicación: más espacio, mejor ritmo, títulos y agrupación más trabajados.
- Opción C: denso profesional
  Explicación: útil para admin con muchos campos, pero exige buen orden.

Respuesta:
B
### 7.2 Validación y feedback

- Opción A: toast + error inline
  Explicación: el toast comunica el evento general y el campo muestra el problema exacto.
- Opción B: solo inline en forms
  Explicación: más preciso, menos invasivo.
- Opción C: toast predominante
  Explicación: más simple de implementar, pero puede perder detalle por campo.

Respuesta:
B
---

## 8. Tablas y listados

### 8.1 Estilo de tablas admin

- Opción A: tabla tradicional refinada
  Explicación: filas claras, acciones por columna, filtros arriba.
- Opción B: tabla tipo cards responsivas
  Explicación: mejor adaptabilidad en móvil, pero más compleja.
- Opción C: híbrido
  Explicación: tabla en desktop, cards en móvil.

Respuesta:
A
### 8.2 Acciones por fila

- Opción A: botones visibles
  Explicación: más claridad inmediata.
- Opción B: menú de acciones
  Explicación: interfaz más limpia, útil si habrá muchas acciones.
- Opción C: primarias visibles + secundarias en menú
  Explicación: suele ser la opción más balanceada.

Respuesta:
A
---

## 9. Estados UX

### 9.1 Loading

- Opción A: skeletons
  Explicación: mejor percepción de rendimiento.
- Opción B: spinners + texto
  Explicación: más simple y suficiente en muchos casos.
- Opción C: mixto
  Explicación: skeletons en listas, spinners en acciones puntuales.

Respuesta:
ya tenemos un cargando como componente que deberiamos usar en todo 
### 9.2 Empty states

- Opción A: sobrios y funcionales
  Explicación: mensaje claro y CTA directo.
- Opción B: más humanos y guiados
  Explicación: mejor onboarding, tono más cálido.

Respuesta:
B
### 9.3 Toasts

- Opción A: compactos
  Explicación: rápidos, ligeros y discretos.
- Opción B: ricos en acciones
  Explicación: permiten copiar, cerrar, ir a otra vista o confirmar resultados.

Respuesta:
A
---

## 10. Responsive y mobile

### 10.1 Enfoque responsive

- Opción A: mobile first estricto
  Explicación: primero se diseña móvil y luego escala.
- Opción B: desktop first controlado
  Explicación: útil si el uso principal es admin en escritorio.
- Opción C: híbrido consciente por rol
  Explicación: admin se prioriza en desktop; cliente y colaborador en móvil.

Respuesta:
A
### 10.2 Navegación móvil

- Opción A: drawer lateral
  Explicación: parecido al escritorio, simple de mantener.
- Opción B: bottom navigation para algunos roles
  Explicación: útil en cliente y colaborador si hay pocos accesos clave.
- Opción C: combinada por contexto
  Explicación: bottom nav para módulos frecuentes y drawer para extras.

Respuesta:
ya tenemos el menu en la parte izquierda 
---

## 11. Movimiento y microinteracción

### 11.1 Nivel de motion

- Opción A: mínimo
  Explicación: solo transiciones cortas y funcionales.
- Opción B: moderado
  Explicación: pequeños reveals, cambios de estado y jerarquía más clara.
- Opción C: expresivo
  Explicación: más identidad visual, siempre que no afecte rendimiento.

Respuesta:
A: casi no etiendo a que se refiere de ahora en adelante cuando no sepa mucho de que hablas voya dar la respuesta con la palabra duda para que me expliques despues de leer el documento 
---

## 12. Accesibilidad y calidad

### 12.1 Estándar de accesibilidad

- Opción A: base sólida
  Explicación: foco visible, contraste correcto, labels completos, navegación básica por teclado.
- Opción B: alto estándar
  Explicación: además de lo anterior, estados, semántica y componentes más robustos.

Respuesta:
A: duda
### 12.2 Nivel de exigencia visual

- Opción A: consistente
  Explicación: suficiente para producto serio y mantenible.
- Opción B: premium
  Explicación: cada pantalla debe sentirse diseñada y no solo funcional.

Respuesta:
B
---

## 13. Referencias y restricciones

### 13.1 Productos o estilos que te gustan

Respuesta:

### 13.2 Productos o estilos que no quieres

Respuesta:

### 13.3 Restricciones de marca o negocio que debamos respetar

Respuesta:

---

## 14. Decisiones recomendadas por defecto

Si no quieres responder todo, mi recomendación inicial para Altezza sería:

- Personalidad: `lujo moderno`
- Expresividad: `equilibrado`
- Tipografía: `serif para títulos + sans para interfaz`
- Espaciado: `escala híbrida 4/8`
- Contenedor: `variable por tipo de pantalla`
- Densidad: `equilibrada`
- Color: `paleta media con roles claros`
- Temperatura: `cálida`
- Uso de marca: `muy medido`
- Estados: `adaptados a marca`
- Radius: `media`
- Sombras: `muy sutiles`
- Bordes: `mezcla según contexto`
- Superficies iniciales: `bloques mixtos`
- Home cliente: `emocional + funcional`
- Dashboard admin: `operativo con capa premium`
- Formularios: `premium editorial`
- Validación: `toast + error inline`
- Tablas: `híbrido`
- Acciones por fila: `primarias visibles + secundarias en menú`
- Loading: `mixto`
- Empty states: `más humanos y guiados`
- Toasts: `ricos en acciones`
- Responsive: `híbrido consciente por rol`
- Navegación móvil: `combinada por contexto`
- Motion: `moderado`
- Accesibilidad: `alto estándar`
- Exigencia visual: `premium`

Si quieres aceptar estas como base, puedes responder:

`Usar recomendaciones por defecto, con ajustes en: ...`
