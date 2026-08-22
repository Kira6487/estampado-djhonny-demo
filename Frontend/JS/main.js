(() => {
  // Valor editable: el número figura como pendiente de validación comercial en Docs.
  window.CONFIGURACION_COMERCIAL = {
    whatsappNumero: "51932553357",
    whatsappPendienteValidacion: true
  };

  const level = document.body.dataset.level || "..";
  const isAdmin = document.body.dataset.area === "admin";
  const page = document.body.dataset.page || "inicio";
  const publicBase = `${level}/HTML`;
  const assetBase = `${level}/images`;
  const navLink = (id, href, label) => `<li class="nav-item"><a class="nav-link ${page === id ? "active" : ""}" ${page === id ? 'aria-current="page"' : ""} href="${href}">${label}</a></li>`;

  const header = document.querySelector("[data-site-header]");
  if (header && !isAdmin) {
    header.innerHTML = `
      <div class="topbar"><div class="container topbar__inner"><span><i class="bi bi-truck me-1"></i>Envíos a todo el Perú</span><span><i class="bi bi-whatsapp me-1"></i>932 553 357 <span class="contact-status">por validar</span></span></div></div>
      <header class="site-header"><nav class="navbar navbar-expand-lg navbar-dark"><div class="container">
        <a class="navbar-brand" href="${publicBase}/index.html" aria-label="Estampado D'Jhonny, Inicio"><img class="brand-logo" src="${assetBase}/djhonny-logo.jpg" alt="Logo Estampado D'Jhonny"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavigation" aria-controls="mainNavigation" aria-expanded="false" aria-label="Abrir navegación"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="mainNavigation"><ul class="navbar-nav ms-lg-auto align-items-lg-center">
          ${navLink("inicio", `${publicBase}/index.html`, "Inicio")}${navLink("catalogo", `${publicBase}/catalogo.html`, "Catálogo")}${navLink("servicios", `${publicBase}/index.html#servicios`, "Servicios")}${navLink("como-comprar", `${publicBase}/index.html#como-comprar`, "Cómo comprar")}${navLink("nosotros", `${publicBase}/index.html#nosotros`, "Nosotros")}${navLink("contacto", `${publicBase}/contacto.html`, "Contacto")}
        </ul><a class="btn btn-brand ms-lg-3 mt-2 mt-lg-0" href="${publicBase}/contacto.html"><i class="bi bi-whatsapp me-1"></i>Cotizar</a></div>
      </div></nav></header>`;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer && !isAdmin) {
    footer.innerHTML = `<footer class="site-footer"><div class="container"><div class="row g-4 align-items-center"><div class="col-md-3"><img class="footer-logo" src="${assetBase}/djhonny-logo.jpg" alt="Estampado D'Jhonny"></div><div class="col-md-5"><h2 class="h6 text-uppercase">Formas de pago confirmadas</h2><p class="mb-0 text-white-50">Yape · BCP · Interbank · BBVA · Scotiabank</p></div><div class="col-md-4"><h2 class="h6 text-uppercase">Navegación</h2><a class="me-3" href="${publicBase}/catalogo.html">Catálogo</a><a href="${publicBase}/contacto.html">Contacto</a></div></div><hr class="footer-divider"><p class="mb-0 small text-white-50">Precios referenciales por lote, sujetos a confirmación comercial. © <span data-current-year></span> Estampado D'Jhonny.</p></div></footer>`;
  }

  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
})();
