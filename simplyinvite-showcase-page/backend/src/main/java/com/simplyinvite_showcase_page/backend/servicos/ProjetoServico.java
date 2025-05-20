package com.simplyinvite_showcase_page.backend.servicos;

import com.simplyinvite_showcase_page.backend.dtos.ProjetoDTO;
import com.simplyinvite_showcase_page.backend.modelos.Avaliacao;
import com.simplyinvite_showcase_page.backend.modelos.Projeto;
import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.ProjetoRepositorio;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjetoServico {

    @Autowired
    private ProjetoRepositorio projetoRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio; // Para buscar dados do autor

    private ProjetoDTO mapToProjetoDTO(Projeto projeto) {
        ProjetoDTO dto = new ProjetoDTO();
        dto.setId(projeto.getId());
        dto.setTitulo(projeto.getTitulo());
        dto.setDescricao(projeto.getDescricao());
        dto.setUsuarioId(projeto.getUsuarioId());
        dto.setVideoUrl(projeto.getVideoUrl());
        dto.setLinkProjetoExterno(projeto.getLinkProjetoExterno());
        dto.setCategoria(projeto.getCategoria());
        dto.setStatusSubmissao(projeto.getStatusSubmissao());
        dto.setDataEnvio(projeto.getDataEnvio());
        dto.setThumbnailUrl(projeto.getThumbnailUrl());

        // Buscar e definir nome e avatar do autor
        if (projeto.getUsuarioId() != null) {
            Optional<Usuario> autorOpt = usuarioRepositorio.findById(projeto.getUsuarioId());
            if (autorOpt.isPresent()) {
                Usuario autor = autorOpt.get();
                dto.setNomeAutor(autor.getNomeCompleto());
                dto.setAvatarAutorUrl(autor.getAvatarUrl());
            }
        }

        // Calcular feedbackCount e hasFeedback
        List<Avaliacao> avaliacoes = projeto.getAvaliacoes();
        if (avaliacoes != null) {
            dto.setFeedbackCount(avaliacoes.size());
            dto.setHasFeedback(!avaliacoes.isEmpty());

            // Determinar medalType (lógica simplificada)
            // Ouro: nota >= 9, Prata: nota >= 7, Bronze: nota >= 5
            // Considera a maior nota se houver múltiplas avaliações
            String medalType = "nenhuma";
            if (!avaliacoes.isEmpty()) {
                int maxNota = avaliacoes.stream().mapToInt(Avaliacao::getNota).max().orElse(0);
                if (maxNota >= 9) {
                    medalType = "ouro";
                } else if (maxNota >= 7) {
                    medalType = "prata";
                } else if (maxNota >= 5) {
                    medalType = "bronze";
                }
            }
            dto.setMedalType(medalType);
        } else {
            dto.setFeedbackCount(0);
            dto.setHasFeedback(false);
            dto.setMedalType("nenhuma");
        }

        return dto;
    }

    public ProjetoDTO getProjetoDTOById(Long projetoId) {
        Optional<Projeto> projetoOpt = projetoRepositorio.findById(projetoId);
        return projetoOpt.map(this::mapToProjetoDTO).orElse(null);
    }

    public List<ProjetoDTO> getAllProjetosDTO() {
        return projetoRepositorio.findAll().stream()
                .map(this::mapToProjetoDTO)
                .collect(Collectors.toList());
    }

    public List<ProjetoDTO> getProjetosDTOByUsuarioId(Long usuarioId) {
        // Nota: o ProjetoRepositorio precisará de um método como findByUsuarioId(Long usuarioId)
        // Por enquanto, vou filtrar a lista completa, o que não é eficiente para bancos grandes.
        // Isso DEVE ser otimizado com uma query customizada no repositório.
        // List<Projeto> projetosDoUsuario = projetoRepositorio.findAll().stream()
        //     .filter(p -> p.getUsuarioId().equals(usuarioId))
        //     .collect(Collectors.toList());
        
        List<Projeto> projetosDoUsuario = projetoRepositorio.findByUsuarioId(usuarioId);
        
        if (projetosDoUsuario.isEmpty()) {
            return Collections.emptyList();
        }
        return projetosDoUsuario.stream()
                .map(this::mapToProjetoDTO)
                .collect(Collectors.toList());
    }
    
    // TODO: Adicionar métodos para criar, atualizar projetos, que também retornariam DTOs.
}
