# Estampado D'Jhonny — catálogo digital

Base académica para el catálogo virtual de Estampado D'Jhonny. El proyecto acompaña el curso de Marcos de Desarrollo Web: inicia con frontend estático y se prepara para evolucionar a Spring Boot, Thymeleaf y MySQL.

## Alcance actual: Fase 2

Incluye la base documentada de la Fase 1 y el catálogo público completo de la Fase 2: página de inicio comercial, tarjetas dinámicas de las 22 familias, filtros por categoría, búsqueda, modal de vista rápida, detalle de producto por URL, tablas de precios/lotes, productos relacionados y formulario de cotización que prepara un enlace de WhatsApp.

No incluye backend, base de datos, login real, CRUD ni persistencia. El número de WhatsApp usado para generar enlaces es una constante editable y está marcado como pendiente de validación comercial.

## Estructura

```text
Frontend/
├── CSS/        variables, estilos y responsive
├── HTML/       páginas públicas y administración simulada
├── images/     recursos originales entregados
└── JS/         datos del catálogo y comportamiento compartido/dinámico
Docs/           catálogo fuente, Excel y documentación de Fase 1 y 2
```

## Tecnologías

HTML5, CSS3, JavaScript Vanilla, Bootstrap 5 y Bootstrap Icons mediante CDN.

## Ejecución local

Desde la raíz del repositorio ejecute:

```bash
python3 -m http.server 8000 --directory Frontend
```

Después abra `http://localhost:8000/HTML/index.html`.

## Datos y estado

Las fuentes son `Docs/InformaciónDeMarca.xlsx`, `Docs/CATALOGO_ORIGINAL.pdf`, el sílabo académico y las imágenes originales de `Frontend/images/`. Los precios son referenciales y totales por lote; requieren validación comercial antes de publicarse. Consulte `Docs/PENDIENTES_CONTENIDO.md` para las restricciones, productos sin foto específica y datos por confirmar.

Pendiente para fases siguientes: panel administrativo funcional, Spring Boot, Thymeleaf, MySQL, autenticación y CRUD.
