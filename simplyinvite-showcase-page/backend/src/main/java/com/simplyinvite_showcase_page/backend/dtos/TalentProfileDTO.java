package com.simplyinvite_showcase_page.backend.dtos;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Arrays;

public class TalentProfileDTO {
    private Long id;
    private String nomeCompleto;
    private String email;
    private String avatarUrl;
    private String cidade;
    private String estado;
    private String bio;
    private String linkedinUrl;
    private String githubUrl;
    private Integer idade; // Calculado
    private List<String> areasInteresse;
    private List<String> habilidadesPrincipais;

    // Construtor pode ser útil para mapeamento no serviço
    public TalentProfileDTO() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public Integer getIdade() { return idade; }
    public List<String> getAreasInteresse() { return areasInteresse; }
    public List<String> getHabilidadesPrincipais() { return habilidadesPrincipais; }

    // Métodos auxiliares para calcular/definir campos derivados
    public void setDataNascimento(LocalDate dataNascimento) {
        if (dataNascimento != null) {
            this.idade = Period.between(dataNascimento, LocalDate.now()).getYears();
        }
    }

    public void setAreasInteresseFromString(String areas) {
        if (areas != null && !areas.isEmpty()) {
            this.areasInteresse = Arrays.asList(areas.split(","));
        } else {
            this.areasInteresse = List.of();
        }
    }

    public void setHabilidadesPrincipaisFromString(String habilidades) {
        if (habilidades != null && !habilidades.isEmpty()) {
            this.habilidadesPrincipais = Arrays.asList(habilidades.split(","));
        } else {
            this.habilidadesPrincipais = List.of();
        }
    }
} 