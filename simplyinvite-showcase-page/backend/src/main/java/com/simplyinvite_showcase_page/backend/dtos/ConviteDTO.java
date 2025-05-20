package com.simplyinvite_showcase_page.backend.dtos;

import com.simplyinvite_showcase_page.backend.modelos.StatusConvite;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConviteDTO {
    private Long id;
    private String titulo;
    private String mensagem;
    private StatusConvite status;
    private LocalDateTime dataEnvio;
    private LocalDateTime dataResposta;

    // Dados do Remetente
    private Long remetenteId;
    private String nomeRemetente;
    private String avatarRemetenteUrl;
    private String cargoRemetente;
    private String empresaRemetenteNome; // Nome da empresa do remetente (RH/Gestor)

    // Dados do Destinatário (Talento)
    private Long destinatarioId;
    private String nomeDestinatario;
    private String avatarDestinatarioUrl;

    // Dados do Projeto (opcional)
    private Long projetoId;
    private String tituloProjeto;
    private String thumbnailProjetoUrl;
} 