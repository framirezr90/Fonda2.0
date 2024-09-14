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
    
    let numeroTicket = parseInt(localStorage.getItem('numeroTicket')) || 1;
    let ventasEfectivo = parseFloat(localStorage.getItem('ventasEfectivo')) || 0;
    let ventasTransferencia = parseFloat(localStorage.getItem('ventasTransferencia')) || 0;
    let historialVentas = JSON.parse(localStorage.getItem('historialVentas')) || [];

    numeroTicketEl.textContent = numeroTicket;
    ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
    ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
    totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

    function cargarHistorialVentas() {
        cuerpoHistorial.innerHTML = historialVentas.map(venta => `
            <tr class="${venta.anulado ? 'producto-anulado' : ''}">
                <td>${venta.numeroTicket}</td>
                <td>${venta.productos.join('<br>')}</td>
                <td>$${venta.montoTotal.toFixed(2)}</td>
                <td>${venta.medioPago}</td>
                <td>${venta.nombreCliente}</td>
                <td>${venta.estado}</td> 
                <td>
                    ${venta.anulado ? 'Anulado' : `<button class="btnAnular" data-ticket="${venta.numeroTicket}">Anular</button>`}
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
                <option value="1" data-precio="2500">Empanada Pino Horno ($2500)</option>
                <option value="2" data-precio="2500">Empanada Pino Frita ($2500)</option>
                <option value="3" data-precio="1500">Empanada Queso ($1500)</option>
                <option value="4" data-precio="2000">Salchipapas ($2000)</option>
                <option value="5" data-precio="1000">Consomé ($1000)</option>
                <option value="6" data-precio="1500">Choripan ($1500)</option>
                <option value="7" data-precio="300">Sopaipillas ($300)</option>
                <option value="8" data-precio="500">Queque ($500)</option>
                <option value="9" data-precio="1000">Cuchuflí ($1000)</option>
                <option value="10" data-precio="800">Bebida ($800)</option>
                <option value="11" data-precio="1000">Agua 500 CC ($1000)</option>
                <option value="12" data-precio="500">Jugo en caja ($500)</option>
                <option value="13" data-precio="500">Té ($500)</option>
                <option value="14" data-precio="500">Café ($500)</option>
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
            const productoDiv = e.target.parentElement;
            const selectProducto = productoDiv.querySelector('.selectProducto');
            const cantidad = productoDiv.querySelector('.inputCantidad').value;
            const precio = selectProducto.options[selectProducto.selectedIndex].dataset.precio;
            const totalProducto = productoDiv.querySelector('.totalProducto');
            totalProducto.textContent = `Total: $${(precio * cantidad).toFixed(2)}`;
            actualizarTotal();
        }
    });

    function actualizarTotal() {
        const productos = document.querySelectorAll('.producto');
        let montoTotal = 0;
        productos.forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const precio = selectProducto.options[selectProducto.selectedIndex].dataset.precio;
            montoTotal += parseFloat(precio) * parseInt(cantidad);
        });
        montoTotalEl.textContent = montoTotal.toFixed(2);
    }

    formularioTicket.addEventListener('submit', (e) => {
        e.preventDefault();

        const productos = [];
        document.querySelectorAll('.producto').forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const nombreProducto = selectProducto.options[selectProducto.selectedIndex].text;
            productos.push(`${nombreProducto} - Cantidad: ${cantidad}`);
        });

        const nombreCliente = document.getElementById('nombreCliente').value || 'Anónimo';
        const medioPago = document.getElementById('selectMedioPago').value;
        const estado = document.getElementById('selectEstado').value;
        const montoTotal = parseFloat(montoTotalEl.textContent);

        if (medioPago === 'efectivo') {
            ventasEfectivo += montoTotal;
        } else if (medioPago === 'transferencia') {
            ventasTransferencia += montoTotal;
        }

        localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
        localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));
        localStorage.setItem('numeroTicket', numeroTicket + 1);

        ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
        ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
        totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

        const nuevaVenta = {
            numeroTicket: numeroTicket,
            productos,
            montoTotal,
            medioPago,
            nombreCliente,
            estado,
            anulado: false
        };
        historialVentas.push(nuevaVenta);
        localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

        ticketImpreso.innerHTML = `
            <h3>Ticket N° ${numeroTicket}</h3>
            <p>Nombre del Cliente: ${nombreCliente}</p>
            <p>Productos:</p>
            <ul>
                ${productos.map(producto => `<li>${producto}</li>`).join('')}
            </ul>
            <p>Total: $${montoTotal.toFixed(2)}</p>
            <p>Medio de Pago: ${medioPago}</p>
            <p>Estado: ${estado}</p>
        `;

        ticketImpreso.style.display = 'block';
        window.print();
        ticketImpreso.style.display = 'none';

        cargarHistorialVentas();
        numeroTicket++;
        numeroTicketEl.textContent = numeroTicket;
        formularioTicket.reset();
        contenedorProductos.innerHTML = '';
        montoTotalEl.textContent = '0';
    });

    cuerpoHistorial.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnAnular')) {
            const ticketAnular = parseInt(e.target.getAttribute('data-ticket'));
            const venta = historialVentas.find(venta => venta.numeroTicket === ticketAnular);
            if (venta && !venta.anulado) {
                venta.anulado = true;

                if (venta.medioPago === 'efectivo') {
                    ventasEfectivo -= venta.montoTotal;
                } else if (venta.medioPago === 'transferencia') {
                    ventasTransferencia -= venta.montoTotal;
                }

                localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
                localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));
                localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

                ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
                ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
                totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia).toFixed(2);

                cargarHistorialVentas();
            }
        }
    });

    document.getElementById('exportarExcel').addEventListener('click', () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(historialVentas.map(venta => ({
            'Número de Ticket': venta.numeroTicket,
            'Productos': venta.productos.join(', '),
            'Total': `$${venta.montoTotal.toFixed(2)}`,
            'Medio de Pago': venta.medioPago,
            'Nombre del Cliente': venta.nombreCliente,
            'Estado': venta.estado,
            'Estado de Venta': venta.anulado ? 'Anulado' : 'Activo'
        })));

        XLSX.utils.book_append_sheet(wb, ws, 'Historial de Ventas');
        XLSX.writeFile(wb, 'HistorialVentas.xlsx');
    });
});





