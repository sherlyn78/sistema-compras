package com.empresa.sistema_compras.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthControllerUser {

    @Autowired
    private AuthServiceUser authServiceUser;

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(
            authServiceUser.login(usuario.getUsername(), usuario.getPassword())
        );
    }
}