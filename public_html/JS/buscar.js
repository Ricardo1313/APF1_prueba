document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const buscador = document.getElementById('buscador-productos');
  const btnBuscar = document.getElementById('btn-buscar');
  const btnLimpiar = document.getElementById('btn-limpiar');
  
  // Buscar el contenedor adecuado (priorizando .categoria-productos, luego .grilla-productos)
  const contenedorProductos = document.querySelector('.categoria-productos') || document.querySelector('.grilla-productos');
  
  // Buscar productos en ambas estructuras posibles
  const productos = Array.from(document.querySelectorAll('.producto-detalle, .producto-grilla'));
  
  // Mensaje para cuando no hay resultados
  const mensajeSinResultados = document.createElement('div');
  mensajeSinResultados.className = 'sin-resultados';
  mensajeSinResultados.textContent = 'No se encontraron productos con ese nombre.';
  
  // Función para buscar productos solo por nombre
  function buscarProductos(termino) {
    let resultados = 0;
    const terminoLower = termino.toLowerCase().trim();
    
    // Si el campo está vacío, mostrar todos los productos
    if (!terminoLower) {
      resetearBusqueda();
      return;
    }
    
    productos.forEach(producto => {
      // Buscar el título h3 en cualquier estructura
      const nombreElemento = producto.querySelector('h3');
      if (!nombreElemento) return;
      
      const nombre = nombreElemento.textContent.toLowerCase();
      
      if (nombre.includes(terminoLower)) {
        producto.style.display = producto.classList.contains('producto-detalle') ? 'block' : 'flex';
        resultados++;
      } else {
        producto.style.display = 'none';
      }
    });
    
    // Mostrar mensaje si no hay resultados
    if (resultados === 0) {
      if (!document.querySelector('.sin-resultados')) {
        contenedorProductos.appendChild(mensajeSinResultados);
      }
    } else {
      const mensajeExistente = document.querySelector('.sin-resultados');
      if (mensajeExistente) {
        mensajeExistente.remove();
      }
    }
    
    // Mostrar botón limpiar
    btnLimpiar.style.display = 'block';
  }
  
  // Función para resetear la búsqueda
  function resetearBusqueda() {
    buscador.value = '';
    productos.forEach(producto => {
      producto.style.display = producto.classList.contains('producto-detalle') ? 'block' : 'flex';
    });
    btnLimpiar.style.display = 'none';
    
    const mensajeExistente = document.querySelector('.sin-resultados');
    if (mensajeExistente) {
      mensajeExistente.remove();
    }
  }
  
  // Evento para el botón buscar
  btnBuscar.addEventListener('click', function() {
    buscarProductos(buscador.value);
  });
  
  // Evento para el input (buscar al escribir)
  buscador.addEventListener('input', function() {
    if (buscador.value.trim() === '') {
      resetearBusqueda();
    } else {
      buscarProductos(buscador.value);
    }
  });
  
  // Evento para el botón limpiar
  btnLimpiar.addEventListener('click', resetearBusqueda);
});