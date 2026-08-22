# Plan de Fase 1

## Alcance

Se prepara el frontend estático del catálogo de Estampado D'Jhonny: arquitectura de páginas, identidad visual reutilizable, navegación responsive y un origen de datos JavaScript. No se implementan CRUD, autenticación, base de datos, backend ni el diseño final completo.

## Decisiones

- Se conserva `Frontend/` y las imágenes originales sin renombrarlas ni editarlas.
- `InformaciónDeMarca.xlsx` es la fuente comercial principal; sus precios se guardan como importes totales de lote.
- Bootstrap 5 por CDN se limita a estructura y navegación; el estilo de marca se centraliza en CSS propio.
- La administración es una maqueta navegable preparada para la futura migración a Spring Boot, Thymeleaf y MySQL.
- Los datos cuestionables permanecen anotados, sin correcciones silenciosas.

## Entregables

- Páginas públicas y administrativas conectadas con rutas relativas.
- Variables, estilos base y comportamiento compartido de menú.
- `Frontend/JS/productos.js` con 22 familias de productos, imágenes disponibles y datos de precio/lote.
- Mapa de navegación, inventario de imágenes, pendientes y guía de contribución.

## Fuera de alcance

Filtros, tarjetas completas, detalle dinámico, formularios operativos, modales, dashboard, login, persistencia y cotización real se reservan para fases posteriores.
