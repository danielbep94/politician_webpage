# Contribuir a Impulso Comunitario

¡Gracias por tu interés en contribuir a este proyecto! Aquí encontrarás las guías para hacerlo de forma ordenada.

---

## Proceso de contribución

1. **Fork** del repositorio.
2. Crea una **rama** desde `main` con el nombre `feat/nombre-descriptivo` o `fix/descripcion-del-bug`.
3. Desarrolla tu cambio con commits claros.
4. Abre un **Pull Request** con descripción del cambio, contexto y cómo probarlo.

---

## Convenciones de ramas

| Prefijo | Cuándo usarlo |
|---------|---------------|
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `chore/` | Mantenimiento, dependencias |
| `docs/` | Solo documentación |
| `style/` | Cambios visuales sin lógica |
| `refactor/` | Refactors sin cambio de comportamiento |

---

## Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agrega sección de agenda en homepage
fix: corrige validación de teléfono en formulario de contacto
chore: actualiza dependencia de Sanity a 3.58
docs: documenta endpoint /api/health
```

---

## Antes de abrir un PR

```bash
npm run typecheck   # Sin errores de TypeScript
npm run lint        # Sin warnings de ESLint
npm run build       # Build exitoso
```

---

## Estructura de componentes

- Los componentes deben ser **reutilizables y tipados**.
- Los componentes de servidor son la opción por defecto. Solo agrega `"use client"` cuando necesites estado o efectos del navegador.
- Usa el sistema de diseño existente (`SectionHeader`, `Card`, `Button`, `Container`) antes de crear nuevos componentes.
- Mantén la **copia ciudadana** en español claro y sin tecnicismos de desarrollo.

---

## Variables de entorno

Nunca subas `.env.local` ni secretos. Usa `.env.example` para documentar nuevas variables.

---

## Reportar bugs

Abre un issue con:
- Descripción clara del problema
- Pasos para reproducirlo
- Comportamiento esperado vs. actual
- Capturas de pantalla si aplica
