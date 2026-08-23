/* Funcionalidades públicas. El catálogo puede reflejar la demostración local del panel. */
(() => {
  const store = window.CatalogoStore;
  const productos = (store ? store.obtener() : (window.CATALOGO_PRODUCTOS || [])).filter((producto) => producto.estado !== "Oculto");
  const categorias = store ? store.categorias() : (window.CATEGORIAS_PRODUCTO || []);
  const configuracion = window.CONFIGURACION_COMERCIAL || {};
  const baseImagenes = `${document.body.dataset.level || "."}/images`;
  const moneda = new Intl.NumberFormat("es-PE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const escapar = (valor) => String(valor ?? "").replace(/[&<>"]/g, (caracter) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[caracter]));
  const precio = (valor) => `S/ ${moneda.format(valor)}`;
  const rutaDetalle = (producto) => `producto.html?slug=${encodeURIComponent(producto.slug)}`;
  const imagenProducto = (producto, clase = "") => producto.imagenDisponible && producto.imagen
    ? `<img class="${clase}" src="${baseImagenes}/${producto.imagen}" alt="${escapar(producto.nombre)}" loading="lazy">`
    : `<div class="product-image-placeholder"><i class="bi bi-image" aria-hidden="true"></i><span>Imagen pendiente de entrega</span></div>`;
  const primerPrecio = (producto) => Object.values(producto.preciosTotalesPorLote || {}).flat().find((valor) => Number.isFinite(valor)) || producto.precioDesde;

  const tarjetaProducto = (producto, mostrarVistaRapida = true) => `
    <article class="product-card">
      <div class="product-card__media">
        ${imagenProducto(producto)}
        ${mostrarVistaRapida ? `<button class="quick-view-button" type="button" data-quick-slug="${escapar(producto.slug)}" data-bs-toggle="modal" data-bs-target="#quickViewModal" aria-label="Vista rápida: ${escapar(producto.nombre)}"><i class="bi bi-eye" aria-hidden="true"></i></button>` : ""}
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${escapar(producto.categoria)}</span>
        <h3 class="product-card__title">${escapar(producto.nombre)}</h3>
        <p class="product-card__description">${escapar(producto.descripcion)}</p>
        <div class="mt-auto"><span class="small text-secondary d-block">Desde</span><strong class="product-card__price">${precio(producto.precioDesde)}</strong><span class="small text-secondary"> · ${escapar(producto.cantidadMinima)} ${escapar(producto.unidad)}</span><p class="product-card__note mt-1 mb-3">Precio referencial por lote.</p><div class="d-flex gap-2"><a class="btn btn-brand btn-sm flex-grow-1" href="${rutaDetalle(producto)}">Ver opciones</a>${mostrarVistaRapida ? `<button class="btn btn-outline-secondary btn-sm" type="button" data-quick-slug="${escapar(producto.slug)}" data-bs-toggle="modal" data-bs-target="#quickViewModal" aria-label="Vista rápida de ${escapar(producto.nombre)}"><i class="bi bi-eye"></i></button>` : ""}</div></div>
      </div>
    </article>`;

  const renderDestacados = () => {
    const enlaceCatalogo = document.querySelector("[data-catalog-total]");
    if (enlaceCatalogo) enlaceCatalogo.textContent = `Ver los ${productos.length} productos`;
    const contenedor = document.querySelector("[data-featured-products]");
    if (!contenedor) return;
    const destacados = productos.filter((producto) => producto.destacado).filter((producto) => producto.imagenDisponible).slice(0, 6);
    contenedor.innerHTML = destacados.map((producto) => `<div class="col-sm-6 col-lg-4">${tarjetaProducto(producto, false)}</div>`).join("");
  };

  const renderCategorias = () => {
    const contenedor = document.querySelector("[data-category-links]");
    if (!contenedor) return;
    const iconos = ["bi-bag", "bi-recycle", "bi-box2-heart", "bi-sticky", "bi-t-shirt"];
    contenedor.innerHTML = categorias.map((categoria, indice) => `<div class="col-sm-6 col-lg"><a class="category-card" href="catalogo.html?categoria=${encodeURIComponent(categoria)}"><i class="bi ${iconos[indice] || "bi-grid"}" aria-hidden="true"></i><strong class="d-block mt-3">${escapar(categoria)}</strong><span class="small text-secondary">Ver productos</span></a></div>`).join("");
  };

  const renderCatalogo = () => {
    const grilla = document.querySelector("[data-catalog-grid]");
    if (!grilla) return;
    const filtros = document.querySelector("[data-category-filters]");
    const busqueda = document.querySelector("[data-catalog-search]");
    const contador = document.querySelector("[data-results-count]");
    const vacio = document.querySelector("[data-empty-results]");
    const parametros = new URLSearchParams(window.location.search);
    let categoriaActual = parametros.get("categoria") || "todos";
    let termino = "";

    filtros.innerHTML = [`<button class="filter-chip ${categoriaActual === "todos" ? "is-active" : ""}" type="button" data-category="todos">Todos</button>`, ...categorias.map((categoria) => `<button class="filter-chip ${categoriaActual === categoria ? "is-active" : ""}" type="button" data-category="${escapar(categoria)}">${escapar(categoria)}</button>`)].join("");

    const actualizar = () => {
      const coincidencias = productos.filter((producto) => {
        const coincideCategoria = categoriaActual === "todos" || producto.categoria === categoriaActual;
        const texto = `${producto.nombre} ${producto.descripcion} ${producto.categoria}`.toLocaleLowerCase("es");
        return coincideCategoria && texto.includes(termino);
      });
      grilla.innerHTML = coincidencias.map((producto) => `<div class="col-sm-6 col-xl-4">${tarjetaProducto(producto)}</div>`).join("");
      contador.textContent = `${coincidencias.length} ${coincidencias.length === 1 ? "producto encontrado" : "productos encontrados"}`;
      vacio.hidden = coincidencias.length > 0;
    };

    filtros.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-category]");
      if (!boton) return;
      categoriaActual = boton.dataset.category;
      filtros.querySelectorAll("[data-category]").forEach((elemento) => elemento.classList.toggle("is-active", elemento === boton));
      actualizar();
    });
    busqueda.addEventListener("input", () => { termino = busqueda.value.trim().toLocaleLowerCase("es"); actualizar(); });
    grilla.addEventListener("click", (evento) => {
      const boton = evento.target.closest("[data-quick-slug]");
      if (boton) mostrarVistaRapida(boton.dataset.quickSlug);
    });
    actualizar();
  };

  const mostrarVistaRapida = (slug) => {
    const producto = productos.find((item) => item.slug === slug);
    const cuerpo = document.querySelector("[data-quick-view-content]");
    if (!producto || !cuerpo) return;
    cuerpo.innerHTML = `<div class="row g-4 align-items-center"><div class="col-md-6"><div class="product-card__media rounded">${imagenProducto(producto)}</div></div><div class="col-md-6"><span class="product-card__category">${escapar(producto.categoria)}</span><h2 class="h3 mt-2">${escapar(producto.nombre)}</h2><p>${escapar(producto.descripcion)}</p><p class="mb-1">Cantidad mínima: <strong>${escapar(producto.cantidadMinima)} ${escapar(producto.unidad)}</strong></p><p class="mb-3">Desde <strong class="text-success">${precio(producto.precioDesde)}</strong> <span class="small text-secondary">por lote</span></p><a class="btn btn-brand" href="${rutaDetalle(producto)}">Ver opciones y cotizar</a></div></div>`;
  };

  const tablaPrecios = (producto) => Object.entries(producto.preciosTotalesPorLote || {}).map(([lote, importes]) => `<tr><td>${escapar(producto.variantes.join(" · "))}</td><td>${escapar(producto.medidas.join(" · "))}</td><td>${escapar(lote)}</td><td>${importes.map(precio).join(" · ")}</td></tr>`).join("");

  const renderDetalle = () => {
    const contenedor = document.querySelector("[data-product-detail]");
    if (!contenedor) return;
    const slug = new URLSearchParams(window.location.search).get("slug");
    const producto = productos.find((item) => item.slug === slug);
    if (!producto) {
      contenedor.innerHTML = `<div class="content-card text-center py-5"><i class="bi bi-search display-5 text-success" aria-hidden="true"></i><h1 class="h2 mt-3">Producto no encontrado</h1><p class="text-secondary">Revisa el enlace o vuelve al catálogo para explorar las familias disponibles.</p><a class="btn btn-brand" href="catalogo.html">Ir al catálogo</a></div>`;
      return;
    }
    document.title = `${producto.nombre} | Estampado D'Jhonny`;
    const lotes = Object.entries(producto.preciosTotalesPorLote || {});
    const observaciones = producto.observaciones.length ? `<section class="mt-4" aria-labelledby="observaciones-title"><h2 class="h5" id="observaciones-title">Observaciones de validación</h2><ul class="observation-list mb-0">${producto.observaciones.map((observacion) => `<li>${escapar(observacion)}</li>`).join("")}</ul></section>` : "";
    contenedor.innerHTML = `
      <div class="row g-4 g-lg-5"><div class="col-lg-6"><div class="detail-gallery">${imagenProducto(producto)}</div></div>
      <div class="col-lg-6"><span class="detail-category">${escapar(producto.categoria)}</span><h1 class="section-title mt-2">${escapar(producto.nombre)}</h1><p class="lead">${escapar(producto.descripcion)}</p><p><i class="bi bi-box-seam text-success me-2" aria-hidden="true"></i>Cantidad mínima: <strong>${escapar(producto.cantidadMinima)} ${escapar(producto.unidad)}</strong></p><div class="detail-price" data-selected-price>${precio(primerPrecio(producto))}</div><p class="small text-secondary">Importe total de lote de referencia; no es un precio unitario.</p>
      <form class="row g-3 mt-2" data-product-selector><div class="col-sm-6"><label class="form-label" for="detail-measure">Medida o presentación</label><select class="form-select" id="detail-measure" name="medida">${producto.medidas.map((medida) => `<option value="${escapar(medida)}">${escapar(medida)}</option>`).join("")}</select></div><div class="col-sm-6"><label class="form-label" for="detail-lot">Lote o cantidad</label><select class="form-select" id="detail-lot" name="lote">${lotes.map(([lote]) => `<option value="${escapar(lote)}">${escapar(lote)}</option>`).join("")}</select></div><div class="col-12"><label class="form-label" for="detail-price-option">Importe declarado</label><select class="form-select" id="detail-price-option" name="precio" data-price-options></select></div></form><p class="notice mt-3 mb-0">Precios referenciales por lote, sujetos a confirmación. Las tablas muestran los importes declarados en la fuente; confirme medida y acabado antes de comprar.</p>${observaciones}<a class="btn btn-brand mt-4" data-quote-link target="_blank" rel="noopener"><i class="bi bi-whatsapp me-1"></i>Solicitar cotización</a></div></div>
      <section class="content-section pb-0" aria-labelledby="price-table-title"><h2 class="section-title" id="price-table-title">Variantes y precios declarados</h2><div class="table-responsive mt-3"><table class="table detail-table"><thead><tr><th>Variantes</th><th>Medidas disponibles</th><th>Lote</th><th>Precios totales declarados</th></tr></thead><tbody>${tablaPrecios(producto)}</tbody></table></div></section>
      <section class="content-section pb-0" aria-labelledby="related-title"><h2 class="section-title" id="related-title">Productos relacionados</h2><div class="row g-3 mt-1" data-related-products></div></section>`;

    const selectorLote = contenedor.querySelector("#detail-lot");
    const selectorPrecio = contenedor.querySelector("[data-price-options]");
    const selectorMedida = contenedor.querySelector("#detail-measure");
    const precioVisual = contenedor.querySelector("[data-selected-price]");
    const enlaceCotizacion = contenedor.querySelector("[data-quote-link]");
    const sincronizar = () => {
      const valores = producto.preciosTotalesPorLote[selectorLote.value] || [];
      selectorPrecio.innerHTML = valores.map((valor) => `<option value="${valor}">${precio(valor)}</option>`).join("");
      precioVisual.textContent = precio(Number(selectorPrecio.value));
      const mensaje = `Hola, deseo cotizar: ${producto.nombre}. Medida/presentación: ${selectorMedida.value}. Lote: ${selectorLote.value}. Importe referencial consultado: ${precio(Number(selectorPrecio.value))}.`;
      enlaceCotizacion.href = `https://wa.me/${configuracion.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
    };
    selectorLote.addEventListener("change", sincronizar);
    selectorMedida.addEventListener("change", sincronizar);
    selectorPrecio.addEventListener("change", sincronizar);
    sincronizar();

    const relacionados = productos.filter((item) => item.categoria === producto.categoria && item.id !== producto.id).slice(0, 3);
    contenedor.querySelector("[data-related-products]").innerHTML = relacionados.map((item) => `<div class="col-sm-6 col-lg-4">${tarjetaProducto(item, false)}</div>`).join("");
  };

  const renderFormularioContacto = () => {
    const select = document.querySelector("[data-contact-products]");
    const formulario = document.querySelector("[data-quote-form]");
    const respuesta = document.querySelector("[data-form-feedback]");
    if (!select || !formulario || !respuesta) return;
    select.innerHTML = `<option value="" selected disabled>Selecciona un producto</option>${productos.map((producto) => `<option value="${escapar(producto.nombre)}">${escapar(producto.nombre)}</option>`).join("")}`;
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      formulario.classList.add("was-validated");
      if (!formulario.checkValidity()) return;
      const datos = new FormData(formulario);
      const mensaje = `Hola, soy ${datos.get("nombre")}. Deseo cotizar ${datos.get("producto")}. Cantidad: ${datos.get("cantidad")}. Teléfono: ${datos.get("telefono")}. Correo: ${datos.get("correo")}. Mensaje: ${datos.get("mensaje") || "Sin mensaje adicional"}.`;
      const enlace = `https://wa.me/${configuracion.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
      respuesta.hidden = false;
      respuesta.innerHTML = `<div class="alert alert-success" role="status"><strong>Datos listos para cotizar.</strong> No se guardó información en el sitio. <a class="form-feedback-link" href="${enlace}" target="_blank" rel="noopener">Continuar por WhatsApp</a> <span class="small d-block mt-1">El número de destino es configurable y está pendiente de validación comercial.</span></div>`;
      respuesta.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  renderDestacados();
  renderCategorias();
  renderCatalogo();
  renderDetalle();
  renderFormularioContacto();
})();
