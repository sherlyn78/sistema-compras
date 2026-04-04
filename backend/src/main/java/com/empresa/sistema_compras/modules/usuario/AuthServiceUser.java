package com.empresa.sistema_compras.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceUser {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario login(String username, String password) {
        return usuarioRepository.findByUsername(username)
            .filter(u -> u.getPassword().equals(password))
            .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));
    }
}