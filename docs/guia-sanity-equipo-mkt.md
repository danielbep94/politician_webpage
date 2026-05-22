# Guía Sanity CMS — Equipo de Marketing
### Política Moderna · Sitio de campaña

> **Audiencia:** Equipo de comunicación y marketing.  
> **Nivel técnico requerido:** Ninguno. Solo necesitas acceso al Studio y un navegador.  
> **¿Buscas actualizar imágenes o videos?** → Ver también [`guia-visual-actualizacion-contenido.md`](./guia-visual-actualizacion-contenido.md)

---

## Antes de empezar — Verificación rápida

```
✅ Tienes acceso a https://politicamoderna.info/studio
✅ Puedes iniciar sesión con tu cuenta de Google
✅ Ves el menú lateral con: Configuración, Editorial, Institucional, Operación
✅ El contenido que vas a publicar fue aprobado por el área de comunicación
```

> Si no puedes ver el Studio o te falta acceso a alguna sección, contacta al equipo técnico. No compartas credenciales.

---

## Índice

1. [¿Qué es Sanity Studio?](#1-qué-es-sanity-studio)
2. [Cómo acceder](#2-cómo-acceder)
3. [Estructura del menú](#3-estructura-del-menú)
4. [Configuración del sitio](#4-configuración-del-sitio-singleton)
5. [Editorial — Actividades](#5-editorial--actividades)
6. [Editorial — Agenda](#6-editorial--agenda)
7. [Editorial — Noticias](#7-editorial--noticias)
8. [Editorial — Comunicados de Prensa](#8-editorial--comunicados-de-prensa)
9. [Editorial — Kit de Prensa](#9-editorial--kit-de-prensa)
10. [Institucional — Perfil Público del Candidato](#10-institucional--perfil-público-del-candidato)
11. [Institucional — Propuestas](#11-institucional--propuestas)
12. [Institucional — Preguntas Frecuentes](#12-institucional--preguntas-frecuentes)
13. [Operación — Mensajes de Contacto](#13-operación--mensajes-de-contacto)
14. [Operación — Leads de Voluntariado](#14-operación--leads-de-voluntariado)
15. [Flujo de publicación](#15-flujo-de-publicación)
16. [Tarjeta de referencia rápida](#16-tarjeta-de-referencia-rápida)
17. [Solución de problemas](#17-solución-de-problemas)
18. [Glosario](#18-glosario)

---

## 1. ¿Qué es Sanity Studio?

Sanity Studio es el **panel de administración de contenido** del sitio. Desde aquí el equipo de marketing puede crear, editar y publicar todo el contenido que aparece en `politicamoderna.info` **sin tocar código**.

Los cambios que haces aquí aparecen en el sitio público en segundos (el sitio usa revalidación en tiempo real).

---

## 2. Cómo acceder

| | |
|---|---|
| **URL del Studio** | `https://politicamoderna.info/studio` |
| **Autenticación** | Inicia sesión con tu cuenta de Google o el método que el equipo técnico configuró |
| **Permisos** | Si no puedes ver alguna sección, pide al equipo técnico que te asigne el rol `Editor` en el proyecto de Sanity |

> [!IMPORTANT]
> Nunca compartas tus credenciales. Cada persona del equipo debe tener su propia cuenta para mantener trazabilidad de cambios.

---

## 3. Estructura del menú

Al entrar al Studio verás un menú lateral con cuatro secciones principales:

```
📌 Configuración del sitio          ← Textos globales y SEO del home
────────────────────────────────
📁 Editorial
   ├── Actividades                  ← Lo que ya ocurrió (recorridos, eventos pasados)
   ├── Agenda                       ← Próximos eventos
   ├── Noticias                     ← Artículos del blog de campaña
   ├── Comunicados                  ← Boletines de prensa
   └── Kit de prensa                ← Fotos, logos y documentos para medios
────────────────────────────────
📁 Institucional
   ├── Perfil público               ← Biografía y datos del candidato
   ├── Propuestas                   ← Plataforma política
   └── Preguntas frecuentes         ← FAQs del sitio
────────────────────────────────
📁 Operación
   ├── Mensajes de contacto         ← Formularios recibidos (solo lectura)
   └── Leads de voluntariado        ← Registro de voluntarios
```

---

## 4. Configuración del sitio (Singleton)

> **Dónde:** Menú lateral → **Configuración del sitio**  
> **Cuándo actualizarlo:** Cuando cambie el mensaje del hero, el email de contacto principal, o la imagen de redes sociales.

Este documento es **único** (no puedes crear varios). Controla textos y metadatos globales del sitio.

### Pestaña: Identidad

| Campo | Descripción | Límites |
|---|---|---|
| **Nombre del sitio** | Nombre editorial del proyecto (aparece en metadata) | 3–80 caracteres |
| **Descripción general** | Resumen corto para SEO y descripciones globales | 40–180 caracteres |
| **URL del sitio** | Dominio canónico (no editar en producción sin avisar a técnico) | URL válida |
| **Locale** | Idioma/región (no editar: `es_MX`) | — |

### Pestaña: Home

| Campo | Descripción | Límites |
|---|---|---|
| **Mensaje principal** | Titular grande del hero en la portada | 12–120 caracteres |
| **Bajada del hero** | Texto de apoyo del hero. Breve y claro | 40–260 caracteres |

> [!TIP]
> El mensaje del hero es lo primero que ve un visitante. Úsalo para reflejar el momento de la campaña: eventos recientes, ejes de campaña, fechas clave.

### Pestaña: Contacto

| Campo | Descripción |
|---|---|
| **Email de contacto** | Correo principal visible en prensa y formularios |

### Pestaña: SEO

| Campo | Descripción |
|---|---|
| **Imagen OG por defecto** | Imagen que aparece cuando se comparte el sitio en redes (recomendado: 1200×630 px) |

---

## 5. Editorial — Actividades

> **Dónde:** Editorial → **Actividades**  
> **Qué es:** Registro de lo que **ya ocurrió**. Recorridos, reuniones comunitarias, eventos pasados.  
> **Página del sitio:** `/actividades`

### Cuándo crear una Actividad

- Después de un recorrido, taller, reunión o cualquier acción de campaña realizada.
- Cuando quieras que quede documentada con fotos y narrativa.

> [!IMPORTANT]
> **La fecha de actividad no puede estar en el futuro.** Si el evento aún no ha ocurrido, créalo en **Agenda** primero. Una vez realizado, regístralo aquí como Actividad.

### Pestaña: Editorial (obligatorios)

| Campo | Descripción | Límites |
|---|---|---|
| **Title** | Título de la actividad | 8–120 caracteres |
| **Slug** | URL pública (se genera automáticamente desde el título; haz clic en "Generate") | — |
| **Excerpt** | Resumen corto para tarjetas y listados | 40–240 caracteres |
| **Body** | Cuerpo principal con texto enriquecido (párrafos, negritas, listas, imágenes embebidas) | Al menos 1 bloque |
| **Activity Date** | Fecha en que ocurrió la actividad (no puede ser futura) | Fecha requerida |
| **Published At** | Fecha editorial de publicación (cuándo aparece en el sitio) | Datetime requerido |
| **Location** | Lugar donde ocurrió | 3–120 caracteres |
| **Categories** | Categoría editorial (ej. "Recorrido", "Reunión comunitaria") | Al menos 1 |
| **Featured** | ✅ Actívalo para destacar esta actividad en módulos curados del sitio | Booleano |

### Pestaña: Media

| Campo | Descripción |
|---|---|
| **Cover Image** | Imagen principal (obligatoria). Aparece en tarjetas, SEO y cabecera del artículo |
| **Gallery** | Hasta 12 imágenes adicionales de la actividad |
| **Video** | URL embebida de YouTube o Vimeo (opcional) |

### Pestaña: Relations

| Campo | Descripción |
|---|---|
| **Source Event** | Si esta actividad viene de un evento de Agenda previo, puedes enlazarlos aquí |

### Pestaña: SEO

| Campo | Descripción |
|---|---|
| **SEO** | Título, descripción y configuración de indexación para motores de búsqueda |

---

## 6. Editorial — Agenda

> **Dónde:** Editorial → **Agenda**  
> **Qué es:** Eventos **futuros** públicos (mítines, reuniones, transmisiones en vivo).  
> **Página del sitio:** `/agenda`

> [!IMPORTANT]
> **La fecha debe ser hoy o en el futuro.** Si el evento ya pasó, el Studio lo rechazará y deberás registrarlo como **Actividad**.

### Pestaña: Editorial

| Campo | Descripción | Límites |
|---|---|---|
| **Titulo** | Nombre público del evento | 8–120 caracteres |
| **Slug** | URL identificadora (se genera automáticamente) | — |
| **Tipo de evento** | Ej.: "Reunión comunitaria", "Recorrido", "Transmisión pública" | 3–60 caracteres |
| **Resumen** | Descripción corta del objetivo o formato del evento | 30–240 caracteres |

### Pestaña: Logística

| Campo | Descripción | Límites |
|---|---|---|
| **Fecha** | Fecha del evento (debe ser hoy o futura) | Fecha requerida |
| **Hora** | Hora visible en agenda, ej. "10:00 AM" | Hasta 30 caracteres |
| **Ubicación** | Lugar físico o canal digital | 3–120 caracteres |
| **Es virtual** | Activa si es transmisión digital | Booleano |

### Pestaña: CTA

| Campo | Descripción | Límites |
|---|---|---|
| **Texto del CTA** | Botón de acción, ej. "Confirmar asistencia" | 3–50 caracteres |
| **Destino del CTA** | URL destino: puede ser `/sumate` (interna) o un enlace externo | Requerido |

---

## 7. Editorial — Noticias

> **Dónde:** Editorial → **Noticias**  
> **Qué es:** Artículos del blog de campaña.  
> **Página del sitio:** `/noticias`

### Pestaña: Editorial

| Campo | Descripción | Límites |
|---|---|---|
| **Titulo** | Titular principal de la noticia | 8–120 caracteres |
| **Slug** | URL pública (generar desde el título) | Requerido |
| **Extracto** | Resumen corto para tarjetas y metadata SEO | 30–220 caracteres |
| **Cuerpo** | Contenido principal con texto enriquecido | Al menos 1 bloque |

### Pestaña: Distribución

| Campo | Descripción | Límites |
|---|---|---|
| **Categoria** | Etiqueta editorial visible, ej. "Seguridad", "Educación" | 3–60 caracteres |
| **Publicado el** | Fecha editorial de publicación | Datetime requerido |
| **Tiempo de lectura** | Texto corto, ej. "4 min" | Hasta 20 caracteres |
| **Destacar en módulos curados** | ✅ Para que aparezca en secciones destacadas del sitio | Booleano |

---

## 8. Editorial — Comunicados de Prensa

> **Dónde:** Editorial → **Comunicados**  
> **Qué es:** Boletines y comunicados oficiales para medios.  
> **Página del sitio:** `/prensa`

### Pestaña: Editorial

| Campo | Descripción | Límites |
|---|---|---|
| **Titulo** | Nombre del comunicado | 8–120 caracteres |
| **Slug** | Identificador URL | Requerido |
| **Extracto** | Resumen breve para listados | 30–220 caracteres |
| **Publicado el** | Fecha editorial | Datetime requerido |
| **Resumen extendido** | Bajada más amplia para medios | 40–500 caracteres |

### Pestaña: Distribución

| Campo | Descripción |
|---|---|
| **Archivo descargable** | Sube el PDF o DOCX oficial del comunicado |

> [!TIP]
> Sube siempre el PDF oficial del comunicado. Los medios necesitan poder descargarlo directamente desde el sitio.

---

## 9. Editorial — Kit de Prensa

> **Dónde:** Editorial → **Kit de prensa**  
> **Qué es:** Banco de recursos visuales y documentos para medios de comunicación.  
> **Página del sitio:** `/prensa`

### Tipos de asset

| Tipo | Cuándo usarlo |
|---|---|
| **Fotografía** | Fotos de campaña de alta resolución para medios |
| **Logotipo** | Versiones del logo en distintos formatos/fondos |
| **Documento** | Archivos descargables (PDFs, fichas técnicas) |

### Campos

| Campo | Descripción | Límites |
|---|---|---|
| **Titulo** | Nombre corto identificador del asset | 3–100 caracteres |
| **Tipo de asset** | Selecciona: Fotografía / Logotipo / Documento | Requerido |
| **Descripción** | Contexto de uso para editores y medios | 20–220 caracteres |
| **Imagen nativa** | Visible solo para Fotografía y Logotipo | — |
| **Archivo nativo** | Visible solo para Documento (.pdf, .doc, .docx, .zip) | — |

---

## 10. Institucional — Perfil Público del Candidato

> **Dónde:** Institucional → **Perfil público**  
> **Qué es:** Datos y narrativa oficial del candidato. Alimenta `/sobre-mi` y módulos del home.

> [!WARNING]
> Este documento impacta múltiples secciones del sitio. Cualquier cambio aquí se refleja inmediatamente en el sitio público. Coordina con el equipo antes de editar texto de campaña crítico.

### Pestaña: Perfil

| Campo | Descripción | Límites |
|---|---|---|
| **Nombre completo** | Nombre oficial que aparece en firmas y referencias | 3–100 caracteres |
| **Nombre corto** | Versión abreviada para UI compacta y citas | 2–40 caracteres |
| **Rol** | Cargo o descripción política | 3–80 caracteres |
| **Territorio o ubicación** | Circunscripción, municipio o zona de campaña | 3–100 caracteres |
| **Headline** | Frase principal que acompaña el perfil | 12–160 caracteres |

### Pestaña: Narrativa

| Campo | Descripción | Límites |
|---|---|---|
| **Resumen** | Párrafo corto de presentación para cards y metadata | 40–280 caracteres |
| **Biografía** | Párrafos narrativos del perfil (pueden ser varios) | Al menos 1 párrafo |
| **Trayectoria** | Lista de hitos y antecedentes | Al menos 1 ítem |
| **Valores** | Lista de principios y forma de trabajo | Al menos 1 ítem |
| **Visión** | Texto extenso sobre la visión de campaña | Mínimo 40 caracteres |

### Pestaña: Contacto

| Campo | Descripción |
|---|---|
| **Email** | Email oficial del candidato |
| **Teléfono** | Teléfono de contacto |
| **Redes y enlaces** | Lista de redes sociales: agrega Etiqueta (ej. "Twitter") y URL |

---

## 11. Institucional — Propuestas

> **Dónde:** Institucional → **Propuestas**  
> **Qué es:** Plataforma política pública.  
> **Página del sitio:** `/propuestas`

### Pestaña: Editorial

| Campo | Descripción | Límites |
|---|---|---|
| **Titulo** | Nombre público de la propuesta | 8–120 caracteres |
| **Slug** | URL pública (generar automáticamente) | Requerido |
| **Tema** | Macrotema, ej. "Seguridad Pública", "Educación" | 3–60 caracteres |
| **Resumen** | Síntesis para tarjetas y listados | 30–240 caracteres |

### Pestaña: Contenido

| Campo | Descripción |
|---|---|
| **Problema** | Diagnóstico claro del problema que aborda la propuesta |
| **Contexto** | Datos y antecedentes que fundamentan la propuesta |
| **Propuesta** | La solución concreta que se propone |
| **Acciones** | Lista de acciones concretas a implementar |
| **Impacto esperado** | Lista de resultados esperados para la ciudadanía |

### Pestaña: Distribución

| Campo | Descripción |
|---|---|
| **CTA ciudadano** | Invitación para que la ciudadanía participe (ej. "Comparte tu opinión en...") |
| **Destacar en módulos curados** | ✅ Para que aparezca en la portada o módulos principales |

---

## 12. Institucional — Preguntas Frecuentes

> **Dónde:** Institucional → **Preguntas frecuentes**

| Campo | Descripción | Límites |
|---|---|---|
| **Pregunta** | Pregunta visible para la ciudadanía | 8–140 caracteres |
| **Respuesta** | Respuesta clara, breve y accionable | 20–500 caracteres |

> [!TIP]
> Mantén las respuestas cortas y en lenguaje ciudadano. Evita tecnicismos políticos.

---

## 13. Operación — Mensajes de Contacto

> **Dónde:** Operación → **Mensajes de contacto**

> [!NOTE]
> Estos documentos son **generados automáticamente** cuando alguien llena el formulario de contacto. El equipo de marketing **no debe crear ni editar** estos documentos manualmente. Solo sirven para consulta.

| Campo | Descripción |
|---|---|
| **Nombre** | Nombre del remitente |
| **Email** | Correo del remitente |
| **Teléfono** | Teléfono (si fue proporcionado) |
| **Tema** | Asunto del mensaje |
| **Mensaje** | Contenido completo |
| **Enviado el** | Fecha y hora de recepción |

---

## 14. Operación — Leads de Voluntariado

> **Dónde:** Operación → **Leads de voluntariado**

> [!NOTE]
> Los documentos son generados automáticamente por el formulario de `/sumate`. El equipo **no debe crearlos manualmente**, pero **sí debe actualizar el estado de seguimiento** de cada lead.

Abre cualquier lead → pestaña **Meta** → campo **Estado de seguimiento**:

| Estado | Emoji | Cuándo usarlo |
|---|---|---|
| Nuevo | 🆕 | Recién llegado, sin gestionar |
| Contactado | 📞 | Ya se le contactó por teléfono o email |
| Incorporado | ✅ | Ya forma parte activa del equipo de voluntarios |
| Inactivo | ⛔ | No respondió o no pudo participar |

> [!TIP]
> Mantén los estados actualizados. Esto permite al equipo saber en qué etapa está cada voluntario sin necesidad de revisar otra herramienta.

---

## 15. Flujo de publicación

### Publicar un documento nuevo

```
PASO 1  →  Haz clic en el tipo de contenido en el menú lateral
PASO 2  →  Clic en "+ Create" (esquina superior derecha)
PASO 3  →  Llena todos los campos marcados como obligatorios
           → Los campos con * o borde rojo son OBLIGATORIOS
PASO 4  →  Genera el Slug: clic en el botón "Generate" junto al campo Slug
PASO 5  →  Verifica que no haya errores de validación (indicadores rojos)
PASO 6  →  Clic en "Publish" (botón azul, esquina superior derecha)
PASO 7  →  El botón cambia a "Published" (gris) ✅
PASO 8  →  Abre https://politicamoderna.info y verifica que el cambio apareció
           → Puede tardar hasta 60 segundos en reflejarse
```

### Editar un documento existente

```
PASO 1  →  Busca el documento en la lista (usa la barra de búsqueda)
PASO 2  →  Haz clic para abrirlo
PASO 3  →  Edita los campos necesarios
PASO 4  →  Clic en "Publish" para guardar los cambios en el sitio
```

> [!WARNING]
> Los cambios guardados pero **no publicados** no aparecen en el sitio público. Siempre verifica que el botón diga "Published" (gris, sin punto azul) cuando termines.

### Descartar cambios sin publicar

Menú de tres puntos (⋯) → **Discard changes**

### Restaurar versiones anteriores

Menú de tres puntos (⋯) → **Restore** → selecciona la versión a restaurar

### Estado del botón — guía rápida

| Estado del botón | Significado |
|---|---|
| 🔵 **Publish** (azul) | Cambios pendientes — aún NO están en el sitio |
| ⚪ **Published** (gris) | Publicado — ya está visible en el sitio |
| 🔵 **Publish** con punto azul | Tienes cambios locales no publicados |
| 🔴 Botón inactivo | Hay campos obligatorios incompletos o con error |

---

## 16. Tarjeta de referencia rápida

| Necesitas hacer... | Ve a... |
|---|---|
| Cambiar el mensaje del hero | Configuración del sitio → Home |
| Publicar foto de un recorrido | Editorial → Actividades → Crear |
| Anunciar un mitin próximo | Editorial → Agenda → Crear |
| Publicar una nota de campaña | Editorial → Noticias → Crear |
| Subir un comunicado de prensa | Editorial → Comunicados → Crear |
| Agregar foto oficial para medios | Editorial → Kit de prensa → Crear |
| Actualizar la biografía | Institucional → Perfil público |
| Publicar una propuesta nueva | Institucional → Propuestas → Crear |
| Agregar una FAQ | Institucional → Preguntas frecuentes → Crear |
| Revisar formularios de contacto | Operación → Mensajes de contacto |
| Gestionar voluntarios | Operación → Leads de voluntariado |

---

### Regla de oro: Agenda vs. Actividad

```
┌──────────────────────────────────────────────────────┐
│  El evento AÚN NO ocurre  →  Crea un evento en AGENDA │
│  El evento YA OCURRIÓ    →  Crea una ACTIVIDAD        │
└──────────────────────────────────────────────────────┘
```

---

## 17. Solución de problemas

| Problema | Causa probable | Solución |
|---|---|---|
| El botón "Publish" está inactivo | Campos obligatorios vacíos o con error | Busca los indicadores rojos en el formulario y completa esos campos |
| Publiqué algo con un error | — | Edita el campo → clic en "Publish" de nuevo para sobrescribir |
| El sitio no refleja mis cambios | El caché tarda en actualizarse | Espera 30–60 segundos y recarga la página del sitio |
| Subí una imagen incorrecta | — | Pasa el cursor sobre la imagen → clic en ✕ → sube la correcta |
| El Studio dice "Conflict" o "Draft" | Otro usuario editó el mismo documento | Usa el menú ⋯ → "Restore" para ver versiones o contacta al equipo |
| No veo una sección del menú | Falta de permisos de rol | Contacta al equipo técnico para que asigne el rol `Editor` |
| Error al guardar (banner rojo) | Problema de conexión o sesión expirada | Recarga la página, inicia sesión de nuevo e intenta de nuevo |
| Los cambios del hero no aparecen | Se olvidó publicar | Abre "Configuración del sitio" → verifica que el botón diga "Published" |

> [!NOTE]
> Si el problema persiste más de 5 minutos, contacta al equipo técnico con una captura de pantalla del error.

---

## 18. Glosario

| Término | Definición |
|---|---|
| **Studio** | El panel de administración de contenido en `politicamoderna.info/studio` |
| **Publish** | Acción de hacer visible un documento en el sitio público |
| **Draft** | Borrador: cambios guardados pero no publicados aún |
| **Slug** | La parte de la URL que identifica un documento. Ej: `/noticias/mi-primer-articulo` |
| **Singleton** | Documento único — solo puede existir uno (ej. Configuración del sitio, Perfil público) |
| **ISR** | Regeneración Incremental Estática — el mecanismo que actualiza el sitio en segundos al publicar |
| **Webhook** | Señal automática que Sanity envía al sitio cuando publicas, para actualizar el caché |
| **Alt text** | Texto alternativo que describe una imagen para personas con discapacidad visual y para SEO |
| **OG Image** | Imagen que aparece al compartir el sitio en WhatsApp, Twitter o Facebook |
| **Featured / Destacado** | Contenido marcado para aparecer en módulos curados de la portada |
| **CTA** | Call To Action — botón o enlace que invita a hacer algo ("Confirmar asistencia", "Leer más") |
| **Lead** | Registro de una persona interesada en ser voluntaria |

---

*Documento preparado por el equipo técnico para uso interno del equipo de comunicación y marketing.*  
*Última actualización: Mayo 2026 — Para cambios en el CMS o nuevos accesos, contactar al equipo de desarrollo.*
