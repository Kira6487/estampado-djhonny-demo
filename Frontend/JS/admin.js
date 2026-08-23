/* Panel administrativo de demostración: sesión local y CRUD en localStorage. */
(() => {
  const SESION_CLAVE = "djhonny_admin_demo_session_v1";
  const CREDENCIALES = { correo: "admin@djhonny.demo", contrasena: "Demo1234!", nombre: "Administrador demo" };
  const imagenes = ["BOLSAASAPARCHE.webp", "BOLSAASAPLUS.jpeg", "BOLSACRISTALX3.webp", "BOLSAKRAFTCONBASE.jpg", "BOLSAREUTILIZABLE.webp", "BOLSASBRILLOX1.jpg", "BOLSASPARAHIELO.jpg", "BOLSATERMICAX1.webp", "BOLSATERMICAX2.webp", "BOLSATSHIRT.avif", "CINTAS.webp", "ETIQUETASBORDADAS.jpeg", "HANG-TAG.webp", "KRAFTASASOGUILLA.jpeg", "POLERA.jpeg", "POLO.jpeg", "TARJETASPRESENTACION.jpg", "stickers.png"];
  const store = window.CatalogoStore;
  const baseImagenes = "../images";
  const escapar = (valor) => String(valor ?? "").replace(/[&<>"]/g, (caracter) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[caracter]));
  const moneda = (valor) => `S/ ${new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 }).format(Number(valor) || 0)}`;
  const slugificar = (texto) => String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const leerSesion = () => { try { return JSON.parse(sessionStorage.getItem(SESION_CLAVE)); } catch (_) { return null; } };
  const estaAutenticado = () => Boolean(leerSesion()?.correo === CREDENCIALES.correo);
  const redirigirLogin = () => { window.location.replace("login.html"); };
  const ocultarModal = (selector) => { if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(document.querySelector(selector)).hide(); };

  const iniciarLogin = () => {
    const formulario = document.querySelector("[data-login-form]");
    if (!formulario) return;
    const feedback = document.querySelector("[data-login-feedback]");
    const botonMostrar = document.querySelector("[data-toggle-password]");
    const campoContrasena = document.querySelector("#demo-password");
    if (estaAutenticado()) window.location.replace("index.html");
    botonMostrar.addEventListener("click", () => {
      const oculto = campoContrasena.type === "password";
      campoContrasena.type = oculto ? "text" : "password";
      botonMostrar.setAttribute("aria-label", oculto ? "Ocultar contraseña" : "Mostrar contraseña");
      botonMostrar.querySelector("i").className = oculto ? "bi bi-eye-slash" : "bi bi-eye";
    });
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();
      formulario.classList.add("was-validated");
      if (!formulario.checkValidity()) return;
      const correo = formulario.elements.correo.value.trim().toLowerCase();
      const contrasena = formulario.elements.contrasena.value;
      if (correo !== CREDENCIALES.correo || contrasena !== CREDENCIALES.contrasena) {
        feedback.innerHTML = "<div class=\"alert alert-danger mb-3\" role=\"alert\"><i class=\"bi bi-exclamation-circle me-1\"></i>Credenciales demostrativas incorrectas.</div>";
        return;
      }
      sessionStorage.setItem(SESION_CLAVE, JSON.stringify({ correo, nombre: CREDENCIALES.nombre, iniciadoEn: new Date().toISOString() }));
      feedback.innerHTML = "<div class=\"alert alert-success mb-3\" role=\"status\">Acceso demostrativo correcto. Redirigiendo…</div>";
      window.setTimeout(() => { window.location.replace("index.html"); }, 350);
    });
  };

  const iniciarSalida = () => document.querySelectorAll("[data-admin-logout]").forEach((boton) => boton.addEventListener("click", () => {
    sessionStorage.removeItem(SESION_CLAVE);
    redirigirLogin();
  }));

  const renderNavegacion = () => {
    const pagina = document.body.dataset.adminPage;
    document.querySelectorAll("[data-admin-nav]").forEach((contenedor) => {
      contenedor.innerHTML = `<div class="admin-nav-brand"><img class="brand-logo" src="${baseImagenes}/djhonny-logo.jpg" alt="Estampado D'Jhonny"><span>Panel demo</span></div><nav class="nav flex-column"><a class="nav-link ${pagina === "dashboard" ? "active" : ""}" href="index.html"><i class="bi bi-grid me-2"></i>Dashboard</a><a class="nav-link ${pagina === "productos" ? "active" : ""}" href="productos.html"><i class="bi bi-box-seam me-2"></i>Productos</a><span class="nav-link is-disabled"><i class="bi bi-tags me-2"></i>Categorías <small>Próximamente</small></span><span class="nav-link is-disabled"><i class="bi bi-chat-square-text me-2"></i>Cotizaciones <small>Próximamente</small></span><span class="nav-link is-disabled"><i class="bi bi-images me-2"></i>Galería <small>Próximamente</small></span></nav><a class="admin-back-link" href="../index.html"><i class="bi bi-box-arrow-up-right me-1"></i>Ver sitio público</a>`;
    });
  };

  const imagen = (producto) => producto.imagenDisponible && producto.imagen
    ? `<img class="admin-product-image" src="${baseImagenes}/${escapar(producto.imagen)}" alt="${escapar(producto.nombre)}">`
    : "<span class=\"admin-image-placeholder\"><i class=\"bi bi-image\"></i></span>";
  const badgeEstado = (producto) => producto.estado === "Oculto" ? "<span class=\"badge text-bg-secondary\">Oculto</span>" : "<span class=\"badge text-bg-success\">Publicado</span>";
  const fecha = (valor) => valor ? new Intl.DateTimeFormat("es-PE", { dateStyle: "short", timeStyle: "short" }).format(new Date(valor)) : "Original";
  const primerPrecio = (producto) => Number(producto.precioDesde ?? Object.values(producto.preciosTotalesPorLote || {}).flat()[0] ?? 0);
  const aviso = (mensaje, variante = "success") => {
    const zona = document.querySelector("[data-admin-toast-zone]");
    if (!zona) return;
    const id = `toast-${Date.now()}`;
    zona.insertAdjacentHTML("beforeend", `<div class="toast align-items-center text-bg-${variante} border-0" id="${id}" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body">${escapar(mensaje)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div></div>`);
    const elemento = document.querySelector(`#${id}`);
    if (window.bootstrap) { const toast = window.bootstrap.Toast.getOrCreateInstance(elemento, { delay: 3500 }); toast.show(); elemento.addEventListener("hidden.bs.toast", () => elemento.remove()); }
  };

  const renderDashboard = () => {
    const resumen = document.querySelector("[data-dashboard-summary]");
    if (!resumen || !store) return;
    const productos = store.obtener();
    const publicados = productos.filter((producto) => producto.estado !== "Oculto");
    const ocultos = productos.length - publicados.length;
    const sinImagen = productos.filter((producto) => !producto.imagenDisponible).length;
    const datos = [["Total de productos", productos.length, "bi-box-seam"], ["Publicados", publicados.length, "bi-eye"], ["Ocultos", ocultos, "bi-eye-slash"], ["Destacados", productos.filter((producto) => producto.destacado).length, "bi-star"], ["Categorías", store.categorias().length, "bi-tags"], ["Sin imagen real", sinImagen, "bi-image"]];
    resumen.innerHTML = datos.map(([titulo, valor, icono]) => `<div class="col-sm-6 col-xl-4"><article class="content-card admin-kpi h-100"><i class="bi ${icono} feature-icon" aria-hidden="true"></i><span class="d-block small text-secondary mt-2">${titulo}</span><strong class="d-block fs-2">${valor}</strong></article></div>`).join("");
    const porCategoria = document.querySelector("[data-category-summary]");
    porCategoria.innerHTML = store.categorias().map((categoria) => `<li class="d-flex justify-content-between gap-3"><span>${escapar(categoria)}</span><strong>${productos.filter((producto) => producto.categoria === categoria).length}</strong></li>`).join("");
    const recientes = document.querySelector("[data-recent-products]");
    const modificados = productos.filter((producto) => producto.modificadoEn).sort((a, b) => new Date(b.modificadoEn) - new Date(a.modificadoEn)).slice(0, 5);
    recientes.innerHTML = modificados.length ? modificados.map((producto) => `<li class="list-group-item d-flex justify-content-between align-items-center gap-3"><span><strong>${escapar(producto.nombre)}</strong><small class="d-block text-secondary">${escapar(producto.categoria)}</small></span><small>${fecha(producto.modificadoEn)}</small></li>`).join("") : "<li class=\"list-group-item text-secondary\">Aún no hay modificaciones en esta demostración.</li>";
  };

  const dividir = (valor) => String(valor || "").split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  const parsearPrecios = (valor) => {
    const resultado = {};
    for (const linea of String(valor || "").split("\n").map((item) => item.trim()).filter(Boolean)) {
      const [lote, importes] = linea.split(":");
      const valores = (importes || "").split(",").map((item) => Number(item.trim()));
      if (!lote?.trim() || !valores.length || valores.some((item) => !Number.isFinite(item) || item < 0)) return null;
      resultado[lote.trim()] = valores;
    }
    return Object.keys(resultado).length ? resultado : null;
  };
  const serializarPrecios = (precios) => Object.entries(precios || {}).map(([lote, importes]) => `${lote}: ${importes.join(", ")}`).join("\n");
  const filasVariantes = (variantes = []) => variantes.map((variante) => `<div class="input-group mb-2" data-variant-row><input class="form-control" data-variant-input value="${escapar(variante)}" aria-label="Variante"><button class="btn btn-outline-danger" type="button" data-remove-variant aria-label="Eliminar variante"><i class="bi bi-trash"></i></button></div>`).join("");

  const iniciarProductos = () => {
    const tabla = document.querySelector("[data-products-table]");
    if (!tabla || !store) return;
    const buscador = document.querySelector("[data-admin-search]");
    const filtroCategoria = document.querySelector("[data-admin-category]");
    const filtroEstado = document.querySelector("[data-admin-state]");
    const orden = document.querySelector("[data-admin-sort]");
    const contador = document.querySelector("[data-admin-results]");
    const vacio = document.querySelector("[data-admin-empty]");
    const paginacion = document.querySelector("[data-admin-pagination]");
    const modalProducto = document.querySelector("#productModal");
    const cuerpoModal = document.querySelector("[data-product-form-content]");
    const tituloModal = document.querySelector("[data-product-modal-title]");
    const confirmacion = document.querySelector("#confirmModal");
    const confirmacionTexto = document.querySelector("[data-confirm-text]");
    const confirmacionBoton = document.querySelector("[data-confirm-action]");
    let pagina = 1;
    let accionPendiente = null;
    const porPagina = 8;

    const llenarCategorias = () => {
      const actual = filtroCategoria.value;
      filtroCategoria.innerHTML = `<option value="">Todas las categorías</option>${store.categorias().map((categoria) => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join("")}`;
      filtroCategoria.value = store.categorias().includes(actual) ? actual : "";
    };
    const obtenerFiltrados = () => {
      const termino = buscador.value.trim().toLocaleLowerCase("es");
      const categoria = filtroCategoria.value;
      const estado = filtroEstado.value;
      const criterio = orden.value;
      const lista = store.obtener().filter((producto) => (!termino || `${producto.nombre} ${producto.descripcion} ${producto.slug}`.toLocaleLowerCase("es").includes(termino)) && (!categoria || producto.categoria === categoria) && (!estado || producto.estado === estado));
      return lista.sort((a, b) => criterio === "precio" ? primerPrecio(a) - primerPrecio(b) : criterio === "modificado" ? String(b.modificadoEn || "").localeCompare(String(a.modificadoEn || "")) : a.nombre.localeCompare(b.nombre, "es"));
    };
    const render = () => {
      llenarCategorias();
      const lista = obtenerFiltrados();
      const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
      pagina = Math.min(pagina, totalPaginas);
      const vista = lista.slice((pagina - 1) * porPagina, pagina * porPagina);
      tabla.innerHTML = vista.map((producto) => `<tr><td>${imagen(producto)}</td><td><strong>${escapar(producto.nombre)}</strong><small class="d-block text-secondary">${escapar(producto.slug)}</small></td><td>${escapar(producto.categoria)}</td><td>${moneda(primerPrecio(producto))}<small class="d-block text-secondary">por lote</small></td><td>${escapar(producto.cantidadMinima)} ${escapar(producto.unidad)}</td><td>${badgeEstado(producto)}</td><td>${producto.destacado ? "<i class=\"bi bi-star-fill text-warning\" aria-label=\"Destacado\"></i>" : "—"}</td><td><small>${fecha(producto.modificadoEn)}</small></td><td><div class="btn-group btn-group-sm"><button class="btn btn-outline-primary" type="button" data-edit="${escapar(producto.id)}" aria-label="Editar ${escapar(producto.nombre)}"><i class="bi bi-pencil"></i></button><button class="btn btn-outline-secondary" type="button" data-toggle-state="${escapar(producto.id)}" aria-label="${producto.estado === "Oculto" ? "Publicar" : "Ocultar"} ${escapar(producto.nombre)}"><i class="bi ${producto.estado === "Oculto" ? "bi-eye" : "bi-eye-slash"}"></i></button><button class="btn btn-outline-danger" type="button" data-delete="${escapar(producto.id)}" aria-label="Eliminar ${escapar(producto.nombre)}"><i class="bi bi-trash"></i></button></div></td></tr>`).join("");
      contador.textContent = `${lista.length} ${lista.length === 1 ? "resultado" : "resultados"}`;
      vacio.hidden = lista.length > 0;
      paginacion.innerHTML = totalPaginas > 1 ? `<button class="btn btn-sm btn-outline-secondary" type="button" data-page="${pagina - 1}" ${pagina === 1 ? "disabled" : ""}>Anterior</button><span class="small align-self-center">Página ${pagina} de ${totalPaginas}</span><button class="btn btn-sm btn-outline-secondary" type="button" data-page="${pagina + 1}" ${pagina === totalPaginas ? "disabled" : ""}>Siguiente</button>` : "";
    };

    const actualizarPreview = () => {
      const form = cuerpoModal.querySelector("form");
      if (!form) return;
      const nombre = form.elements.nombre.value || "Nombre del producto";
      const categoria = form.elements.categoria.value || "Categoría";
      const foto = form.elements.imagen.value;
      const preview = cuerpoModal.querySelector("[data-product-preview]");
      preview.innerHTML = `<div class="product-card"><div class="product-card__media">${foto ? `<img src="${baseImagenes}/${escapar(foto)}" alt="Vista previa de ${escapar(nombre)}">` : "<div class=\"product-image-placeholder\"><i class=\"bi bi-image\"></i><span>Sin imagen seleccionada</span></div>"}</div><div class="product-card__body"><span class="product-card__category">${escapar(categoria)}</span><h3 class="product-card__title">${escapar(nombre)}</h3><p class="product-card__note mb-0">Vista previa demostrativa.</p></div></div>`;
    };

    const abrirFormulario = (producto = null) => {
      const datos = producto || { nombre: "", slug: "", categoria: store.categorias()[0] || "", descripcion: "", cantidadMinima: 100, unidad: "unidades", imagen: null, estado: "Publicado", destacado: false, medidas: [], cantidades: [], variantes: ["Impresión personalizada"], preciosTotalesPorLote: { "100 unidades": [0] }, observaciones: [] };
      tituloModal.textContent = producto ? "Editar producto" : "Crear producto";
      cuerpoModal.innerHTML = `<form class="row g-3 needs-validation" data-product-form novalidate><input type="hidden" name="id" value="${escapar(producto?.id || "")}"><div class="col-md-7"><label class="form-label" for="product-name">Nombre</label><input class="form-control" id="product-name" name="nombre" value="${escapar(datos.nombre)}" required><div class="invalid-feedback">El nombre es obligatorio.</div></div><div class="col-md-5"><label class="form-label" for="product-slug">Slug</label><input class="form-control" id="product-slug" name="slug" value="${escapar(datos.slug)}" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" required><div class="invalid-feedback">Usa minúsculas, números y guiones.</div></div><div class="col-md-6"><label class="form-label" for="product-category">Categoría</label><select class="form-select" id="product-category" name="categoria" required>${store.categorias().map((categoria) => `<option value="${escapar(categoria)}" ${categoria === datos.categoria ? "selected" : ""}>${escapar(categoria)}</option>`).join("")}</select><div class="invalid-feedback">Selecciona una categoría.</div></div><div class="col-md-6"><label class="form-label" for="product-image">Imagen existente</label><select class="form-select" id="product-image" name="imagen"><option value="">Sin imagen / placeholder</option>${imagenes.map((archivo) => `<option value="${archivo}" ${archivo === datos.imagen ? "selected" : ""}>${archivo}</option>`).join("")}</select></div><div class="col-12"><label class="form-label" for="product-description">Descripción</label><textarea class="form-control" id="product-description" name="descripcion" rows="3" required>${escapar(datos.descripcion)}</textarea><div class="invalid-feedback">La descripción es obligatoria.</div></div><div class="col-md-4"><label class="form-label" for="product-minimum">Cantidad mínima</label><input class="form-control" id="product-minimum" name="cantidadMinima" type="number" min="1" value="${escapar(datos.cantidadMinima)}" required><div class="invalid-feedback">Ingresa una cantidad mayor que cero.</div></div><div class="col-md-4"><label class="form-label" for="product-unit">Unidad</label><input class="form-control" id="product-unit" name="unidad" value="${escapar(datos.unidad)}" required></div><div class="col-md-4"><label class="form-label" for="product-state">Estado</label><select class="form-select" id="product-state" name="estado"><option value="Publicado" ${datos.estado !== "Oculto" ? "selected" : ""}>Publicado</option><option value="Oculto" ${datos.estado === "Oculto" ? "selected" : ""}>Oculto</option></select></div><div class="col-md-6"><label class="form-label" for="product-measures">Medidas</label><textarea class="form-control" id="product-measures" name="medidas" rows="3" placeholder="Una por línea o separadas por coma" required>${escapar(datos.medidas.join("\n"))}</textarea><div class="invalid-feedback">Incluye al menos una medida o presentación.</div></div><div class="col-md-6"><label class="form-label" for="product-quantities">Cantidades</label><textarea class="form-control" id="product-quantities" name="cantidades" rows="3" placeholder="100, 500, 1000" required>${escapar(datos.cantidades.filter((cantidad) => cantidad != null).join(", "))}</textarea><div class="invalid-feedback">Incluye cantidades válidas.</div></div><div class="col-12"><div class="d-flex justify-content-between align-items-center"><label class="form-label mb-0">Variantes</label><button class="btn btn-sm btn-outline-secondary" type="button" data-add-variant><i class="bi bi-plus-lg"></i> Añadir variante</button></div><div class="mt-2" data-variant-list>${filasVariantes(datos.variantes)}</div><div class="invalid-feedback d-block" data-variant-error hidden>Completa todas las variantes o elimínalas.</div></div><div class="col-12"><label class="form-label" for="product-prices">Precios totales por lote</label><textarea class="form-control font-monospace" id="product-prices" name="precios" rows="4" required placeholder="100 unidades: 94, 95\n500 unidades: 120">${escapar(serializarPrecios(datos.preciosTotalesPorLote))}</textarea><div class="form-text">Una línea por lote: <code>Lote: precio, precio</code>. Los importes son totales, no unitarios.</div><div class="invalid-feedback" data-price-error>Incluye lotes y precios iguales o mayores que cero.</div></div><div class="col-12"><div class="form-check"><input class="form-check-input" type="checkbox" id="product-featured" name="destacado" ${datos.destacado ? "checked" : ""}><label class="form-check-label" for="product-featured">Producto destacado</label></div></div><div class="col-lg-6"><h3 class="h6">Vista previa</h3><div data-product-preview></div></div><div class="col-lg-6 d-flex align-items-end justify-content-end gap-2"><button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">Cancelar</button><button class="btn btn-brand" type="submit">${producto ? "Guardar cambios" : "Crear producto"}</button></div></form>`;
      const form = cuerpoModal.querySelector("form");
      let slugAutomatico = !producto;
      form.elements.nombre.addEventListener("input", () => { if (slugAutomatico) form.elements.slug.value = slugificar(form.elements.nombre.value); actualizarPreview(); });
      form.elements.slug.addEventListener("input", () => { slugAutomatico = false; });
      form.querySelectorAll("input, select, textarea").forEach((campo) => campo.addEventListener("input", actualizarPreview));
      form.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-add-variant]")) { form.querySelector("[data-variant-list]").insertAdjacentHTML("beforeend", filasVariantes([""])); return; }
        const eliminarVariante = evento.target.closest("[data-remove-variant]");
        if (eliminarVariante) eliminarVariante.closest("[data-variant-row]").remove();
      });
      form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        form.classList.add("was-validated");
        const variantes = [...form.querySelectorAll("[data-variant-input]")].map((campo) => campo.value.trim());
        const precios = parsearPrecios(form.elements.precios.value);
        const cantidades = dividir(form.elements.cantidades.value).map(Number);
        const variantError = form.querySelector("[data-variant-error]");
        const priceError = form.querySelector("[data-price-error]");
        variantError.hidden = variantes.length === 0 || variantes.every(Boolean);
        priceError.style.display = precios ? "none" : "block";
        if (!form.checkValidity() || !variantes.length || variantes.some((variante) => !variante) || !precios || cantidades.some((cantidad) => !Number.isFinite(cantidad) || cantidad <= 0)) return;
        const foto = form.elements.imagen.value || null;
        const payload = { nombre: form.elements.nombre.value.trim(), slug: slugificar(form.elements.slug.value), categoria: form.elements.categoria.value, descripcion: form.elements.descripcion.value.trim(), cantidadMinima: Number(form.elements.cantidadMinima.value), unidad: form.elements.unidad.value.trim(), imagen: foto, imagenDisponible: Boolean(foto), estado: form.elements.estado.value, destacado: form.elements.destacado.checked, medidas: dividir(form.elements.medidas.value), cantidades, variantes, preciosTotalesPorLote: precios, precioDesde: Math.min(...Object.values(precios).flat()), observaciones: producto?.observaciones || [] };
        try { producto ? store.actualizar(producto.id, payload) : store.crear(payload); ocultarModal("#productModal"); aviso(producto ? "Producto actualizado." : "Producto creado."); pagina = 1; render(); } catch (error) { priceError.textContent = error.message; priceError.style.display = "block"; }
      });
      actualizarPreview();
      if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(modalProducto).show();
    };

    document.querySelector("[data-create-product]").addEventListener("click", () => abrirFormulario());
    [buscador, filtroCategoria, filtroEstado, orden].forEach((control) => control.addEventListener(control === buscador ? "input" : "change", () => { pagina = 1; render(); }));
    tabla.addEventListener("click", (evento) => {
      const producto = store.obtener().find((item) => item.id === (evento.target.closest("[data-edit],[data-toggle-state],[data-delete]")?.dataset.edit || evento.target.closest("[data-edit],[data-toggle-state],[data-delete]")?.dataset.toggleState || evento.target.closest("[data-edit],[data-toggle-state],[data-delete]")?.dataset.delete));
      const boton = evento.target.closest("[data-edit],[data-toggle-state],[data-delete]");
      if (!boton || !producto) return;
      if (boton.dataset.edit) abrirFormulario(producto);
      if (boton.dataset.toggleState) { store.actualizar(producto.id, { ...producto, estado: producto.estado === "Oculto" ? "Publicado" : "Oculto" }); aviso(producto.estado === "Oculto" ? "Producto publicado." : "Producto ocultado."); render(); }
      if (boton.dataset.delete) { accionPendiente = () => { store.eliminar(producto.id); aviso("Producto eliminado.", "danger"); render(); }; confirmacionTexto.textContent = `Eliminarás “${producto.nombre}” de esta demostración.`; confirmacionBoton.textContent = "Eliminar producto"; confirmacionBoton.className = "btn btn-danger"; if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(confirmacion).show(); }
    });
    paginacion.addEventListener("click", (evento) => { const boton = evento.target.closest("[data-page]"); if (boton && !boton.disabled) { pagina = Number(boton.dataset.page); render(); } });
    document.querySelector("[data-restore-catalog]").addEventListener("click", () => { accionPendiente = () => { store.restaurar(); aviso("Catálogo original restaurado."); pagina = 1; render(); }; confirmacionTexto.textContent = "Se eliminarán los cambios locales de demostración y se restaurará el catálogo inicial."; confirmacionBoton.textContent = "Restaurar catálogo"; confirmacionBoton.className = "btn btn-brand"; if (window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(confirmacion).show(); });
    confirmacionBoton.addEventListener("click", () => { if (accionPendiente) accionPendiente(); accionPendiente = null; ocultarModal("#confirmModal"); });
    window.addEventListener("catalogo:actualizado", render);
    render();
  };

  const iniciarAdmin = () => {
    if (document.body.dataset.adminPage && !estaAutenticado()) { redirigirLogin(); return; }
    renderNavegacion();
    iniciarSalida();
    renderDashboard();
    iniciarProductos();
  };

  window.AdminDemoAuth = { CREDENCIALES, estaAutenticado, cerrarSesion: () => { sessionStorage.removeItem(SESION_CLAVE); } };
  iniciarLogin();
  iniciarAdmin();
})();
