package com.simplyinvite_showcase_page.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CriarConviteRequestDTO {

    @NotBlank(message = "O título é obrigatório.")
    @Size(min = 5, max = 100, message = "O título deve ter entre 5 e 100 caracteres.")
    private String titulo;

    @NotBlank(message = "A mensagem é obrigatória.")
    @Size(min = 10, max = 2000, message = "A mensagem deve ter entre 10 e 2000 caracteres.")
    private String mensagem;

    @NotNull(message = "O ID do destinatário é obrigatório.")
    private Long destinatarioId;

    private Long projetoId; // Opcional

    // Getters e Setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public Long getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(Long destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public Long getProjetoId() {
        return projetoId;
    }

    public void setProjetoId(Long projetoId) {
        this.projetoId = projetoId;
    }
} 