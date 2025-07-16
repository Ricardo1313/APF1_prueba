document.addEventListener("DOMContentLoaded", () => {

  //==================
  // Variables globales para el nav usuario y login
  //==================
  const navUsuario = document.getElementById('nav-usuario');
  const btnLogout = document.getElementById('btn-logout');
  const navLoginLi = document.getElementById('nav-login'); // ID que debe tener el <li> del login

  //==================
  // Carrusel de productos
  //==================
  const carrusel = document.querySelector('.productos-wrapper');
  if (carrusel) {
    const contenidoOriginal = carrusel.innerHTML;
    carrusel.innerHTML += contenidoOriginal;

    const leftArrow = document.createElement('button');
    const rightArrow = document.createElement('button');

    leftArrow.innerHTML = "&#10094;"; // Flecha izquierda
    rightArrow.innerHTML = "&#10095;"; // Flecha derecha

    leftArrow.classList.add('arrow', 'left-arrow');
    rightArrow.classList.add('arrow', 'right-arrow');

    carrusel.parentElement.appendChild(leftArrow);
    carrusel.parentElement.appendChild(rightArrow);

    let scrollSpeed = 1;
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

    // Aumentar velocidad al pasar mouse sobre flechas
    leftArrow.addEventListener('mouseenter', () => {
      stopAutoScroll();
      scrollSpeed = 2;
      startAutoScroll();
    });

    leftArrow.addEventListener('mouseleave', () => {
      stopAutoScroll();
      scrollSpeed = 1;
      startAutoScroll();
    });

    rightArrow.addEventListener('mouseenter', () => {
      stopAutoScroll();
      scrollSpeed = -2;
      startAutoScroll();
    });

    rightArrow.addEventListener('mouseleave', () => {
      stopAutoScroll();
      scrollSpeed = 1;
      startAutoScroll();
    });
  }

  //==================
  // Acordeón para sección Preguntas Frecuentes
  //==================
  const acordeons = document.querySelectorAll(".acordeon");
  acordeons.forEach(acordeon => {
    acordeon.addEventListener("click", function () {
      const respuesta = this.nextElementSibling;
      if (respuesta.style.display === "block") {
        respuesta.style.display = "none";
      } else {
        respuesta.style.display = "block";
      }
    });
  });

  //==================
  // Encuesta de satisfacción (prompt)
  //==================
  function obtenerSatisfaccion() {
    let respuesta = prompt("¿Te ha servido la sección de preguntas frecuentes? (Si/No)");
    if (respuesta && respuesta.toLowerCase() === "si") {
      alert("¡Gracias por tu comentario!");
    } else if (respuesta && respuesta.toLowerCase() === "no") {
      alert("Lamentamos no haberte podido ayudar, estamos trabajando para mejorar.");
    } else {
      alert("Respuesta no válida, por favor ingresa 'Si' o 'No'.");
    }
  }

  const encuestaBtn = document.getElementById("encuestaBtn");
  if (encuestaBtn) {
    encuestaBtn.addEventListener("click", obtenerSatisfaccion);
  }

  //==================
  // Redirección en sección "Quiénes Somos" al hacer click
  //==================
  const quienesSomos = document.querySelector('.trans-longitudes:last-of-type');
  if (quienesSomos) {
    quienesSomos.style.cursor = 'pointer';
    quienesSomos.addEventListener('click', () => {
      window.location.href = 'quienes-somos.html';
    });
  }

  //==================
  // Funciones para manejo de usuarios en localStorage
  //==================
  function obtenerUsuarios() {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  //==================
  // Login y Registro
  //==================
  const formLogin = document.querySelector('form[action="#"].form-login');
  const formRegistro = document.getElementById('formRegistro');

  // Registro de usuario
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = formRegistro.nombre.value.trim();
      const correo = formRegistro.correo.value.trim();
      const contrasena = formRegistro.contrasena.value.trim();
      const contrasena2 = formRegistro.contrasena2.value.trim();

      if (!nombre || !correo || !contrasena || !contrasena2) {
        mostrarModal('Por favor, complete todos los campos.');
        return;
      }

      if (contrasena !== contrasena2) {
        mostrarModal('Las contraseñas no coinciden.');
        return;
      }

      const usuarios = obtenerUsuarios();

      if (usuarios.some(u => u.correo === correo)) {
        mostrarModal('Este correo ya está registrado.');
        return;
      }

      usuarios.push({ nombre, correo, contrasena });
      guardarUsuarios(usuarios);

      mostrarModal('Registro exitoso. Redirigiendo al inicio de sesión...');
      formRegistro.reset();

      setTimeout(() => {
        modal.style.display = 'none';
        window.location.href = 'Inicio-Sesion.html';
      }, 2000);
    });
  }

  // Inicio de sesión
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
      const usuarioValido = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);

      if (usuarioValido) {
        mostrarModal('Inicio de sesión exitoso. ¡Bienvenido!');
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioValido));
        setTimeout(() => {
          modal.style.display = 'none';
          window.location.href = 'index.html';
        }, 2000);
      } else {
        mostrarModal('Correo o contraseña incorrectos.');
      }
    });
  }

  //==================
  // Mostrar usuario logueado en nav y manejar botón logout
  //==================
  function mostrarUsuarioEnNav() {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    if (usuarioLogueado) {
      navUsuario.style.display = 'inline-flex';
      document.getElementById('nombre-usuario').textContent = usuarioLogueado.nombre || usuarioLogueado.correo;
      if (navLoginLi) navLoginLi.style.display = 'none';
    } else {
      navUsuario.style.display = 'none';
      if (navLoginLi) navLoginLi.style.display = 'list-item';
    }
  }

  mostrarUsuarioEnNav();

  // Mostrar/Ocultar botón "Salir" al hacer click en el nombre de usuario
  navUsuario.addEventListener('click', () => {
    if (btnLogout.style.display === 'inline-block') {
      btnLogout.style.display = 'none';
    } else {
      btnLogout.style.display = 'inline-block';
    }
  });

  // Ocultar botón "Salir" si se hace click fuera del navUsuario
  document.addEventListener('click', (e) => {
    if (!navUsuario.contains(e.target)) {
      btnLogout.style.display = 'none';
    }
  });

  // Evento para cerrar sesión
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuarioLogueado');
    if (navLoginLi) navLoginLi.style.display = 'list-item';
    navUsuario.style.display = 'none';
  });

  //==================
  // Menú responsive para navegación
  //==================
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.getElementById("nav-list");
  const navLinks = navList?.querySelectorAll("a");

  if (menuToggle && navList && navLinks) {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.forEach(link => link.tabIndex = -1);

    menuToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

      navLinks.forEach(link => {
        link.tabIndex = isOpen ? 0 : -1;
      });
    });

    function onResize() {
      if (window.innerWidth > 768) {
        navList.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.forEach(link => link.tabIndex = 0);
      } else {
        navLinks.forEach(link => link.tabIndex = -1);
      }
    }
    window.addEventListener("resize", onResize);
    onResize();

    document.addEventListener("click", e => {
      if (
        window.innerWidth <= 768 &&
        navList.classList.contains("show") &&
        !navList.contains(e.target) &&
        e.target !== menuToggle
      ) {
        navList.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        navLinks.forEach(link => link.tabIndex = -1);
      }
    });
  }

});

 //==================
  // Rellenar Automaticamente Formularios
  //==================
document.addEventListener('DOMContentLoaded', () => {
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    if (usuarioLogueado) {
      const inputNombre = document.getElementById('nombre');
      const inputEmail = document.getElementById('email');

      if (inputNombre) inputNombre.value = usuarioLogueado.nombre || '';
      if (inputEmail) inputEmail.value = usuarioLogueado.correo || '';
    }
  });