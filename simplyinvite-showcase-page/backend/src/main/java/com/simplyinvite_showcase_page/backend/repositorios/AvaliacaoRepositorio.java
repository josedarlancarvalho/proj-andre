package com.simplyinvite_showcase_page.backend.repositorios;

import com.simplyinvite_showcase_page.backend.modelos.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepositorio extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByProjeto_Id(Long projetoId);
}
