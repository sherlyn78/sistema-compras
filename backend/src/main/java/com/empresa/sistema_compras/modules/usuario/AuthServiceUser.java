package com.empresa.sistema_compras.modules.usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class AuthServiceUser {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String login(String username, String password) {
    Usuario user = usuarioRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Credenciales incorrectas");
    }
//valida usuario activo
    if (!"ACTIVO".equals(user.getStatus())) {
        throw new RuntimeException("Usuario inactivo. Contacta al administrador.");
    }

    // EXTRAEMOS EL ROL REAL DE LA BASE DE DATOS
    String nombreRol = user.getRol().getNombre().toUpperCase();
    
    String roleForToken = "ROLE_" + nombreRol;

    return jwtService.generateToken(user.getUsername(), roleForToken);
}
}
