package com.simplyinvite_showcase_page.backend.repositorios;

import com.simplyinvite_showcase_page.backend.modelos.Projeto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetoRepositorio extends JpaRepository<Projeto, Long> {
    List<Projeto> findByUsuarioId(Long usuarioId);
}
