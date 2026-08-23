# Estampado D'Jhonny — catálogo digital

Base académica para el catálogo virtual de Estampado D'Jhonny. El proyecto acompaña el curso de Marcos de Desarrollo Web: inicia con frontend estático y se prepara para evolucionar a Spring Boot, Thymeleaf y MySQL.

## Alcance actual: Fase 3

Incluye las Fases 1 y 2, más la corrección de rutas para servir el sitio desde la raíz de `Frontend` y un panel administrativo demostrativo. El panel permite crear, editar, ocultar, publicar, eliminar y restaurar productos localmente; los cambios se reflejan en el catálogo público del mismo navegador.

No incluye backend, base de datos, login real ni persistencia remota. El número de WhatsApp usado para generar enlaces es una constante editable y está marcado como pendiente de validación comercial.

## Estructura

```text
Frontend/
├── CSS/        variables, estilos y responsive
├── admin/      login, dashboard y gestión demostrativa
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

Después abra `http://localhost:8000/`.

## Panel administrativo demostrativo

Acceda directamente a `http://localhost:8000/admin/login.html`.

- Correo: `admin@djhonny.demo`
- Contraseña: `Demo1234!`

El login usa `sessionStorage` y el CRUD usa la clave local `djhonny_catalogo_demo_v1` en `localStorage`. No es un sistema seguro ni comparte cambios entre dispositivos. En Gestión de productos, el botón **Restaurar original** descarta los cambios locales y recupera los datos iniciales de `JS/productos.js`.

## Despliegue en Vercel

Configure `Frontend` como **Root Directory**. La entrada es `index.html`; no requiere servidor Python ni rutas adicionales en producción. Las páginas son archivos estáticos y las rutas relativas permiten abrir directamente catálogo, contacto, detalle y administración.

## Datos y estado

Las fuentes son `Docs/InformaciónDeMarca.xlsx`, `Docs/CATALOGO_ORIGINAL.pdf`, el sílabo académico y las imágenes originales de `Frontend/images/`. Los precios son referenciales y totales por lote; requieren validación comercial antes de publicarse. Consulte `Docs/PENDIENTES_CONTENIDO.md` para las restricciones, productos sin foto específica y datos por confirmar.

Pendiente para fases siguientes: reemplazar la demostración por Spring Security, Spring Boot, Thymeleaf, MySQL, autenticación real y CRUD persistente.
