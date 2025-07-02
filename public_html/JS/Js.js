document.addEventListener("DOMContentLoaded", () => {
  // Carrusel
  const carrusel = document.querySelector('.productos-wrapper');
  // Acordeón para Preguntas Frecuentes
  const acordeons = document.querySelectorAll(".acordeon");

  acordeons.forEach(acordeon => {
    acordeon.addEventListener("click", function () {
      const respuesta = this.nextElementSibling;

      // Alternar la visibilidad de la respuesta
      if (respuesta.style.display === "block") {
        respuesta.style.display = "none";
      } else {
        respuesta.style.display = "block";
      }
    });
  });

  // Función para mostrar mensaje de satisfacción
  function obtenerSatisfaccion() {
    let respuesta = prompt("¿Te ha servido la sección de preguntas frecuentes? (Si/No)");

    if (respuesta.toLowerCase() === "si") {
      alert("¡Gracias por tu comentario!");
    } else if (respuesta.toLowerCase() === "no") {
      alert("Lamentamos no haberte podido ayudar, estamos trabajando para mejorar.");
    } else {
      alert("Respuesta no válida, por favor ingresa 'Si' o 'No'.");
    }
  }

  // Asignar función a la encuesta de satisfacción
  const encuestaBtn = document.getElementById("encuestaBtn"); // Seleccionamos el botón por ID
  if (encuestaBtn) {
    encuestaBtn.addEventListener("click", obtenerSatisfaccion); // Asignamos el evento
  }


  if (carrusel) {
    // Duplicar contenido para efecto infinito
    const contenidoOriginal = carrusel.innerHTML;
    carrusel.innerHTML += contenidoOriginal;

    const leftArrow = document.createElement('button');
    const rightArrow = document.createElement('button');

    leftArrow.innerHTML = "&#10094;";  // flecha izquierda
    rightArrow.innerHTML = "&#10095;"; // flecha derecha

    leftArrow.classList.add('arrow', 'left-arrow');
    rightArrow.classList.add('arrow', 'right-arrow');

    carrusel.parentElement.appendChild(leftArrow);
    carrusel.parentElement.appendChild(rightArrow);

    let scrollSpeed = 1;  // velocidad positiva = derecha
    let animationFrameId;

    function smoothScroll() {
      carrusel.scrollLeft += scrollSpeed;

      const scrollMax = carrusel.scrollWidth / 2;

      if (scrollSpeed > 0 && carrusel.scrollLeft >= scrollMax) {
        carrusel.scrollLeft = carrusel.scrollLeft - scrollMax;
      } else if (scrollSpeed < 0 && carrusel.scrollLeft <= 0) {
        carrusel.scrollLeft = scrollMax + carrusel.scrollLeft;
      }

      animationFrameId = requestAnimationFrame(smoothScroll);
    }

    function startAutoScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(smoothScroll);
      }
    }

    function stopAutoScroll() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    startAutoScroll();

    leftArrow.addEventListener('mouseenter', () => {
      stopAutoScroll();
      scrollSpeed = 2;  // izquierda rápido
      startAutoScroll();
    });

    leftArrow.addEventListener('mouseleave', () => {
      stopAutoScroll();
      scrollSpeed = 1;  // derecha lento
      startAutoScroll();
    });

    rightArrow.addEventListener('mouseenter', () => {
      stopAutoScroll();
      scrollSpeed = -2;  // derecha rápido
      startAutoScroll();
    });

    rightArrow.addEventListener('mouseleave', () => {
      stopAutoScroll();
      scrollSpeed = 1;  // derecha lento
      startAutoScroll();
    });
  }

  // Quienes somos 
  const quienesSomos = document.querySelector('.trans-longitudes:last-of-type');
  if (quienesSomos) {
    quienesSomos.style.cursor = 'pointer';
    quienesSomos.addEventListener('click', () => {
      window.location.href = 'quienes-somos.html';
    });
  }

  // Elementos modal (comunes para login, registro y recuperación)
  const modal = document.getElementById('modalMensaje');
  const textoModal = document.getElementById('textoModal');
  const btnCerrar = document.getElementById('cerrarModal');

  function mostrarModal(mensaje) {
    textoModal.textContent = mensaje;
    modal.style.display = 'flex';
  }

  btnCerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Mostrar/Ocultar formulario recuperación
  const formRecuperacion = document.getElementById('recuperacion-contrasena');
  const btnMostrarRecuperacion = document.getElementById('mostrar-recuperacion');
  btnMostrarRecuperacion?.addEventListener('click', (e) => {
    e.preventDefault();
    if (formRecuperacion.style.display === 'none' || formRecuperacion.style.display === '') {
      formRecuperacion.style.display = 'block';
    } else {
      formRecuperacion.style.display = 'none';
    }
  });

  // Validar formulario de recuperación
  if (formRecuperacion) {
    const formRecuperacionForm = formRecuperacion.querySelector('form');
    formRecuperacionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const correoRecuperar = formRecuperacionForm['correo-recuperar'].value.trim();

      if (!correoRecuperar) {
        mostrarModal('Ingrese su correo para recuperar la contraseña.');
        return;
      }

      mostrarModal('Se ha enviado un correo de recuperación a ' + correoRecuperar);
      formRecuperacion.style.display = 'none';
      formRecuperacionForm.reset();
    });
  }

  //======================
  //   Login y Registro
  //======================

  // Función para obtener usuarios guardados en localStorage
  function obtenerUsuarios() {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  // Función para guardar usuarios en localStorage
  function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  // Forms
  const formLogin = document.querySelector('form[action="#"].form-login'); // para login
  const formRegistro = document.getElementById('formRegistro'); // para registro, usando id para mayor seguridad

  // Si existe form de registro
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const correo = formRegistro.correo.value.trim();
      const contrasena = formRegistro.contrasena.value.trim();
      const contrasena2 = formRegistro.contrasena2.value.trim();

      if (!correo || !contrasena || !contrasena2) {
        mostrarModal('Por favor, complete todos los campos.');
        return;
      }

      if (contrasena !== contrasena2) {
        mostrarModal('Las contraseñas no coinciden.');
        return;
      }

      const usuarios = obtenerUsuarios();

      // Verificar si el correo ya existe
      if (usuarios.some(u => u.correo === correo)) {
        mostrarModal('Este correo ya está registrado.');
        return;
      }

      // Agregar nuevo usuario
      usuarios.push({ correo, contrasena });
      guardarUsuarios(usuarios);

      mostrarModal('Registro exitoso. Redirigiendo al inicio de sesión...');
      formRegistro.reset();

      console.log('Registro exitoso, preparando redireccion...');

      setTimeout(() => {
        modal.style.display = 'none';
        window.location.href = 'Inicio-Sesion.html';
      }, 2000);
    });
  }

  // Si existe form de login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const correo = formLogin.correo.value.trim();
      const contrasena = formLogin.contrasena.value.trim();

      if (!correo || !contrasena) {
        mostrarModal('Por favor, complete ambos campos.');
        return;
      }

      const usuarios = obtenerUsuarios();

      // Validar usuario
      const usuarioValido = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

      if (usuarioValido) {
        mostrarModal('Inicio de sesión exitoso. ¡Bienvenido!');
        setTimeout(() => {
          modal.style.display = 'none';
          window.location.href = 'index.html';
        }, 2000);
      } else {
        mostrarModal('Correo o contraseña incorrectos.');
      }
    });
  }

});

  //======================
  //  Quienes somos'
  //======================


document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const navList = document.querySelector("nav ul");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = navList.querySelectorAll("a");


  // Función para configurar el ARIA y accesibilidad del menú
  function setupAccessibility() {
    menuToggle.setAttribute("aria-controls", navList.id || "nav-list");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú principal");
    navList.setAttribute("role", "menu");
    navLinks.forEach(link => {
      link.setAttribute("role", "menuitem");
      link.tabIndex = -1;
    });
  }

  // Inicializa estilos y accesibilidad
  setupAccessibility();

  // Función para manejar el toggle del menú en mobile
  function toggleMenu() {
    const isOpen = navList.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    // Controla tabIndex para accesibilidad
    navLinks.forEach(link => {
      link.tabIndex = isOpen ? 0 : -1;
    });
  }

  // Evento click hamburguesa
  menuToggle.addEventListener("click", toggleMenu);

  // Función que ajusta tabIndex y menú al redimensionar pantalla
  function onResize() {
    if (window.innerWidth > 768) {
      navList.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.forEach(link => link.tabIndex = 0);
    } else {
      // En móvil, si el menú no está abierto, links no tabulan
      if (!navList.classList.contains("show")) {
        navLinks.forEach(link => link.tabIndex = -1);
      }
    }
  }

  // Llama al cargar y en resize
  onResize();
  window.addEventListener("resize", onResize);

  // Cierra menú si se hace click fuera (opcional)
  document.addEventListener("click", e => {
    if (
      window.innerWidth <= 768 &&
      navList.classList.contains("show") &&
      !navList.contains(e.target) &&
      e.target !== menuToggle
    ) {
      toggleMenu();
    }
  });

});

////RICARDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
// Función para manejar el botón "Proceder al pago"
function configurarBotonPago() {
  const btnProcederPago = document.getElementById('proceder-pago');
  if (btnProcederPago) {
    btnProcederPago.addEventListener('click', function(e) {
      e.preventDefault();
      const carrito = obtenerCarrito();
      if (carrito.length === 0) {
        mostrarModal('El carrito está vacío. Agrega productos antes de proceder al pago.');
        return;
      }
      // Guardar el carrito actual en localStorage
      guardarCarrito(carrito);
      // Redirigir a la página de proceso de pago
      window.location.href = 'proceso-pago.html';
    });
  }
}

// Llamar a esta función en inicializarCarrito()
function inicializarCarrito() {
  // ... código existente ...
  configurarBotonPago();
}

// Función para buscar pedidos (usar en seguimiento-pedidos.html)
function buscarPedido(idPedido) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    
    if (!idPedido) {
        // Buscar en URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        idPedido = urlParams.get('pedido');
    }

    if (idPedido) {
        const pedido = pedidos.find(p => p.id === idPedido);
        mostrarResultadoPedido(pedido);
        return pedido;
    }
    return null;
}

// Mostrar resultado en la página
function mostrarResultadoPedido(pedido) {
    const resultadoDiv = document.getElementById('resultado-pedido');
    
    if (!pedido) {
        resultadoDiv.innerHTML = `
            <div class="pedido-no-encontrado">
                <i class="fas fa-times-circle fa-3x"></i>
                <h3>Pedido no encontrado</h3>
                <p>Verifica el número e intenta nuevamente</p>
            </div>
        `;
        return;
    }

    resultadoDiv.innerHTML = `
        <div class="pedido-encontrado">
            <h3>Pedido #${pedido.id}</h3>
            <p class="fecha"><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString()}</p>
            <p class="estado"><strong>Estado:</strong> <span class="${pedido.estado}">${pedido.estado.toUpperCase()}</span></p>
            
            <div class="productos-pedido">
                <h4>Productos:</h4>
                ${pedido.productos.map(producto => `
                    <div class="producto">
                        <p>${producto.nombre} - Cantidad: ${producto.cantidad}</p>
                        <p class="precio">S/${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    </div>
                `).join('')}
            </div>
            
            ${pedido.cupon ? `
                <div class="cupon-aplicado">
                    <p><strong>Cupón aplicado:</strong> ${pedido.cupon.codigo} (${pedido.cupon.descuento}% de descuento)</p>
                </div>
            ` : ''}
            
            <div class="total-pedido">
                <p><strong>Total:</strong> <span>S/${pedido.total.toFixed(2)}</span></p>
            </div>
        </div>
    `;
}

// Inicializar búsqueda al cargar la página
if (document.getElementById('resultado-pedido')) {
    document.getElementById('buscar-pedido').addEventListener('click', () => {
        const numeroPedido = document.getElementById('numero-pedido').value.trim();
        buscarPedido(numeroPedido);
    });

    // Buscar automáticamente si hay parámetro en URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('pedido')) {
        buscarPedido();
    }
}
