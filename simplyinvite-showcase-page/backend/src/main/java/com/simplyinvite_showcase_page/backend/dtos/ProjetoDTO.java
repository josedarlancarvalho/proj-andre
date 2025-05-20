package com.simplyinvite_showcase_page.backend.dtos;

import java.time.LocalDateTime;
// Para AvaliacaoDTO simplificado dentro do ProjetoDTO, se necessário
// import java.util.List;

public class ProjetoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private Long usuarioId; // ID do autor
    private String nomeAutor; // Nome do autor (a ser preenchido pelo serviço)
    private String avatarAutorUrl; // Avatar do autor (a ser preenchido pelo serviço)

    private String videoUrl;
    private String linkProjetoExterno;
    private String categoria;
    private String statusSubmissao;
    private LocalDateTime dataEnvio;
    private String thumbnailUrl;

    // Campos derivados das avaliações
    private String medalType; // Ex: "ouro", "prata", "bronze", "nenhuma"
    private int feedbackCount;
    private boolean hasFeedback; // Simplifica a verificação no frontend

    // Poderia incluir uma lista de AvaliacaoDTO simplificada se necessário
    // private List<FeedbackSimpleDTO> feedbacks;

    public ProjetoDTO() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getNomeAutor() { return nomeAutor; }
    public void setNomeAutor(String nomeAutor) { this.nomeAutor = nomeAutor; }
    public String getAvatarAutorUrl() { return avatarAutorUrl; }
    public void setAvatarAutorUrl(String avatarAutorUrl) { this.avatarAutorUrl = avatarAutorUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getLinkProjetoExterno() { return linkProjetoExterno; }
    public void setLinkProjetoExterno(String linkProjetoExterno) { this.linkProjetoExterno = linkProjetoExterno; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getStatusSubmissao() { return statusSubmissao; }
    public void setStatusSubmissao(String statusSubmissao) { this.statusSubmissao = statusSubmissao; }
    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public String getMedalType() { return medalType; }
    public void setMedalType(String medalType) { this.medalType = medalType; }
    public int getFeedbackCount() { return feedbackCount; }
    public void setFeedbackCount(int feedbackCount) { this.feedbackCount = feedbackCount; }
    public boolean isHasFeedback() { return hasFeedback; }
    public void setHasFeedback(boolean hasFeedback) { this.hasFeedback = hasFeedback; }
}
