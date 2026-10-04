# Guía para editar el CV (mano a mano) y traducir lo que agregues

Esta guía explica cómo cambiar, agregar o quitar texto sin que "desaparezca",
y cómo dejar cada texto listo en Español e Inglés.

Archivos del proyecto:

| Archivo        | Qué contiene |
|----------------|--------------|
| `index.html`   | La estructura y el texto **por defecto** (español) de la página. |
| `styles.css`   | Todo el diseño (colores, tarjetas, animaciones). |
| `script.js`    | La lógica: tema, idioma, tabs y **los dos diccionarios de traducción**. |

---

## 1. Por qué editas `index.html` y no se ve

El JS reemplaza el texto en el momento de cargar. En `script.js`:

```js
function translatePage(locale) {
  const dictionary = translations[locale] || translations.es;
  document.querySelectorAll('[data-i18n-key]').forEach((element) => {
    const key = element.getAttribute('data-i18n-key');
    const text = dictionary[key];
    if (text !== undefined) {
      element.textContent = text;   // <-- sobrescribe lo que escribiste en el HTML
    }
  });
  ...
}
```

Regla: **si un elemento tiene `data-i18n-key`, su texto real vive en `script.js`, no en el HTML.**

Ejemplo real:

```html
<!-- index.html -->
<p class="cat-name" data-i18n-key="sec-summary-label">Perfil</p>
```
```js
// script.js  (diccionario "es")
'sec-summary-label': 'Perfil',
```

Si en el HTML escribes "Sobre mí" pero el diccionario sigue diciendo `'Perfil'`,
la página mostrará **Perfil**. El HTML queda ignorado.

### El idioma y el tema se recuerdan
`script.js` guarda tus preferencias en `localStorage` (`cv.language`, `cv.theme`).
Si la última vez elegiste **English**, verás inglés aunque edites el HTML en español.
Toca el botón de idioma para volver a Español.

---

## 2. Dos caminos según lo que quieras hacer

### Opción A — Texto que NO necesita traducción (lo más simple)
Quítale el atributo `data-i18n-key`. Así el JS no lo toca y puedes escribirlo
libremente en `index.html`.

```html
<!-- Antes: el JS lo sobrescribe -->
<p data-i18n-key="algo">Texto viejo</p>

<!-- Después: tuyo, nadie lo cambia -->
<p>Mi texto nuevo, solo en un idioma</p>
```

Úsalo para nombres propios, siglas o textos que no vas a traducir.

### Opción B — Texto que SÍ debe traducirse (recomendado para casi todo)
Todo texto traducible vive en **dos lugares**:

1. El texto por defecto en `index.html` (para que se vea si el JS falla).
2. El valor en los diccionarios `es` y `en` de `script.js`.

---

## 3. Cambiar un texto ya existente (paso a paso)

1. En `index.html` busca el texto (Ctrl+F).
2. Fíjate en su `data-i18n-key="clave"`.
3. Abre `script.js` y busca esa `clave` dentro de `const translations = { ... }`.
4. Verás dos bloques: `es: { ... }` y `en: { ... }`. Cambia el valor en **los dos**.
5. Guarda y recarga con **Ctrl+Shift+R**.
6. Usa el botón de idioma para verificar ambos.

Ejemplo — cambiar "Perfil" por "Sobre mí":

```html
<!-- index.html (opcional pero recomendado: deja el mismo texto aquí) -->
<p class="cat-name" data-i18n-key="sec-summary-label">Sobre mí</p>
```
```js
// script.js — bloque es
'sec-summary-label': 'Sobre mí',
// script.js — bloque en
'sec-summary-label': 'About me',
```

---

## 4. AGREGAR un texto nuevo (paso a paso)

### 4.1 Texto normal (párrafo, título, etiqueta)
1. En `index.html` agrega el elemento con una **clave nueva** y su texto en español:
   ```html
   <p class="summary" data-i18n-key="mi-texto-nuevo">Mi texto en español</p>
   ```
2. En `script.js`, dentro de `es`, agrega:
   ```js
   'mi-texto-nuevo': 'Mi texto en español',
   ```
3. En `script.js`, dentro de `en`, agrega:
   ```js
   'mi-texto-nuevo': 'My text in English',
   ```
4. Guarda, recarga y prueba el toggle de idioma.

**Reglas de las claves** (el nombre entre comillas):
- minúsculas, sin espacios ni acentos; usa guiones: `mi-texto-nuevo`.
- prefijo por sección para no repetir: `sec-...`, `tech-...`, `admin-...`, `contact-...`.
- la MISMA clave debe existir en `es` **y** en `en`. Si falta en uno, ese idioma
  deja el texto del HTML.

### 4.2 Agregar un ítem dentro de una sección existente

**Bullet de experiencia** — cada `<li>` es independiente:
```html
<li data-i18n-key="tech-job1-b5">Nuevo logro...</li>
```
```js
// es
'tech-job1-b5': 'Nuevo logro...',
// en
'tech-job1-b5': 'New achievement...',
```

**Skill** — los valores son **una sola cadena con comas**; el JS la separa y la
une con `·`. NO metas HTML, solo texto separado por comas:
```js
'es': 'tech-skills-1': 'SQL, Excel avanzado, Análisis de datos, Reportes',
'en': 'tech-skills-1': 'SQL, Advanced Excel, Data Analysis, Reporting',
```

**Idioma** (tarjeta de idiomas): claves `lang-es-name`, `lang-es-level`,
`lang-en-name`, `lang-en-level`. La barra se ajusta con `style="--pct: 100%"` en
`index.html`.

### 4.3 Agregar una categoría/sección completa
Usa una sección existente (por ejemplo "Proyectos") como plantilla:
1. Copia el bloque `<section class="section"> ... </section>`.
2. Cambia `data-num` (el número) y el modificador `section-label--NOMBRE`.
3. Cambia TODAS las `data-i18n-key` (nuevas) y agrégalas a `es` y `en`.
4. Ajusta el orden: revisa los `data-num` de las secciones siguientes.
5. Si quieres color/ícono propio, agrega en `styles.css` un bloque como:
   ```css
   .section-label--mi-categoria {
     --cat: var(--accent);
     --cat-2: var(--accent-mid);
     --icon: url("data:image/svg+xml,<svg ...>...</svg>");
   }
   ```

> Importante: hay **dos perfiles** (`profile-tech` y `profile-admin`) y cada
> sección está **duplicada** en el HTML. Si editas una, revisa la otra.

### 4.4 Contenido que genera JavaScript (ojo)
Estos NO se editan en el HTML, salvo su etiqueta:

- **Proyectos**: se cargan desde la API de GitHub. Los nombres, descripciones y
  lenguajes vienen del repositorio en **GitHub**, no del código. Si quieres texto
  fijo, edita `projCardHtml()` / `renderProjects()` en `script.js`.
- **Palabras giratorias del hero**: claves `tech-hero-words` / `admin-hero-words`,
  cadenas separadas por comas:
  ```js
  'tech-hero-words': 'sistemas,automatizaciones,reportes',
  ```
- **Colon de los títulos de skills**: se quita solo (`renderSkills` + el `replace`).
  Escríbelo sin miedo.

---

## 5. Cómo probar y depurar

1. Sirve la página (no la abras con doble clic):
   ```bash
   python3 -m http.server
   ```
   y abre `http://localhost:8000`.
2. Recarga forzada: **Ctrl+Shift+R** (evita caché).
3. Abre la consola (**F12 → Console**) y mira si hay errores rojos.
4. Cambia ES/EN y tema para confirmar todo.

---

## 6. Problemas comunes

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Edité el HTML y no se ve | El elemento tiene `data-i18n-key` | Edita el valor en `script.js` (es y en) |
| Se ve en español pero no en inglés | Falta la clave en el diccionario `en` | Agrégala en `en` |
| Se ve cortado o raro | Campo que se divide por comas (skills) | Usa una sola cadena con comas, sin HTML |
| Página en blanco / no funciona nada | Error de sintaxis en `script.js` | Revisa la consola; suele ser una coma o comilla |
| Sigue en inglés aunque edité español | Idioma guardado en localStorage | Toca el botón de idioma |
| Cambié el texto pero no aparece el nuevo párrafo | No agregaste el elemento al HTML | Agrega el `<p data-i18n-key=...>` |
| Proyectos con texto viejo | Vienen de GitHub | Edita el repo en GitHub |

Consejos de sintaxis en `script.js`:
- Cada línea termina en coma: `'clave': 'valor',`
- Si tu texto lleva comilla simple, escápala con barra: `'It\'s here'`, o usa
  comillas dobles: `"It's here"`.
- No dejes una coma de más al final del último elemento sin cerrar bien la llave.

---

## 7. Referencia rápida de claves

| Sección | Prefijos de claves |
|---------|--------------------|
| Barra superior / tabs | `tab-`, `download-`, `toggle-`, `language-` |
| Cabeceras de categoría | `sec-*-label`, `sec-*-meta`, `sec-*-stat` |
| Hero | `tech-hero-*`, `admin-hero-*`, `stat-*`, `status`, `location` |
| Perfil | `tech-summary`, `admin-summary`, `about-*` |
| Habilidades | `tech-cat-*` / `admin-cat-*` (títulos), `tech-skills-*` / `admin-skills-*` (valores) |
| Experiencia | `*-job*-role`, `*-job*-b*` (bullets), `job*-company`, `job*-date` |
| Proyectos | `sec-projects-*`, `projects-cta`, `projects-empty`, `projects-loading` |
| Educación | `edu*-degree`, `edu*-year`, `edu*-school` |
| Idiomas | `lang-*` |
| Referencias | `sec-references-*`, `references-copy` |
| Contacto | `sec-contact-*`, `contact-copy`, `contact-label-*` |

---

## 8. Checklist para agregar un texto nuevo

- [ ] Agregué el elemento en `index.html` con `data-i18n-key="mi-clave"`.
- [ ] Agregué `'mi-clave': '...'` en el diccionario **`es`**.
- [ ] Agregué `'mi-clave': '...'` en el diccionario **`en`**.
- [ ] La clave es igual en ambos (minúsculas, guiones).
- [ ] Revisé el **segundo perfil** si aplica (tech/admin).
- [ ] Recargué con Ctrl+Shift+R y probé ES/EN.
- [ ] Si no aparece nada, miré la consola (F12).
