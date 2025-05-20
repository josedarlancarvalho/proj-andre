package com.simplyinvite_showcase_page.backend.seguranca;

import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // O username aqui é o email, conforme definido em Usuario.java
        Usuario usuario = usuarioRepositorio.findByEmail(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado com email: " + username);
        }
        return usuario;
    }
} 