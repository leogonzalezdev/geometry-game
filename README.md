# Figuras — Juego React (Vite, JS)

Juego simple para niños: toca/clickea figuras geométricas en un lienzo SVG, suma aciertos y hazlas desaparecer con una animación hasta terminar.

## Stack
- React 18
- Vite
- JavaScript (sin TypeScript)
- CSS puro (sin UI kits ni libs de animación)

## Ejecutar
```bash
npm install
npm run dev
```
Abre la URL que muestra Vite (por defecto http://localhost:5173).

## Mecánica
- Círculos, cuadrados y triángulos repartidos aleatoriamente (18–30 totales).
- Toca/Click/Enter/Espacio sobre una figura para acertar: suma el contador de aciertos y resta el de restantes.
- La figura desaparece con fade + scale (CSS) y se elimina del DOM.
- Al no quedar figuras, aparece un modal con “Jugar de nuevo”.
- También puedes reiniciar desde el botón “Reiniciar” en el header.

## Accesibilidad
- Cada figura es un botón accesible (`role="button"`, `tabIndex=0`, `aria-label`).
- Soporta mouse, touch y teclado (Enter/Espacio).
- Focus visible claro en SVG con realce de trazo.
- Tamaño táctil mínimo: 44×44 px.

## Estructura
```
src/
  main.jsx
  App.jsx
  styles.css
  utils/
    random.js
  hooks/
    useGameLogic.js
  components/
    Header.jsx
    Counters.jsx
    Canvas.jsx
    Shape.jsx
    GameOverModal.jsx
```

## Configuración
La generación de figuras es parametrizable desde `useGameLogic`/`utils/random` (totales, proporciones, tamaño, semilla opcional). Por defecto:
- Total: 18–30
- Proporciones: círculo 40%, cuadrado 35%, triángulo 25%
- Tamaños: 44–64 px
- Lienzo virtual: 1000×700 (escala responsiva con `viewBox`)

## Notas
- No hay dependencias externas adicionales.
- Código modular y con comentarios breves donde hace falta.

