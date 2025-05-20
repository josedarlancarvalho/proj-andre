package com.simplyinvite_showcase_page.backend.servicos;

import com.simplyinvite_showcase_page.backend.dtos.AvaliacaoDTO;
import com.simplyinvite_showcase_page.backend.modelos.Avaliacao;
import com.simplyinvite_showcase_page.backend.modelos.Projeto;
import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.AvaliacaoRepositorio;
import com.simplyinvite_showcase_page.backend.repositorios.ProjetoRepositorio;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AvaliacaoServico {

    @Autowired
    private AvaliacaoRepositorio avaliacaoRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio; // Para dados do avaliador

    @Autowired
    private ProjetoRepositorio projetoRepositorio; // Para título do projeto

    private AvaliacaoDTO mapToAvaliacaoDTO(Avaliacao avaliacao) {
        AvaliacaoDTO dto = new AvaliacaoDTO();
        dto.setId(avaliacao.getId());
        
        Projeto projeto = avaliacao.getProjeto();
        if (projeto != null) {
            dto.setProjetoId(projeto.getId());
            dto.setTituloProjeto(projeto.getTitulo());
        } else {
             // Se o projeto for nulo por algum motivo, buscar pelo ID se o campo antigo ainda existisse
             // Como projetoId foi removido de Avaliacao, esta parte não é mais necessária se o objeto Projeto está sempre presente.
             // Se avaliacao.getProjeto() pode ser nulo, precisamos carregar o Projeto usando um ID que estaria em Avaliacao.
        }

        dto.setAvaliadorId(avaliacao.getAvaliadorId());
        if (avaliacao.getAvaliadorId() != null) {
            Optional<Usuario> avaliadorOpt = usuarioRepositorio.findById(avaliacao.getAvaliadorId());
            if (avaliadorOpt.isPresent()) {
                Usuario avaliador = avaliadorOpt.get();
                dto.setAvaliadorNome(avaliador.getNomeCompleto());
                dto.setAvatarAvaliadorUrl(avaliador.getAvatarUrl());
                // Combinar cargo e nome da empresa para "avaliadorCargo"
                String cargoEmpresa = avaliador.getCargoNaEmpresa() != null ? avaliador.getCargoNaEmpresa() : "";
                String nomeEmpresa = (avaliador.getEmpresa() != null && avaliador.getEmpresa().getNome() != null) ? avaliador.getEmpresa().getNome() : "";
                
                if (!cargoEmpresa.isEmpty() && !nomeEmpresa.isEmpty()){
                    dto.setAvaliadorCargo(cargoEmpresa + " @ " + nomeEmpresa);
                } else if (!cargoEmpresa.isEmpty()){
                    dto.setAvaliadorCargo(cargoEmpresa);
                } else if (!nomeEmpresa.isEmpty()){
                     dto.setAvaliadorCargo(nomeEmpresa); // Ou "Profissional @ " + nomeEmpresa
                } else {
                    dto.setAvaliadorCargo("Avaliador(a)"); // Fallback
                }
            }
        }

        dto.setComentario(avaliacao.getComentario());
        dto.setNota(avaliacao.getNota());
        dto.derivarMedalTypeDaNota(); // Calcula medalType com base na nota
        dto.setDataAvaliacao(avaliacao.getDataAvaliacao());

        return dto;
    }

    public List<AvaliacaoDTO> getAvaliacoesByProjetoId(Long projetoId) {
        // O AvaliacaoRepositorio precisará de um método como findByProjetoId(Long projetoId)
        // Ou, se o relacionamento em Projeto (List<Avaliacao>) for EAGER ou buscado,
        // poderíamos obter o Projeto e depois suas avaliações.
        // Por agora, vou assumir que o repositório terá o método.
        List<Avaliacao> avaliacoes = avaliacaoRepositorio.findByProjeto_Id(projetoId);
         if (avaliacoes.isEmpty()) {
            return Collections.emptyList();
        }
        return avaliacoes.stream()
                .map(this::mapToAvaliacaoDTO)
                .collect(Collectors.toList());
    }

    // TODO: Adicionar método para buscar avaliações por avaliadorId, criar avaliação, etc.
}
