//===========
//   Index
//===========

document.addEventListener("DOMContentLoaded", () => {
  // Carrusel
  const carrusel = document.querySelector('.productos-wrapper');

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

  // Quienes somos (sin cambios)
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
