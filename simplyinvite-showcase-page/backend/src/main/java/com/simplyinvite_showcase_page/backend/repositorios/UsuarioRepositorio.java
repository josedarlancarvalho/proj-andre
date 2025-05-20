package com.simplyinvite_showcase_page.backend.repositorios;

import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
}
