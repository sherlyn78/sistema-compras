package com.empresa.sistema_compras.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.empresa.sistema_compras.modules.usuario.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = jwtService.extractUsername(token);
                String role = jwtService.extractRole(token); // Extraemos el rol que guardaste en JwtService


                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    String finalRole = (role != null) ? role : "ROLE_VENDEDOR";
                    System.out.println(">>> Usuario: " + username + " | Rol asignado: " + finalRole);

                    // admin
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(finalRole);


                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(authority));
                        
                        SecurityContextHolder.getContext().setAuthentication(authToken);
        }
            } catch (Exception e) {
                System.out.println("Error validando el token: " + e.getMessage());
                e.printStackTrace(); //error
                }
        }
        filterChain.doFilter(request, response);
    }
}