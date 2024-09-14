/* COdigo 3 */

document.addEventListener('DOMContentLoaded', () => {
    const contenedorProductos = document.getElementById('contenedorProductos');
    const agregarProductoBtn = document.getElementById('agregarProducto');
    const montoTotalEl = document.getElementById('montoTotal');
    const numeroTicketEl = document.getElementById('numeroTicket');
    const formularioTicket = document.getElementById('formularioTicket');
    const ticketImpreso = document.getElementById('ticketImpreso');
    const ventasEfectivoEl = document.getElementById('ventasEfectivo');
    const ventasTransferenciaEl = document.getElementById('ventasTransferencia');
    const totalVentasEl = document.getElementById('totalVentas');
    const cuerpoHistorial = document.getElementById('cuerpoHistorial');
    
    // Inicializar valores desde localStorage o establecer valores predeterminados
    let numeroTicket = parseInt(localStorage.getItem('numeroTicket')) || 1;
    let ventasEfectivo = parseFloat(localStorage.getItem('ventasEfectivo')) || 0;
    let ventasTransferencia = parseFloat(localStorage.getItem('ventasTransferencia')) || 0;
    let historialVentas = JSON.parse(localStorage.getItem('historialVentas')) || [];

    // Mostrar valores iniciales en la interfaz
    numeroTicketEl.textContent = numeroTicket;
    ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
    ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
    totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

    // Cargar historial de ventas en la tabla
    function cargarHistorialVentas() {
        cuerpoHistorial.innerHTML = historialVentas.map(venta => `
            <tr class="${venta.anulado ? 'producto-anulado' : ''}">
                <td>${venta.numeroTicket}</td>
                <td>${venta.productos.join('<br>')}</td>
                <td>$${venta.montoTotal.toFixed(2)}</td>
                <td>${venta.medioPago}</td>
                <td>${venta.nombreCliente}</td>
                <td>${venta.anulado ? 'Anulado' : 'Activo'}</td>
                <td>
                    ${venta.anulado ? '' : `<button class="btnAnular" data-ticket="${venta.numeroTicket}">Anular</button>`}
                </td>
            </tr>
        `).join('');
    }

    cargarHistorialVentas();

    agregarProductoBtn.addEventListener('click', () => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <select class="selectProducto">
                <option value="1" data-precio="2500">Empanada Horno ($2500)</option>
                <option value="2" data-precio="2500">Empanada Frita ($2500)</option>
                <option value="3" data-precio="2000">Salchipapas ($2000)</option>
                <option value="4" data-precio="1000">Consomé ($1000)</option>
                <option value="5" data-precio="1500">Choripan ($1500)</option>
                <option value="6" data-precio="300">Sopaipillas ($300)</option>
                <option value="7" data-precio="500">Queque ($500)</option>
                <option value="8" data-precio="800">Bebida ($800)</option>
                <option value="9" data-precio="1000">Agua 500 CC ($1000)</option>
                <option value="10" data-precio="1000">Cuchuflí ($1000)</option>
                <option value="11" data-precio="500">Jugo en caja ($500)</option>
                <option value="12" data-precio="500">Té ($500)</option>
                <option value="13" data-precio="500">Café ($500)</option>
                <option value="14" data-precio="1500">Empanada Queso ($1500)</option>

            </select>
            <input type="number" class="inputCantidad" min="1" value="1">
            <span class="totalProducto">Total: $1500</span>
            <button type="button" class="btnEliminar">Eliminar</button>
        `;
        contenedorProductos.appendChild(productoDiv);
        actualizarTotal();
    });

    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnEliminar')) {
            e.target.parentElement.remove();
            actualizarTotal();
        }
    });

    contenedorProductos.addEventListener('change', (e) => {
        if (e.target.classList.contains('selectProducto') || e.target.classList.contains('inputCantidad')) {
            actualizarTotal();
        }
    });

    function actualizarTotal() {
        let totalCompra = 0;
        document.querySelectorAll('.producto').forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const precio = selectProducto.options[selectProducto.selectedIndex].dataset.precio;
            const totalProducto = precio * cantidad;
            producto.querySelector('.totalProducto').textContent = `Total: $${totalProducto}`;
            totalCompra += totalProducto;
        });
        montoTotalEl.textContent = totalCompra.toFixed(2);
    }

    formularioTicket.addEventListener('submit', (e) => {
        e.preventDefault();

        // Preparar el contenido del ticket
        const productos = [];
        document.querySelectorAll('.producto').forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const nombreProducto = selectProducto.options[selectProducto.selectedIndex].text;
            productos.push(`${nombreProducto} - Cantidad: ${cantidad}`);
        });

        // Obtener el nombre del cliente
        const nombreCliente = document.getElementById('nombreCliente').value || 'Anónimo';

        // Determinar medio de pago
        const medioPago = document.getElementById('selectMedioPago').value;
        const montoTotal = parseFloat(montoTotalEl.textContent);

        // Acumulación de ventas
        if (medioPago === 'efectivo') {
            ventasEfectivo += montoTotal;
        } else if (medioPago === 'transferencia') {
            ventasTransferencia += montoTotal;
        }

        // Guardar en localStorage
        localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
        localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));
        localStorage.setItem('numeroTicket', numeroTicket + 1);

        // Actualizar desglose de ventas
        ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
        ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
        totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

        // Actualizar historial
        const nuevaVenta = {
            numeroTicket: numeroTicket,
            productos,
            montoTotal,
            medioPago,
            nombreCliente,
            anulado: false
        };
        historialVentas.push(nuevaVenta);
        localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

        // Preparar el contenido del ticket para impresión
        ticketImpreso.innerHTML = `
            <h3>Ticket N° ${numeroTicket}</h3>
            <p>Nombre del Cliente: ${nombreCliente}</p>
            <p>Productos:</p>
            <ul>
                ${productos.map(producto => `<li>${producto}</li>`).join('')}
            </ul>
            <p>Total: $${montoTotal.toFixed(2)}</p>
            <p>Medio de Pago: ${medioPago}</p>
        `;

        // Mostrar el ticket para impresión y ocultarlo después
        ticketImpreso.style.display = 'block';
        window.print();
        ticketImpreso.style.display = 'none';

        // Actualizar historial de ventas
        cargarHistorialVentas();

        // Incrementar número de ticket
        numeroTicket++;
        numeroTicketEl.textContent = numeroTicket;

        // Resetear el formulario
        formularioTicket.reset();
        contenedorProductos.innerHTML = '';
        montoTotalEl.textContent = '0';
    });

    // Función para anular una venta
    function anularVenta(numeroTicketAnular) {
        const ventaIndex = historialVentas.findIndex(venta => venta.numeroTicket === numeroTicketAnular);
        if (ventaIndex !== -1) {
            const venta = historialVentas[ventaIndex];
            if (!venta.anulado) {
                // Actualizar el desglose de ventas
                if (venta.medioPago === 'efectivo') {
                    ventasEfectivo -= venta.montoTotal;
                } else if (venta.medioPago === 'transferencia') {
                    ventasTransferencia -= venta.montoTotal;
                }
                // Guardar en localStorage
                localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
                localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));

                // Marcar la venta como anulada
                venta.anulado = true;
                localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

                // Actualizar desglose de ventas
                ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
                ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
                totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

                // Actualizar historial de ventas
                cargarHistorialVentas();
            }
        }
    }

    document.getElementById('exportarExcel').addEventListener('click', () => {
        // Convertir los datos del historial a un formato adecuado para Excel
        const datosHistorial = [['Número de Ticket', 'Productos', 'Total', 'Medio de Pago', 'Nombre del Cliente', 'Estado']];
        
        historialVentas.forEach(venta => {
            datosHistorial.push([
                venta.numeroTicket,
                venta.productos.join(', '),
                `$${venta.montoTotal.toFixed(2)}`,
                venta.medioPago,
                venta.nombreCliente,
                venta.anulado ? 'Anulado' : 'Activo'
            ]);
        });
    
        // Crear una hoja de trabajo (worksheet) a partir de los datos
        const ws = XLSX.utils.aoa_to_sheet(datosHistorial);
    
        // Crear un libro de trabajo (workbook)
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Historial de Ventas');
    
        // Exportar el archivo Excel
        XLSX.writeFile(wb, 'historial_ventas.xlsx');
    });
    

    

    // Manejar eventos de anulación de venta
    cuerpoHistorial.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnAnular')) {
            const numeroTicketAnular = parseInt(e.target.getAttribute('data-ticket'));
            if (confirm(`¿Está seguro de que desea anular el ticket ${numeroTicketAnular}?`)) {
                anularVenta(numeroTicketAnular);
            }
        }
    });
});





