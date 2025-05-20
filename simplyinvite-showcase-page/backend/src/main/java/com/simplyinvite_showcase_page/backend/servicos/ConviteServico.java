package com.simplyinvite_showcase_page.backend.servicos;

import com.simplyinvite_showcase_page.backend.dtos.ConviteDTO;
import com.simplyinvite_showcase_page.backend.dtos.CriarConviteRequestDTO;
import com.simplyinvite_showcase_page.backend.modelos.*;
import com.simplyinvite_showcase_page.backend.repositorios.ConviteRepositorio;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import com.simplyinvite_showcase_page.backend.repositorios.ProjetoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConviteServico {

    @Autowired
    private ConviteRepositorio conviteRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio; // Para buscar dados do remetente/destinatário

    @Autowired
    private ProjetoRepositorio projetoRepositorio; // Para buscar dados do projeto, se houver

    private ConviteDTO mapToConviteDTO(Convite convite) {
        if (convite == null) return null;

        ConviteDTO dto = new ConviteDTO();
        dto.setId(convite.getId());
        dto.setTitulo(convite.getTitulo());
        dto.setMensagem(convite.getMensagem());
        dto.setStatus(convite.getStatus());
        dto.setDataEnvio(convite.getDataEnvio());
        dto.setDataResposta(convite.getDataResposta());

        Usuario remetente = convite.getRemetente();
        if (remetente != null) {
            dto.setRemetenteId(remetente.getId());
            dto.setNomeRemetente(remetente.getNomeCompleto());
            dto.setAvatarRemetenteUrl(remetente.getAvatarUrl());
            dto.setCargoRemetente(remetente.getCargoNaEmpresa());
            if (remetente.getEmpresa() != null) {
                dto.setEmpresaRemetenteNome(remetente.getEmpresa().getNome());
            }
        }

        Usuario destinatario = convite.getDestinatario();
        if (destinatario != null) {
            dto.setDestinatarioId(destinatario.getId());
            dto.setNomeDestinatario(destinatario.getNomeCompleto());
            dto.setAvatarDestinatarioUrl(destinatario.getAvatarUrl());
        }

        Projeto projeto = convite.getProjeto();
        if (projeto != null) {
            dto.setProjetoId(projeto.getId());
            dto.setTituloProjeto(projeto.getTitulo());
            dto.setThumbnailProjetoUrl(projeto.getThumbnailUrl());
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ConviteDTO> getConvitesRecebidosPorUsuario(Long usuarioId) {
        List<Convite> convites = conviteRepositorio.findByDestinatarioId(usuarioId);
        return convites.stream().map(this::mapToConviteDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConviteDTO> getConvitesEnviadosPorUsuario(Long usuarioId) {
        List<Convite> convites = conviteRepositorio.findByRemetenteId(usuarioId);
        return convites.stream().map(this::mapToConviteDTO).collect(Collectors.toList());
    }

    @Transactional
    public ConviteDTO responderConvite(Long conviteId, StatusConvite novoStatus, Long usuarioRespondendoId) {
        Convite convite = conviteRepositorio.findById(conviteId)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado com id: " + conviteId));

        // Validação: somente o destinatário pode responder
        if (!convite.getDestinatario().getId().equals(usuarioRespondendoId)) {
            throw new RuntimeException("Usuário não autorizado a responder este convite.");
        }

        // Validação: só pode responder se estiver PENDENTE
        if (convite.getStatus() != StatusConvite.PENDENTE) {
            throw new RuntimeException("Este convite não pode mais ser respondido.");
        }
        
        // Validação: não pode mudar para PENDENTE novamente
        if (novoStatus == StatusConvite.PENDENTE){
             throw new RuntimeException("Status de resposta inválido.");
        }

        convite.setStatus(novoStatus);
        convite.setDataResposta(LocalDateTime.now());
        Convite conviteAtualizado = conviteRepositorio.save(convite);
        return mapToConviteDTO(conviteAtualizado);
    }

    @Transactional
    public ConviteDTO criarConvite(CriarConviteRequestDTO requestDTO, Usuario remetente) {
        // 1. Validar tipo de perfil do remetente (deve ser RH ou Manager)
        String tipoPerfilRemetente = remetente.getTipoPerfil();
        if (!("hr".equalsIgnoreCase(tipoPerfilRemetente) || "manager".equalsIgnoreCase(tipoPerfilRemetente))) {
            throw new RuntimeException("Usuário não autorizado a criar convites. Perfil necessário: RH ou Manager.");
        }

        // 2. Buscar destinatário
        Usuario destinatario = usuarioRepositorio.findById(requestDTO.getDestinatarioId())
                .orElseThrow(() -> new RuntimeException("Destinatário não encontrado com ID: " + requestDTO.getDestinatarioId()));

        // 3. Validar tipo de perfil do destinatário (deve ser Talento)
        if (!"talent".equalsIgnoreCase(destinatario.getTipoPerfil())) {
            throw new RuntimeException("Destinatário inválido. Convites só podem ser enviados para Talentos.");
        }
        
        // 4. (Opcional) Buscar projeto
        Projeto projeto = null;
        if (requestDTO.getProjetoId() != null) {
            projeto = projetoRepositorio.findById(requestDTO.getProjetoId())
                    .orElseThrow(() -> new RuntimeException("Projeto não encontrado com ID: " + requestDTO.getProjetoId()));
        }

        // 5. Criar nova entidade Convite
        Convite novoConvite = new Convite();
        novoConvite.setTitulo(requestDTO.getTitulo());
        novoConvite.setMensagem(requestDTO.getMensagem());
        novoConvite.setRemetente(remetente);
        novoConvite.setDestinatario(destinatario);
        novoConvite.setProjeto(projeto); // Pode ser nulo
        novoConvite.setStatus(StatusConvite.PENDENTE); // Status inicial
        // dataEnvio é gerada automaticamente com @CreationTimestamp

        Convite conviteSalvo = conviteRepositorio.save(novoConvite);
        return mapToConviteDTO(conviteSalvo);
    }
} 