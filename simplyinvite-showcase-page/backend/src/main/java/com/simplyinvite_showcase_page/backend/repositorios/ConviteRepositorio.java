package com.simplyinvite_showcase_page.backend.repositorios;

import com.simplyinvite_showcase_page.backend.modelos.Convite;
import com.simplyinvite_showcase_page.backend.modelos.StatusConvite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConviteRepositorio extends JpaRepository<Convite, Long> {

    // Lista convites recebidos por um usuário (talento)
    List<Convite> findByDestinatarioId(Long destinatarioId);

    // Lista convites enviados por um usuário (RH/Gestor)
    List<Convite> findByRemetenteId(Long remetenteId);

    // Lista convites recebidos por um usuário com um status específico
    List<Convite> findByDestinatarioIdAndStatus(Long destinatarioId, StatusConvite status);

    // Lista convites enviados por um usuário com um status específico
    List<Convite> findByRemetenteIdAndStatus(Long remetenteId, StatusConvite status);

    // Pode ser útil para verificar se já existe um convite para um mesmo projeto/usuário
    // Optional<Convite> findByRemetenteIdAndDestinatarioIdAndProjetoId(Long remetenteId, Long destinatarioId, Long projetoId);
} 