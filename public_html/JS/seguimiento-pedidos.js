document.addEventListener('DOMContentLoaded', function() {
    // Función para formatear fecha
    function formatearFecha(fechaISO) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaISO).toLocaleDateString('es-PE', opciones);
    }

    // Función para determinar clase CSS según estado
    function obtenerClaseEstado(estado) {
        switch(estado.toLowerCase()) {
            case 'pendiente': return 'estado-pendiente';
            case 'enviado': return 'estado-enviado';
            case 'completado': return 'estado-completado';
            case 'cancelado': return 'estado-cancelado';
            default: return 'estado-pendiente';
        }
    }

    // Función para renderizar los pedidos
    function renderizarPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
        const contenedor = document.getElementById('lista-pedidos');
        
        if (pedidos.length === 0) {
            contenedor.innerHTML = `
                <div class="pedido-vacio">
                    <i class="fas fa-box-open fa-3x"></i>
                    <h3>Aún no tienes pedidos</h3>
                    <p>Cuando realices un pedido, aparecerá aquí con todos sus detalles.</p>
                    <a href="index.html" class="boton">Ir a comprar</a>
                </div>
            `;
            return;
        }

        // Ordenar pedidos por fecha (más reciente primero)
        pedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        contenedor.innerHTML = pedidos.map((pedido, index) => {
            const numeroPedido = (index + 1).toString().padStart(3, '0');
            const claseEstado = obtenerClaseEstado(pedido.estado);
            
            return `
                <article class="pedido-card">
                    <div class="pedido-header">
                        <h3>Pedido #${numeroPedido}</h3>
                        <span class="fecha-pedido">${formatearFecha(pedido.fecha)}</span>
                        <button class="boton-estado ${claseEstado}">${pedido.estado.toUpperCase()}</button>
                    </div>
                    
                    <div class="pedido-detalle">
                        <h4>Productos:</h4>
                        <ul class="lista-productos">
                            ${pedido.productos.map(producto => `
                                <li>
                                    <span class="producto-nombre">${producto.nombre}</span>
                                    <span class="producto-cantidad">${producto.cantidad} x S/${producto.precio.toFixed(2)}</span>
                                    <span class="producto-subtotal">S/${(producto.precio * producto.cantidad).toFixed(2)}</span>
                                </li>
                            `).join('')}
                        </ul>
                        
                        ${pedido.cupon ? `
                            <div class="cupon-aplicado">
                                <i class="fas fa-tag"></i>
                                <span>Cupón aplicado: ${pedido.cupon.codigo} (-${pedido.cupon.descuento}%)</span>
                            </div>
                        ` : ''}
                        
                        <div class="pedido-total">
                            <span>Total:</span>
                            <strong>S/${pedido.total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div class="pedido-acciones">
                        <button class="boton-secundario" onclick="window.location.href='preguntas-frecuentes.html'">
                            <i class="fas fa-question-circle"></i> Ayuda
                        </button>
                        <button class="boton-primario" id="seguir-envio-${pedido.id}">
                            <i class="fas fa-truck"></i> Seguir envío
                        </button>
                    </div>
                </article>
            `;
        }).join('');
    }

// Función para mostrar el mapa de seguimiento (simulado)
function mostrarSeguimientoEnvio(pedidoId) {
    // Crear un modal para mostrar el mapa
    const modal = document.createElement('div');
    modal.className = 'modal-seguimiento';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Contenido del modal con mapa simulado
    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 800px; width: 90%;">
            <h3 style="margin-top: 0;">Seguimiento del Pedido #${pedidoId}</h3>
            <div id="mapa-seguimiento" style="height: 400px; width: 100%; background: #f0f0f0; margin: 15px 0;">
                <!-- Mapa simulado (puedes reemplazar con Google Maps API si lo deseas) -->
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <div style="text-align: center;">
                        <i class="fas fa-truck" style="font-size: 50px; color: #3498db;"></i>
                        <p>Estado: En camino</p>
                        <p>Ubicación estimada: Av. Tacna y Arica, Arequipa</p>
                        <p>Tiempo estimado: 2 días hábiles</p>
                    </div>
                </div>
            </div>
            <button id="cerrar-modal" style="padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">Cerrar</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Cerrar modal al hacer clic
    modal.querySelector('#cerrar-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Asignar eventos a los botones "Seguir envío" después de renderizar
function asignarEventosSeguimiento() {
    document.querySelectorAll('[id^="seguir-envio-"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const pedidoId = this.id.replace('seguir-envio-', '');
            mostrarSeguimientoEnvio(pedidoId);
        });
    });
}

// Llamar a esta función al final de renderizarPedidos()
renderizarPedidos();
asignarEventosSeguimiento();
});