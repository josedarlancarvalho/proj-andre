package com.simplyinvite_showcase_page.backend.dtos;

public class ManagerProfileDTO {
    // Dados do Usuário Gestor
    private Long managerUserId;
    private String nomeContatoGestor;
    private String emailContatoGestor;
    private String avatarUrlGestor;
    private String cargoNaEmpresa;

    // Dados da Empresa associada
    private Long empresaId;
    private String nomeEmpresa;
    private String cnpjEmpresa;
    private String setorEmpresa;
    private String localizacaoEmpresa;
    private String descricaoEmpresa;

    public ManagerProfileDTO() {}

    // Getters e Setters
    public Long getManagerUserId() { return managerUserId; }
    public void setManagerUserId(Long managerUserId) { this.managerUserId = managerUserId; }
    public String getNomeContatoGestor() { return nomeContatoGestor; }
    public void setNomeContatoGestor(String nomeContatoGestor) { this.nomeContatoGestor = nomeContatoGestor; }
    public String getEmailContatoGestor() { return emailContatoGestor; }
    public void setEmailContatoGestor(String emailContatoGestor) { this.emailContatoGestor = emailContatoGestor; }
    public String getAvatarUrlGestor() { return avatarUrlGestor; }
    public void setAvatarUrlGestor(String avatarUrlGestor) { this.avatarUrlGestor = avatarUrlGestor; }
    public String getCargoNaEmpresa() { return cargoNaEmpresa; }
    public void setCargoNaEmpresa(String cargoNaEmpresa) { this.cargoNaEmpresa = cargoNaEmpresa; }
    public Long getEmpresaId() { return empresaId; }
    public void setEmpresaId(Long empresaId) { this.empresaId = empresaId; }
    public String getNomeEmpresa() { return nomeEmpresa; }
    public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }
    public String getCnpjEmpresa() { return cnpjEmpresa; }
    public void setCnpjEmpresa(String cnpjEmpresa) { this.cnpjEmpresa = cnpjEmpresa; }
    public String getSetorEmpresa() { return setorEmpresa; }
    public void setSetorEmpresa(String setorEmpresa) { this.setorEmpresa = setorEmpresa; }
    public String getLocalizacaoEmpresa() { return localizacaoEmpresa; }
    public void setLocalizacaoEmpresa(String localizacaoEmpresa) { this.localizacaoEmpresa = localizacaoEmpresa; }
    public String getDescricaoEmpresa() { return descricaoEmpresa; }
    public void setDescricaoEmpresa(String descricaoEmpresa) { this.descricaoEmpresa = descricaoEmpresa; }
} 