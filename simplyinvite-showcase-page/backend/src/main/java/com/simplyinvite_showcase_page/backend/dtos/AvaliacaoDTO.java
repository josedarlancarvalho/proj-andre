package com.simplyinvite_showcase_page.backend.dtos;

import java.time.LocalDateTime;

public class AvaliacaoDTO {
    private Long id;
    private Long projetoId;
    private String tituloProjeto;

    private Long avaliadorId;
    private String avaliadorNome;
    private String avaliadorCargo;
    private String avatarAvaliadorUrl;

    private String comentario;
    private Integer nota;
    private String medalType;
    private LocalDateTime dataAvaliacao;

    public AvaliacaoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProjetoId() { return projetoId; }
    public void setProjetoId(Long projetoId) { this.projetoId = projetoId; }
    public String getTituloProjeto() { return tituloProjeto; }
    public void setTituloProjeto(String tituloProjeto) { this.tituloProjeto = tituloProjeto; }
    public Long getAvaliadorId() { return avaliadorId; }
    public void setAvaliadorId(Long avaliadorId) { this.avaliadorId = avaliadorId; }
    public String getAvaliadorNome() { return avaliadorNome; }
    public void setAvaliadorNome(String avaliadorNome) { this.avaliadorNome = avaliadorNome; }
    public String getAvaliadorCargo() { return avaliadorCargo; }
    public void setAvaliadorCargo(String avaliadorCargo) { this.avaliadorCargo = avaliadorCargo; }
    public String getAvatarAvaliadorUrl() { return avatarAvaliadorUrl; }
    public void setAvatarAvaliadorUrl(String avatarAvaliadorUrl) { this.avatarAvaliadorUrl = avatarAvaliadorUrl; }
    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }
    public String getMedalType() { return medalType; }
    public void setMedalType(String medalType) { this.medalType = medalType; }
    public LocalDateTime getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDateTime dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public void derivarMedalTypeDaNota() {
        if (this.nota == null) {
            this.medalType = "nenhuma";
            return;
        }
        if (this.nota >= 9) {
            this.medalType = "ouro";
        } else if (this.nota >= 7) {
            this.medalType = "prata";
        } else if (this.nota >= 5) {
            this.medalType = "bronze";
        } else {
            this.medalType = "nenhuma";
        }
    }
}
