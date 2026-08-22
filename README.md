# Estampado D'Jhonny — catálogo digital

Base académica para el catálogo virtual de Estampado D'Jhonny. El proyecto acompaña el curso de Marcos de Desarrollo Web: inicia con frontend estático y se prepara para evolucionar a Spring Boot, Thymeleaf y MySQL.

## Alcance actual: Fase 1

Incluye auditoría de recursos, documentación de contenido, arquitectura de páginas públicas/administrativas, estilos compartidos responsive y una estructura JavaScript reutilizable para 22 familias de producto. No incluye backend, base de datos, login real, CRUD, cotización operativa, filtros ni diseño final de las tarjetas.

## Estructura

```text
Frontend/
├── CSS/        variables, estilos y responsive
├── HTML/       páginas públicas y administración simulada
├── images/     recursos originales entregados
└── JS/         datos del catálogo y comportamiento compartido
Docs/           catálogo fuente, Excel y documentación de Fase 1
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

Las fuentes son `Docs/InformaciónDeMarca.xlsx`, `Docs/CATALOGO_ORIGINAL.pdf`, el sílabo académico y las imágenes originales de `Frontend/images/`. Los precios son referenciales y totales por lote; requieren validación comercial antes de publicarse. Consulte `Docs/PENDIENTES_CONTENIDO.md` para las restricciones y datos por confirmar.

Pendiente para fases siguientes: tarjetas y filtros de catálogo, detalle dinámico, formulario/cotización por WhatsApp, panel funcional, Spring Boot, Thymeleaf, MySQL, autenticación y CRUD.
