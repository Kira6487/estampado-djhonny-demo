# Mapa de navegación

```text
Sitio público
├── Inicio                 (index.html)
├── Catálogo               (catalogo.html)
├── Detalle del producto   (producto.html?slug=...)
├── Servicios              (ancla preparada en Inicio)
├── Cómo comprar           (ancla preparada en Inicio)
├── Nosotros               (ancla preparada en Inicio)
├── Contacto               (contacto.html)
└── Cotización por WhatsApp (enlace sujeto a validación)

Administración
├── Login                  (admin/login.html)
├── Dashboard              (admin/index.html)
├── Productos              (admin/productos.html)
├── Categorías             (ruta futura)
├── Cotizaciones           (ruta futura)
└── Galería                (ruta futura)
```

La administración es un modo demostrativo local: usa `sessionStorage` para sesión y `localStorage` para productos. Categorías, cotizaciones y galería muestran “Próximamente” y no enlazan a archivos inexistentes.
