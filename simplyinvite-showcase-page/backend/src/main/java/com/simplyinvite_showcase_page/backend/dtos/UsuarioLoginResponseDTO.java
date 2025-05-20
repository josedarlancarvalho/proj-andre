package com.simplyinvite_showcase_page.backend.dtos;

public class UsuarioLoginResponseDTO {
    private Long id;
    private String email;
    private String nomeCompleto;
    private String tipoPerfil;
    private String avatarUrl;
    private boolean onboardingComplete;
    // Adicione outros campos não-LOB que você queira na resposta do login, se necessário

    // Construtor
    public UsuarioLoginResponseDTO(Long id, String email, String nomeCompleto, String tipoPerfil, String avatarUrl, boolean onboardingComplete) {
        this.id = id;
        this.email = email;
        this.nomeCompleto = nomeCompleto;
        this.tipoPerfil = tipoPerfil;
        this.avatarUrl = avatarUrl;
        this.onboardingComplete = onboardingComplete;
    }

    // Getters (Setters não são estritamente necessários para um DTO de resposta, mas podem ser incluídos)
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public String getTipoPerfil() {
        return tipoPerfil;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public boolean isOnboardingComplete() {
        return onboardingComplete;
    }

    // Setters (opcional)
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public void setTipoPerfil(String tipoPerfil) {
        this.tipoPerfil = tipoPerfil;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setOnboardingComplete(boolean onboardingComplete) {
        this.onboardingComplete = onboardingComplete;
    }
} 