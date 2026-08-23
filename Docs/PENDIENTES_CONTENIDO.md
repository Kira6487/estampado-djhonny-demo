# Pendientes de contenido y validación

## Alta prioridad

- Confirmar la vigencia de todos los precios: el catálogo original es de octubre de 2022.
- Mantener siempre medida y cantidad junto a un precio: los importes son totales por lote, no unitarios.
- Confirmar la base tarifaria de etiquetas bordadas: exige mínimo 4 millares, pero no indica si los importes son por ciento, millar u otra base.
- Validar el número de WhatsApp antes de habilitar una cotización real.

## Inconsistencias encontradas

- La conversión de 13 × 19 pulgadas aparece como 33 × 36 cm en varias tablas; requiere confirmación.
- Papel liner E-19 tiene el precio de 100 como `S7260`, interpretado en el Excel como S/260; debe confirmarse.
- Papel liner E-20 registra `270` sin símbolo monetario; requiere confirmar S/270.
- Precios por mayor de polos y poleras no indican cantidad mínima.
- El catálogo alterna “Han-Tag”, “Han-Tang” y “High Glos”; la estructura usa “Hang tag” y “High Gloss” como normalización de presentación, manteniendo la observación.

## Datos de contacto y medios

Correo, dirección, horario y URL de Facebook requieren validación. TikTok y YouTube aparecen en la hoja de contenido pero no están respaldados por el PDF. No se activan como enlaces comerciales finales en esta fase.

## Limitaciones del panel demostrativo

- El acceso `admin@djhonny.demo` / `Demo1234!` es únicamente didáctico. La sesión se guarda en `sessionStorage`; no ofrece seguridad real.
- Las ediciones del panel se guardan solo en `localStorage` del navegador actual; no se sincronizan entre dispositivos ni con Vercel.
- Las imágenes se seleccionan de los archivos existentes. No hay carga de archivos ni almacenamiento de imágenes en Base64.
- El botón “Restaurar catálogo original” descarta los cambios locales y vuelve a cargar los datos de `productos.js`.

## Auditoría de recursos y rutas

- Hay 22 archivos gráficos de producto/marca/canales; 17 familias tienen imagen directa y 3 familias no tienen foto específica.
- En la Fase 2, las tres familias sin imagen se muestran con un placeholder local de marca en CSS; no se reutiliza la fotografía de otro producto.
- No existe imagen de Instagram o YouTube pese a mostrarse en la referencia visual.
- Antes de incorporar tarjetas en la fase 2, verificar el soporte de `BOLSATSHIRT.avif` en los navegadores objetivo; se conserva el archivo original.
