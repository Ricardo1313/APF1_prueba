document.addEventListener('DOMContentLoaded', function() {
  // Obtener la categoría de la página (laptops, tablets o cables)
  const categoriaPagina = document.querySelector('main h2').textContent.toLowerCase()
                       .replace('accesorios para ', '').replace(' ', '-');
  
  // Elementos del DOM
  const btnAbrirFormulario = document.getElementById('btn-abrir-formulario');
  const crudFormulario = document.getElementById('crud-formulario');
  const formProducto = document.getElementById('form-producto');
  const listaAdmin = document.getElementById('productos-lista-admin');
  
  // Variables de estado
  const storageKey = `productos_${categoriaPagina}`;
  let productos = JSON.parse(localStorage.getItem(storageKey)) || [];
  let editando = false;

  // Mostrar/Ocultar formulario
  btnAbrirFormulario.addEventListener('click', function() {
    crudFormulario.style.display = crudFormulario.style.display === 'none' ? 'block' : 'none';
    if (crudFormulario.style.display === 'block') {
      cargarListaAdmin();
    }
  });

  // Cancelar edición
  document.getElementById('btn-cancelar').addEventListener('click', function() {
    formProducto.reset();
    editando = false;
    document.getElementById('producto-id').value = '';
  });

  // Guardar producto
  formProducto.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('producto-nombre').value;
    const precio = parseFloat(document.getElementById('producto-precio').value);
    const descripcion = document.getElementById('producto-descripcion').value;
    const imagen = document.getElementById('producto-imagen').value || 'imagenes/default-product.jpg';
    
    if (editando) {
      // Editar producto existente
      const index = productos.findIndex(p => p.id === id);
      productos[index] = { id, nombre, precio, descripcion, imagen, categoria: categoriaPagina };
    } else {
      // Crear nuevo producto
      const nuevoProducto = {
        id: Date.now().toString(),
        nombre,
        precio,
        descripcion,
        imagen,
        categoria: categoriaPagina // Añadimos la categoría al producto
      };
      productos.push(nuevoProducto);
    }
    
    // Guardar en LocalStorage (usando la clave de categoría)
    localStorage.setItem(storageKey, JSON.stringify(productos));
    
    // Resetear formulario
    formProducto.reset();
    editando = false;
    document.getElementById('producto-id').value = '';
    
    // Actualizar lista admin y vista principal
    cargarListaAdmin();
    actualizarVistaPrincipal();
    
    // Cerrar formulario
    crudFormulario.style.display = 'none';
  });

  // Cargar lista para administrar
  function cargarListaAdmin() {
    listaAdmin.innerHTML = '';
    
    productos.forEach(producto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${producto.nombre} - S/${producto.precio.toFixed(2)}</span>
        <div>
          <button class="btn-editar" data-id="${producto.id}">Editar</button>
          <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        </div>
      `;
      listaAdmin.appendChild(li);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        editarProducto(id);
      });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        eliminarProducto(id);
      });
    });
  }

  // Editar producto
  function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('producto-id').value = producto.id;
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-precio').value = producto.precio;
    document.getElementById('producto-descripcion').value = producto.descripcion;
    document.getElementById('producto-imagen').value = producto.imagen;
    
    editando = true;
    crudFormulario.style.display = 'block';
  }

  // Eliminar producto
  function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      productos = productos.filter(p => p.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(productos));
      cargarListaAdmin();
      actualizarVistaPrincipal();
    }
  }

  // Actualizar la vista principal de productos
  function actualizarVistaPrincipal() {
    const contenedor = document.querySelector('.categoria-productos') || 
                      document.querySelector('.grilla-productos');
    
    if (!contenedor) return;
    
    // Limpiar productos existentes (excepto los originales)
    const productosOriginales = Array.from(contenedor.querySelectorAll('.producto-detalle, .producto-grilla'))
                                   .filter(el => !el.hasAttribute('data-crud'));
    
    contenedor.innerHTML = '';
    productosOriginales.forEach(el => contenedor.appendChild(el));
    
    // Agregar solo los productos de esta categoría
    productos.forEach(producto => {
      // Verificar que el producto pertenece a esta categoría
      if (producto.categoria === categoriaPagina) {
        const esGrilla = contenedor.classList.contains('grilla-productos');
        
        const productoHTML = esGrilla ? `
          <div class="producto-grilla" data-crud="true">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">S/${producto.precio.toFixed(2)}</p>
            <p class="descripcion">${producto.descripcion}</p>
            <button class="boton-agregar"
               data-id="${producto.id}"
               data-nombre="${producto.nombre}"
               data-precio="${producto.precio}"
               data-imagen="${producto.imagen}">
               Agregar al Carrito
            </button>
          </div>
        ` : `
          <article class="producto-detalle" data-crud="true">
            <img src="${producto.imagen}" alt="${producto.nombre}"/>
            <div class="info-producto">
              <h3>${producto.nombre}</h3>
              <p class="precio">S/${producto.precio.toFixed(2)}</p>
              <p class="descripcion">${producto.descripcion}</p>
              <button class="boton-agregar"
                 data-id="${producto.id}"
                 data-nombre="${producto.nombre}"
                 data-precio="${producto.precio}"
                 data-imagen="${producto.imagen}">
                 Agregar al Carrito
              </button>
            </div>
          </article>
        `;
        
        contenedor.insertAdjacentHTML('beforeend', productoHTML);
      }
    });
    
    // Actualizar el buscador
    if (window.actualizarListaBusqueda) {
      window.actualizarListaBusqueda();
    }
  }

  // Inicializar
  actualizarVistaPrincipal();
});

// Función global para actualizar búsqueda (si existe)
window.actualizarListaBusqueda = function() {
  if (window.productos && window.buscarProductos) {
    window.productos = Array.from(document.querySelectorAll('.producto-detalle, .producto-grilla'));
  }
};