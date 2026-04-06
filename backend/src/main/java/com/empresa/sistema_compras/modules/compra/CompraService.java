package com.empresa.sistema_compras.modules.compra;

import com.empresa.sistema_compras.modules.producto.Producto;
import com.empresa.sistema_compras.modules.producto.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Compra> listarTodas() {
        return compraRepository.findAll();
    }

    public Compra registrar(Compra compra) {
        double total = 0.0;

        for (DetalleCompra detalle : compra.getDetalles()) {
            detalle.setCompra(compra);
            double subtotal = detalle.getCantidad() * detalle.getPrecioUnitario();
            detalle.setSubtotal(subtotal);
            total += subtotal;

            // Actualizar inventario
            Producto producto = productoRepository.findById(detalle.getProducto().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            producto.setCantidadInventario(producto.getCantidadInventario() + detalle.getCantidad());
            productoRepository.save(producto);
        }

        compra.setTotal(total);
        return compraRepository.save(compra);
    }
}