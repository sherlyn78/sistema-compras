package com.empresa.sistema_compras.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.empresa.sistema_compras.models.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerUser {

    @Autowired
    private AuthServiceUser authServiceUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authServiceUser.login(
                request.getUsername(),
                request.getPassword()
            );
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(e.getMessage());
        }
    }
}