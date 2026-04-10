package com.empresa.sistema_compras.modules.usuario;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario guardar(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        //asiganr rol
if (usuario.getRol() != null && usuario.getRol().getNombre() != null) {
        // BUSCAR el rol existente para no duplicarlo y evitar error de llave única
        Rol rolExistente = rolRepository.findByNombre(usuario.getRol().getNombre());
        if (rolExistente != null) {
            usuario.setRol(rolExistente);
        } else {
            // Si el rol no existe, lo guarda primero.
            Rol nuevoRol = rolRepository.save(usuario.getRol());
            usuario.setRol(nuevoRol);
        }
    }
        return usuarioRepository.save(usuario);
    }

        @PreAuthorize("hasAuthority('ADMIN')")
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario actualizarUsuario(Long id, Usuario datosNuevos) {
    return usuarioRepository.findById(id).map(u -> {
        u.setUsername(datosNuevos.getUsername());
        u.setEmail(datosNuevos.getEmail());
        
        // Actualizar Rol
        if (datosNuevos.getRol() != null && datosNuevos.getRol().getNombre() != null) {
            Rol rolEncontrado = rolRepository.findByNombre(datosNuevos.getRol().getNombre());
            if (rolEncontrado != null) {
                u.setRol(rolEncontrado);
            }
        }


    //guarda status
        if (datosNuevos.getStatus() != null && !datosNuevos.getStatus().isEmpty()) {
            u.setStatus(datosNuevos.getStatus());
        }

        if (datosNuevos.getPassword() != null && !datosNuevos.getPassword().isEmpty()) {
            u.setPassword(passwordEncoder.encode(datosNuevos.getPassword()));
        }
        return usuarioRepository.save(u);
    }).orElse(null);
}
}