package com.simplyinvite_showcase_page.backend.modelos;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "projetos")
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Lob // Para descrições mais longas
    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private Long usuarioId;

    // Campos adicionados
    private String videoUrl;
    private String linkProjetoExterno;
    private String categoria;
    private String statusSubmissao; // Ex: "Pendente", "Em Avaliação", "Avaliado", "Aprovado"
    private LocalDateTime dataEnvio;
    private String thumbnailUrl;

    @OneToMany(mappedBy = "projeto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Avaliacao> avaliacoes;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

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
    public List<Avaliacao> getAvaliacoes() { return avaliacoes; }
    public void setAvaliacoes(List<Avaliacao> avaliacoes) { this.avaliacoes = avaliacoes; }
}
