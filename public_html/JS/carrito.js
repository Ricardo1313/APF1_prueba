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
        cantidad: 1,  // La cantidad siempre comienza en 1 al agregar un nuevo producto
    };

    // Validación más robusta
    if (!producto.id || !producto.nombre || isNaN(producto.precio)) {
        console.error("Datos del producto inválidos:", producto);
        return;
    }

    const carrito = obtenerCarrito();
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
        // Si el producto ya existe en el carrito, simplemente incrementamos la cantidad
        productoExistente.cantidad = (parseInt(productoExistente.cantidad) || 0) + 1;
    } else {
        // Si no existe, agregamos el producto al carrito con cantidad 1
        carrito.push(producto);
    }

    // Guardamos el carrito actualizado
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

    // Renderizado seguro con validación de datos
    contenedor.innerHTML = carrito
        .map((producto) => {
            // Debug: Verificar el producto completo
            console.log("Producto en carrito:", JSON.stringify(producto, null, 2));

            // Validación de datos
            const precio = parseFloat(producto.precio) || 0;
            const cantidad = parseInt(producto.cantidad) || 1;
            const subtotal = precio * cantidad;

            // Usamos la ruta completa de la imagen con fallback
            const imagenSrc = producto.imagen || 'images/default.jpg';

            // Debug: Verificar la ruta de imagen
            console.log(`Ruta de imagen para ${producto.nombre}:`, imagenSrc);

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

    // Debug: Verificar el carrito completo
    console.log("Carrito completo:", carrito);

    // Calcular total con validación
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

        // Aumentar cantidad con validación
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

        // Disminuir cantidad con validación
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

        // Eliminar producto
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
// INICIALIZACIÓN DEL CARRITO
// =============================================

function inicializarCarrito() {
    // Verificar si hay datos corruptos en localStorage
    try {
        JSON.parse(localStorage.getItem("carrito"));
    } catch (e) {
        console.error("Datos corruptos en el carrito, reiniciando...");
        localStorage.removeItem("carrito");
    }

    // Registrar eventos
    document.addEventListener("click", manejarAgregarAlCarrito);

    // Si estamos en la página del carrito
    if (document.querySelector(".productos-carrito")) {
        renderizarCarrito();
        manejarEventosCarrito();

        // Vaciar carrito
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
