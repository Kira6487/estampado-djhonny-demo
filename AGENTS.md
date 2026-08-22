# Guía del repositorio

## Estructura

- `Frontend/HTML/`: páginas públicas y la estructura visual de administración.
- `Frontend/CSS/`: variables, estilos compartidos y reglas responsive.
- `Frontend/JS/`: datos reutilizables del catálogo y comportamiento vanilla.
- `Frontend/images/`: recursos originales entregados; no se modifican ni reemplazan.
- `Docs/`: fuentes del proyecto y documentación de decisiones.

## Tecnología y convenciones

- Esta fase usa exclusivamente HTML5, CSS3, JavaScript Vanilla, Bootstrap 5 y Bootstrap Icons por CDN.
- Usar nombres en minúsculas y guiones para HTML/CSS/JS; las imágenes conservan exactamente su nombre original.
- Mantener HTML semántico, enlaces relativos y clases descriptivas. No añadir frameworks, backend, APIs ni dependencias.
- Datos comerciales: no inventar, redondear, dividir ni corregir precios. Los importes son totales por lote salvo que la fuente señale precio por unidad.

## Paleta

`#363435` carbón, `#20201F` negro, `#AACF47` verde lima, `#657C1F` verde accesible, `#FFFFFF` blanco, `#F7F7F5` blanco cálido, `#E6E7E9` gris claro y `#6B6B6B` gris medio. El verde lima es para acentos; sobre blanco, el texto pequeño usa verde accesible.

## Responsive

- La base debe funcionar desde 320 px; adaptar navegación y espacios en 768 px, 1024 px y 1440 px.
- No fijar anchos que provoquen scroll horizontal; imágenes con `max-width: 100%` y controles táctiles utilizables.

## Ejecutar y verificar

- Abrir `Frontend/HTML/index.html` con un servidor local, por ejemplo: `python3 -m http.server 8000 --directory Frontend`.
- Verificar las rutas públicas en `/HTML/` y administración en `/HTML/admin/` a 320, 768, 1024 y 1440 px.
- Antes de finalizar: revisar enlaces relativos, consola sin errores, contraste básico, HTML semántico y que no se hayan modificado imágenes originales.
