document.addEventListener('DOMContentLoaded', function() {
    // Función para renderizar los productos en la tabla
    function renderizarProductosPago() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const tbody = document.querySelector('.tabla-resumen tbody');
        const tfoot = document.querySelector('.tabla-resumen tfoot td:last-child');
        
        // Limpiar tabla
        tbody.innerHTML = '';
        
        // Calcular total
        let total = 0;
        
        // Agregar cada producto
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>S/${subtotal.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
        
        // Actualizar total
        tfoot.textContent = `S/${total.toFixed(2)}`;
    }
    
    // Función para manejar cupones de descuento
    function configurarCuponDescuento() {
        const btnAplicarCupon = document.getElementById('aplicar-cupon');
        const inputCupon = document.getElementById('cupon');
        const mensajeCupon = document.getElementById('mensaje-cupon');
        
        if (btnAplicarCupon && inputCupon && mensajeCupon) {
            btnAplicarCupon.addEventListener('click', function() {
                const codigoCupon = inputCupon.value.trim();
                
                // Simulación de validación de cupón
                if (codigoCupon === 'DESCUENTO20') {
                    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
                    const total = carrito.reduce((sum, producto) => {
                        return sum + (producto.precio * producto.cantidad);
                    }, 0);
                    
                    const descuento = total * 0.2; // 20% de descuento
                    const totalConDescuento = total - descuento;
                    
                    // Guardar cupón aplicado
                    localStorage.setItem('cuponAplicado', JSON.stringify({
                        codigo: codigoCupon,
                        descuento: 20,
                        montoDescuento: descuento
                    }));
                    
                    // Actualizar total
                    document.querySelector('.tabla-resumen tfoot td:last-child').textContent = 
                        `S/${totalConDescuento.toFixed(2)} (Ahorras S/${descuento.toFixed(2)})`;
                    
                    mensajeCupon.textContent = '¡Cupón aplicado con éxito!';
                    mensajeCupon.style.color = 'green';
                } else {
                    mensajeCupon.textContent = 'Cupón no válido';
                    mensajeCupon.style.color = 'red';
                }
            });
        }
    }
    
    // Función para configurar eventos del formulario
    function configurarFormularioPago() {
        const metodoPago = document.getElementById('metodo-pago');
        const datosTarjeta = document.getElementById('datos-tarjeta');
        
        if (metodoPago && datosTarjeta) {
            metodoPago.addEventListener('change', function() {
                datosTarjeta.style.display = this.value === 'tarjeta' ? 'block' : 'none';
            });
        }
        
        const formularioPago = document.getElementById('formulario-pago');
        if (formularioPago) {
            formularioPago.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar datos
                const nombre = document.getElementById('nombre').value.trim();
                const email = document.getElementById('email').value.trim();
                const direccion = document.getElementById('direccion').value.trim();
                const metodo = document.getElementById('metodo-pago').value;
                
                if (!nombre || !email || !direccion || !metodo) {
                    if (typeof mostrarModal === 'function') {
                        mostrarModal('Por favor complete todos los campos obligatorios.');
                    } else {
                        alert('Por favor complete todos los campos obligatorios.');
                    }
                    return;
                }
                
                if (metodo === 'tarjeta') {
                    const tarjeta = document.getElementById('tarjeta').value.trim();
                    const vencimiento = document.getElementById('vencimiento').value.trim();
                    const cvv = document.getElementById('cvv').value.trim();
                    
                    if (!tarjeta || !vencimiento || !cvv) {
                        if (typeof mostrarModal === 'function') {
                            mostrarModal('Por favor complete todos los datos de la tarjeta.');
                        } else {
                            alert('Por favor complete todos los datos de la tarjeta.');
                        }
                        return;
                    }
                }
                
                // Procesar el pago
                const datosPago = {
                    nombre,
                    email,
                    direccion,
                    metodoPago: metodo,
                    fecha: new Date().toISOString()
                };
                
                // Verificar si la función procesarPago está disponible
                if (typeof procesarPago === 'function') {
                    procesarPago(datosPago);
                } else {
                    console.error('La función procesarPago no está disponible');
                    if (typeof mostrarModal === 'function') {
                        mostrarModal('Error al procesar el pago. Por favor intente nuevamente.');
                    } else {
                        alert('Error al procesar el pago. Por favor intente nuevamente.');
                    }
                }
            });
        }
    }
    
    // Inicializar
    renderizarProductosPago();
    configurarCuponDescuento();
    configurarFormularioPago();
});