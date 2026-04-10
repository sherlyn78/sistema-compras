package com.empresa.sistema_compras.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empresa.sistema_compras.models.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerUser {

    @Autowired
    private AuthServiceUser authServiceUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
        String token = authServiceUser.login(request.getUsername(), request.getPassword());
        
        // Creamos un mapa para que Jackson lo convierta a JSON: {"token": "ey..."}
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("token", token);
        
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    }
    }
}