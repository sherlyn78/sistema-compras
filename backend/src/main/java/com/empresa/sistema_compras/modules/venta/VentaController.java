package com.empresa.sistema_compras.modules.venta;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public List<Venta> listar() {
        return ventaService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Venta venta) {
    Venta ventaGuardada = ventaService.registrar(venta);
    // Devolvemos solo el id para evitar referencias circulares
    java.util.Map<String, Object> response = new java.util.HashMap<>();
    response.put("id", ventaGuardada.getId());
    response.put("total", ventaGuardada.getTotal());
    return ResponseEntity.ok(response);
}

    
}