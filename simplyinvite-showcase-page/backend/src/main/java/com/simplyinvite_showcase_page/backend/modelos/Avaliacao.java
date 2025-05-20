package com.simplyinvite_showcase_page.backend.modelos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projeto_id", nullable = false)
    @JsonBackReference
    private Projeto projeto;

    @Column(nullable = false)
    private Long avaliadorId;

    @Lob
    @Column(nullable = false)
    private String comentario;

    @Column(nullable = false)
    private Integer nota;

    private LocalDateTime dataAvaliacao;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Projeto getProjeto() { return projeto; }
    public void setProjeto(Projeto projeto) { this.projeto = projeto; }
    public Long getAvaliadorId() { return avaliadorId; }
    public void setAvaliadorId(Long avaliadorId) { this.avaliadorId = avaliadorId; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
    public LocalDateTime getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDateTime dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }
}
