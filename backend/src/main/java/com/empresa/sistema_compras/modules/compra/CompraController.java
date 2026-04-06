package com.empresa.sistema_compras.modules.compra;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
    public ResponseEntity<Compra> registrar(@RequestBody Compra compra) {
        return ResponseEntity.ok(compraService.registrar(compra));
    }
}