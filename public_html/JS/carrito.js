// =============================================
// FUNCIONES BÁSICAS DEL CARRITO (localStorage)
// =============================================

function obtenerCarrito() {
    try {
        const carrito = localStorage.getItem("carrito");
        return carrito ? JSON.parse(carrito) : [];
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return [];
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        return true;
    } catch (error) {
        console.error("Error al guardar el carrito:", error);
        return false;
    }
}

function actualizarContadorCarrito() {
    const contador = document.querySelector(".contador-carrito");
    if (!contador) return;

    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((total, producto) => {
        return total + (parseInt(producto.cantidad) || 0);
    }, 0);

    contador.textContent = totalItems > 0 ? totalItems : "";
    contador.style.display = totalItems > 0 ? "inline-block" : "none";
}

// =============================================
// FUNCIONES PARA AGREGAR PRODUCTOS
// =============================================

function manejarAgregarAlCarrito(event) {
    const boton = event.target.closest(".boton-agregar");
    if (!boton) return;

    event.preventDefault();

    const producto = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: parseFloat(boton.dataset.precio) || 0,
        imagen: boton.dataset.imagen,
        cantidad: 1,
    };

    if (!producto.id || !producto.nombre || isNaN(producto.precio)) {
        console.error("Datos del producto inválidos:", producto);
        return;
    }

    const carrito = obtenerCarrito();
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad = (parseInt(productoExistente.cantidad) || 0) + 1;
    } else {
        carrito.push(producto);
    }

    if (guardarCarrito(carrito)) {
        actualizarContadorCarrito();
        alert(`${producto.nombre} se agregó al carrito 🛒`); 
    }
}

// =============================================
// FUNCIONES PARA LA PÁGINA DEL CARRITO
// =============================================

function renderizarCarrito() {
    const contenedor = document.querySelector(".productos-carrito");
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p class="carrito-vacio">No hay productos en el carrito</p>`;
        const totalElement = document.querySelector(".total");
        if (totalElement) totalElement.textContent = "S/0.00";
        return;
    }

    contenedor.innerHTML = carrito
        .map((producto) => {
            const precio = parseFloat(producto.precio) || 0;
            const cantidad = parseInt(producto.cantidad) || 1;
            const subtotal = precio * cantidad;
            const imagenSrc = producto.imagen || 'images/default.jpg';

            return `
                <article class="producto-carrito">
                    <img src="${imagenSrc}" 
                         alt="${producto.nombre || 'Producto'}"
                         onerror="this.src='images/default.jpg'">
                    <div class="info-producto-carrito">
                        <h3>${producto.nombre}</h3>
                        <p>Precio: S/${precio.toFixed(2)}</p>
                        <div class="cantidad-control">
                            <button class="decrease" data-id="${producto.id}">-</button>
                            <span>${cantidad}</span>
                            <button class="increase" data-id="${producto.id}">+</button>
                        </div>
                        <p>Subtotal: S/${subtotal.toFixed(2)}</p>
                    </div>
                    <button class="boton-eliminar" data-id="${producto.id}">🗑️ Eliminar</button>
                </article>
            `;
        })
        .join("");

    const total = carrito.reduce((sum, producto) => {
        const precio = parseFloat(producto.precio) || 0;
        const cantidad = parseInt(producto.cantidad) || 1;
        return sum + (precio * cantidad);
    }, 0);

    const totalElement = document.querySelector(".total");
    if (totalElement) {
        totalElement.textContent = `S/${total.toFixed(2)}`;
    }
}

function manejarEventosCarrito() {
    document.addEventListener("click", (event) => {
        const carrito = obtenerCarrito();

        if (event.target.classList.contains("increase")) {
            const id = event.target.dataset.id;
            const producto = carrito.find((item) => item.id === id);
            if (producto) {
                producto.cantidad = (parseInt(producto.cantidad) || 0) + 1;
                guardarCarrito(carrito);
                renderizarCarrito();
                actualizarContadorCarrito();
            }
        }

        if (event.target.classList.contains("decrease")) {
            const id = event.target.dataset.id;
            const producto = carrito.find((item) => item.id === id);
            if (producto) {
                const cantidadActual = parseInt(producto.cantidad) || 1;
                producto.cantidad = cantidadActual > 1 ? cantidadActual - 1 : 1;
                guardarCarrito(carrito);
                renderizarCarrito();
                actualizarContadorCarrito();
            }
        }

        if (event.target.classList.contains("boton-eliminar")) {
            const id = event.target.dataset.id;
            const nuevoCarrito = carrito.filter((item) => item.id !== id);
            guardarCarrito(nuevoCarrito);
            renderizarCarrito();
            actualizarContadorCarrito();
        }
    });
}

// =============================================
// FUNCIONES PARA PROCESO DE PAGO
// =============================================

function configurarBotonProcederPago() {
    const btnProcederPago = document.getElementById("proceder-pago");
    if (btnProcederPago) {
        btnProcederPago.addEventListener("click", function(e) {
            e.preventDefault();
            const carrito = obtenerCarrito();
            if (carrito.length === 0) {
                mostrarModal("El carrito está vacío. Agrega productos antes de proceder al pago.");
                return;
            }
            guardarCarrito(carrito);
            window.location.href = "proceso-pago.html";
        });
    }
}

function generarPedido(datosPago) {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) return null;

    const total = carrito.reduce((sum, producto) => {
        return sum + (producto.precio * producto.cantidad);
    }, 0);

    const pedido = {
        id: "PED-" + Date.now().toString().slice(-6),
        fecha: new Date().toISOString(),
        estado: "pendiente",
        productos: [...carrito],
        total: total,
        datosPago: datosPago,
        cupon: JSON.parse(localStorage.getItem("cuponAplicado")) || null,
    };

    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    localStorage.removeItem("carrito");
    localStorage.removeItem("cuponAplicado");
    actualizarContadorCarrito();

    return pedido;
}

function procesarPago(datosPago) {
    const pedido = generarPedido(datosPago);
    
    if (pedido) {
        mostrarModal(`Pedido #${pedido.id} generado con éxito. Redirigiendo...`);
        setTimeout(() => {
            window.location.href = `seguimiento-pedidos.html?pedido=${pedido.id}`;
        }, 2000);
        return true;
    }
    return false;
}

function mostrarModal(mensaje) {
    const modal = document.getElementById("modalMensaje");
    const textoModal = document.getElementById("textoModal");
    const btnCerrar = document.getElementById("cerrarModal");

    if (modal && textoModal) {
        textoModal.textContent = mensaje;
        modal.style.display = "flex";

        if (btnCerrar) {
            btnCerrar.addEventListener("click", () => {
                modal.style.display = "none";
            });
        }

        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
}

// =============================================
// INICIALIZACIÓN DEL CARRITO
// =============================================

function inicializarCarrito() {
    try {
        JSON.parse(localStorage.getItem("carrito"));
    } catch (e) {
        console.error("Datos corruptos en el carrito, reiniciando...");
        localStorage.removeItem("carrito");
    }

    document.addEventListener("click", manejarAgregarAlCarrito);

    if (document.querySelector(".productos-carrito")) {
        renderizarCarrito();
        manejarEventosCarrito();
        configurarBotonProcederPago();

        const btnVaciar = document.getElementById("vaciar-carrito");
        if (btnVaciar) {
            btnVaciar.addEventListener("click", () => {
                localStorage.removeItem("carrito");
                renderizarCarrito();
                actualizarContadorCarrito();
            });
        }
    }

    actualizarContadorCarrito();
}

// Iniciar cuando el DOM esté listo
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarCarrito);
} else {
    inicializarCarrito();
}

// Exportar funciones necesarias para otras páginas
window.obtenerCarrito = obtenerCarrito;
window.guardarCarrito = guardarCarrito;
window.procesarPago = procesarPago;
window.mostrarModal = mostrarModal;