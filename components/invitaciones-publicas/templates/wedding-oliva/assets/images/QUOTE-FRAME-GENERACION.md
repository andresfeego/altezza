# Marco floral de la frase bíblica — Oliva

Propuestas anteriores, sin uso en la tarjeta. La versión activa está documentada
en [QUOTE-CORNERS-GENERACION.md](QUOTE-CORNERS-GENERACION.md).

- Recurso de prueba: `quote-floral-frame-mask-v1.png`, PNG RGBA horizontal de 1536 × 1024 px.
- Generado con `image_gen.imagegen` integrada a partir de la propuesta floral seleccionada por el usuario.
- Original: `/Volumes/01_SSD_1TB/USUARIO/.codex/generated_images/01a0b168-ff2d-7f23-8aff-b5182538f4d6/exec-4569c784-9427-4231-9b62-3313f93527d2.png`.
- Referencia: `/Volumes/01_SSD_1TB/USUARIO/.codex/generated_images/01a0b168-ff2d-7f23-8aff-b5182538f4d6/exec-6cf73057-fa6e-476d-a731-5e246b59b0be.png` (vista previa floral sobre beige).
- Arte plano blanco, centro y fondo transparentes. La máscara utiliza alfa; su RGB no determina el color final. Verificados 1.030.224 píxeles completamente transparentes, incluido el centro.
- CSS aplica el papel beige, la cara del relieve, luces y sombras mediante `FloralReliefOliva`, con los mismos valores que las fotos finales. La imagen horizontal ya no requiere rotación ni contenedor con ejes intercambiados.
- Sustituye visualmente el marco ornamental anterior. Se conservan frase, referencia opcional, centrado, tamaño tipográfico y animación de entrada.

## Prompt de la máscara floral

Use case: background-extraction.
Asset type: production transparent PNG alpha mask for CSS botanical embossing.
Input image 1 is the EDIT TARGET: the horizontal botanical wedding frame just approved by the user. Preserve its landscape 3:2 canvas, complete composition, flower shapes, stems, leaves, buds, spacing, and large empty center. Do not redesign, rotate, add flowers, or change the arrangement.
Convert this beige embossed-paper preview into perfectly FLAT PURE WHITE botanical artwork on TRUE TRANSPARENT BACKGROUND.
Remove the beige paper completely, including the center, outside the branches, and between all leaves and petals. All that negative space must have actual zero-alpha transparency. There must be NO background rectangle, paper texture, vignette, checkerboard drawn into the image, or translucent haze.
Use pure white (#FFFFFF) strokes and flat white petal/leaf silhouettes with transparent engraved inner vein and petal details. Keep stems and delicate details substantial enough to read when the entire frame is only 375 CSS pixels wide. Preserve the airy, refined botanical drawing. Smooth clean antialiased edges; no fuzzy halo.
Remove EVERY baked-in light, shadow, bevel, gradient, gray or beige color, embossed effect, texture, or 3D shading. This is a FLAT alpha mask; the website will create all depth, paper color, lighting and shadows with CSS.
The center remains entirely transparent and empty. No text, lettering, monogram, ornamental scrolls, extra border, or watermark. Output one horizontal transparent PNG, full frame visible.

## Prueba ornamental anterior (sin uso)

- Archivo: `quote-scroll-frame-v1.png`, PNG RGBA de 1024 × 1536 px.
- Herramienta: `image_gen.imagegen` integrada; diseño aprobado por el usuario antes de integrarlo.
- Original: `/Volumes/01_SSD_1TB/USUARIO/.codex/generated_images/01a0b168-ff2d-7f23-8aff-b5182538f4d6/exec-a1ae6726-e25c-485e-a9b6-e32d88a7da5f.png`.
- Referencia visual: `codex-clipboard-8000a23b-e012-421b-80e4-5691ecc1bed6.png`; se eliminó el espacio superior para monograma.
- Integración: rotación de 90° con CSS, máscara alfa completa y mismas capas de cara, luz, sombra y papel que las fotos finales. El centro transparente deja leer el texto. Sin cambios en los datos del evento.

## Prompt completo

Use case: stylized-concept.
Asset type: a single reusable ornamental border for a vertical wedding invitation, prepared as a transparent PNG for later CSS embossed-paper treatment.
Input image 1 is a STYLE REFERENCE for the delicate white raised scrollwork at the perimeter, not for its lettering, medallion, or layout of names.
Create one complete elegant vertical rectangular frame in portrait 2:3 proportions, seen perfectly straight on, with graceful slender Rococo S-scrolls and curled acanthus leaves similar to the reference. The corners have restrained fine flourishes joined by slim gently curved edge lines. Keep the entire frame visible with a small even safety margin on all four sides. The empty interior should occupy about 78–82% of the width and most of the height so photographs and a closing message can later fit inside.
CRITICAL CHANGE: remove the upper-center monogram medallion/cartouche altogether. No oval, crest, badge, shield, crown, central hanging ornament or extra blank space reserved for a monogram. The upper edge must be a continuous balanced ornamental line at the same inset and visual weight as the bottom, with no dip into the central space.
Material and color: warm ivory-white paper ornament, very restrained sculpted embossing with clean well-defined silhouettes and delicate internal cutouts. It must be refined and light, not bulky plaster or a gilded picture frame. Make the shapes opaque enough that their alpha silhouette can become a CSS mask; use only minimal self-shading contained within the ornament, no cast shadow outside it, no foggy shadow halo.
TRUE TRANSPARENT BACKGROUND: both the large open center and everything outside the ornamental frame must be fully transparent alpha, not white or beige fill. There is no paper sheet behind the frame and no opaque rectangular panel. Do not bake in a checkerboard pattern. Render the ornament itself in pale ivory so the preview suggests the eventual raised paper effect.
No text whatsoever, no names, no initials, no numbers, no monogram, no photographs, no flowers filling the center, no watermarks or interface controls. Single asset only, high-resolution portrait PNG.
