package com.empresa.sistema_compras.modules.compra;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @GetMapping
    public List<Compra> listar() {
        return compraService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Compra compra) {
    Compra compraGuardada = compraService.registrar(compra);
    java.util.Map<String, Object> response = new java.util.HashMap<>();
    response.put("id", compraGuardada.getId());
    response.put("total", compraGuardada.getTotal());
    return ResponseEntity.ok(response);
}
}