package com.empresa.sistema_compras.modules.usuario;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
        if (usuario.getRol()== null){
            Rol rol = rolRepository.findByNombre("ADMIN");
            if (rol == null){
                rol = new Rol();
                rol.setNombre("ADMIN");
                rol = rolRepository.save(rol);
            }
            usuario.setRol(rol);
        }
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }
}