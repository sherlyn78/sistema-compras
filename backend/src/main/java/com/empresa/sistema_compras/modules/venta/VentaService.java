package com.empresa.sistema_compras.modules.venta;

import com.empresa.sistema_compras.modules.producto.Producto;
import com.empresa.sistema_compras.modules.producto.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Venta> listarTodas() {
        return ventaRepository.findAll();
    }

    public Venta registrar(Venta venta) {
        double total = 0.0;

        for (DetalleVenta detalle : venta.getDetalles()) {
            detalle.setVenta(venta);

            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // Validar stock suficiente
            if (producto.getCantidadInventario() < detalle.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
            }

            double subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
            detalle.setSubtotal(subtotal);
            total += subtotal;

            // Reducir inventario
            producto.setCantidadInventario(producto.getCantidadInventario() - detalle.getCantidad());
            productoRepository.save(producto);
        }

        venta.setTotal(total);
        return ventaRepository.save(venta);
    }
}