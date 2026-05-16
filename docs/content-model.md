# Modelo editorial

## Contrato de contenido

| Tipo | Propósito | Regla temporal | Ruta pública | Notas operativas |
| --- | --- | --- | --- | --- |
| `event` | Agenda futura | Solo representa actividades por ocurrir | `/agenda` | No debe usarse como histórico. Si el hecho ya ocurrió y se quiere conservar, se crea una `activity`. |
| `activity` | Registro de una actividad realizada | Presente o pasado reciente | `/actividades/[slug]` | Puede tener detalle público por `slug` y puede vincularse opcionalmente a un `event` mediante `sourceEvent`. |
| `post` | Contenido editorial | Atemporal o noticioso | `/noticias/[slug]` | Se usa para comunicados, análisis, posicionamientos, cobertura editorial o piezas narrativas que no dependen de la agenda. |

## Decisiones aprobadas para la Fase 1

- `activity` sí tendrá página de detalle por `slug`.
- `sourceEvent` será opcional porque no toda actividad nace de un evento previamente cargado en agenda.
- `event` conserva el rol de agenda futura; `activity` se vuelve el archivo histórico de actividades realizadas.
- `post` no reemplaza a `activity`: si el contenido principal es el registro de una actividad de campaña o territorio, va en `activity`; si es una pieza editorial, va en `post`.

## Implicaciones técnicas inmediatas

- `activity` reutilizará los objetos compartidos `blockContent`, `seo`, `imageWithAlt`, `videoEmbed` y `activityCategory`.
- Las queries de agenda deben seguir pensando `event` como contenido futuro.
- Las queries de actividades deberán ordenar principalmente por `activityDate` y usar `publishedAt` como apoyo editorial o de publicación.
