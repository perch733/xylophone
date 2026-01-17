## Informe (lo que ya está bien)
- App mínima y clara: HTML simple, CSS directo, JS encapsulado en IIFE. [index.html](file:///c:/Users/percy/Downloads/localoe/xylophone/index.html) [script.js](file:///c:/Users/percy/Downloads/localoe/xylophone/script.js)
- Buena idea usar delegación de eventos en el contenedor para no registrar 8 listeners. [script.js:L25-L31](file:///c:/Users/percy/Downloads/localoe/xylophone/script.js#L25-L31)
- Reinicio de audio (pause + currentTime=0) para permitir repetición rápida. [script.js:L14-L23](file:///c:/Users/percy/Downloads/localoe/xylophone/script.js#L14-L23)

## Oportunidades de optimización/refactor
### JavaScript
- Unificar eventos con Pointer Events: en vez de decidir entre touch/click, usar `pointerdown` (cubre mouse/touch/stylus) y reduce ramas. [script.js:L32-L33](file:///c:/Users/percy/Downloads/localoe/xylophone/script.js#L32-L33)
- Robustez ante targets inesperados: ahora depende de `e.target.id`; si cambias el markup (ej. agregas un `span`), fallaría. Mejor usar `closest('.note')`.
- Manejo seguro de `Audio.play()`: en algunos navegadores devuelve Promise y puede rechazar; conviene capturar/ignorar el error para evitar logs/estado raro.
- Estructurar datos: en vez de hardcodear IDs en el objeto, usar `data-note="C"`/`data-sound="C.mp3"` en el HTML o derivarlo del dataset.
- Mejorar UX: soporte de teclado (Enter/Espacio sobre el elemento, o mapeo de teclas), y estado visual con clase `is-active`.

### CSS
- `box-sizing`: ahora solo aplica al `body`. Lo correcto suele ser `*, *::before, *::after { box-sizing: border-box; }` para consistencia. [style.css:L1-L3](file:///c:/Users/percy/Downloads/localoe/xylophone/style.css#L1-L3)
- Evitar duplicación: `.white_bold` repite propiedades que ya están en `.note` y ni se usa en el HTML actual. [style.css:L72-L78](file:///c:/Users/percy/Downloads/localoe/xylophone/style.css#L72-L78)
- Evitar `nth-child` rígido: hoy los colores/alturas dependen del orden. Si reordenas notas o insertas una, se rompe. Mejor asignar estilos por `data-note` o clases (`note--C`, etc.). [style.css:L32-L70](file:///c:/Users/percy/Downloads/localoe/xylophone/style.css#L32-L70)
- Accesibilidad visual: añadir `:focus-visible` y transición suave de sombra.

### HTML
- Accesibilidad/semántica: en vez de `div` clicables, usar `button` (o añadir `role="button"`, `tabindex="0"` y handlers de teclado). [index.html:L11-L20](file:///c:/Users/percy/Downloads/localoe/xylophone/index.html#L11-L20)
- Mejorar maintainability: usar `data-note` y texto consistente (por ejemplo DO/RE/MI + octava en el DO final).

## Plan de cambios propuesto (lo que haré cuando confirmes)
1. Refactorizar el HTML para usar `button.note` y agregar `data-note`.
2. Refactorizar CSS:
   - aplicar `box-sizing` global,
   - reemplazar `nth-child` por selectores basados en `data-note` o clases,
   - eliminar `.white_bold` si no se usa,
   - añadir estados `:hover`/`:focus-visible` y `is-active`.
3. Refactorizar JS:
   - usar `pointerdown` + `closest('.note')`,
   - derivar audio por dataset,
   - hacer `playNote(noteEl)` más clara y testeable,
   - añadir soporte de teclado (Enter/Espacio) sin duplicar lógica.
4. Mejorar README con instrucciones (cómo abrirlo en el navegador y estructura del proyecto).
5. Verificar manualmente la funcionalidad (click/touch/teclado) y que no haya regresiones.

Si confirmas este plan, implemento los cambios manteniendo el proyecto igual de simple (sin frameworks ni dependencias nuevas salvo que tú lo pidas).