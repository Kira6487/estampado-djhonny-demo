/* Almacenamiento local de demostración. productos.js permanece inalterado como fuente inicial. */
(() => {
  const CLAVE = "djhonny_catalogo_demo_v1";
  let memoria = null;

  const clonar = (valor) => JSON.parse(JSON.stringify(valor));
  const esNumeroNoNegativo = (valor) => Number.isFinite(Number(valor)) && Number(valor) >= 0;
  const esProductoValido = (producto) => producto
    && typeof producto === "object"
    && typeof producto.id === "string"
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(producto.slug || "")
    && typeof producto.nombre === "string" && producto.nombre.trim().length > 0
    && typeof producto.categoria === "string" && producto.categoria.trim().length > 0
    && Number(producto.cantidadMinima) > 0
    && Array.isArray(producto.medidas)
    && Array.isArray(producto.variantes)
    && producto.preciosTotalesPorLote && typeof producto.preciosTotalesPorLote === "object"
    && Object.values(producto.preciosTotalesPorLote).every((precios) => Array.isArray(precios) && precios.length > 0 && precios.every(esNumeroNoNegativo));

  const esCatalogoValido = (productos) => Array.isArray(productos)
    && productos.length > 0
    && productos.every(esProductoValido)
    && new Set(productos.map((producto) => producto.slug)).size === productos.length;

  const origen = () => clonar(window.CATALOGO_PRODUCTOS || []).map((producto) => ({ ...producto, modificadoEn: null }));

  const leer = () => {
    try {
      const guardado = window.localStorage.getItem(CLAVE);
      if (!guardado) return null;
      const catalogo = JSON.parse(guardado);
      return esCatalogoValido(catalogo) ? catalogo : null;
    } catch (_) {
      return null;
    }
  };

  const guardar = (productos) => {
    if (!esCatalogoValido(productos)) throw new Error("El catálogo de demostración no es válido.");
    memoria = clonar(productos);
    try { window.localStorage.setItem(CLAVE, JSON.stringify(memoria)); } catch (_) { /* Fallback en memoria si el navegador bloquea localStorage. */ }
    window.dispatchEvent(new CustomEvent("catalogo:actualizado"));
    return clonar(memoria);
  };

  const obtener = () => {
    const guardado = leer();
    if (guardado) return clonar(guardado);
    if (memoria && esCatalogoValido(memoria)) return clonar(memoria);
    const inicial = origen();
    try { return guardar(inicial); } catch (_) { memoria = inicial; return clonar(inicial); }
  };

  const existeSlug = (slug, idActual = null) => obtener().some((producto) => producto.slug === slug && producto.id !== idActual);
  const fechaActual = () => new Date().toISOString();

  const crear = (producto) => {
    const catalogo = obtener();
    if (existeSlug(producto.slug)) throw new Error("El slug ya está en uso.");
    const nuevo = { ...producto, id: producto.id || `D${Date.now()}`, modificadoEn: fechaActual() };
    if (!esProductoValido(nuevo)) throw new Error("Completa los datos obligatorios del producto.");
    return guardar([...catalogo, nuevo]);
  };

  const actualizar = (id, cambios) => {
    const catalogo = obtener();
    const actual = catalogo.find((producto) => producto.id === id);
    if (!actual) throw new Error("El producto ya no existe.");
    const editado = { ...actual, ...cambios, id: actual.id, modificadoEn: fechaActual() };
    if (existeSlug(editado.slug, id)) throw new Error("El slug ya está en uso.");
    if (!esProductoValido(editado)) throw new Error("Completa los datos obligatorios del producto.");
    return guardar(catalogo.map((producto) => producto.id === id ? editado : producto));
  };

  const eliminar = (id) => {
    const catalogo = obtener();
    if (!catalogo.some((producto) => producto.id === id)) throw new Error("El producto ya no existe.");
    return guardar(catalogo.filter((producto) => producto.id !== id));
  };

  const restaurar = () => guardar(origen());
  const categorias = () => [...new Set(obtener().map((producto) => producto.categoria))].sort((a, b) => a.localeCompare(b, "es"));

  window.CatalogoStore = { CLAVE, obtener, crear, actualizar, eliminar, restaurar, categorias, esProductoValido };
})();
