package com.empresa.sistema_compras.modules.producto;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByEstado(String estado);
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}