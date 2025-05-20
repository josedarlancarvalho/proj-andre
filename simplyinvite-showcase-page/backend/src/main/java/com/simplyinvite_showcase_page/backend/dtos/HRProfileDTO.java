package com.simplyinvite_showcase_page.backend.dtos;

// Poderíamos ter um TeamMemberDTO se quiséssemos detalhar membros da equipe
// import java.util.List;

public class HRProfileDTO {
    // Dados do Usuário RH
    private Long rhUserId;
    private String nomeContatoRH;
    private String emailContatoRH;
    private String avatarUrlRH;
    private String cargoNaEmpresa;

    // Dados da Empresa associada
    private Long empresaId;
    private String nomeEmpresa;
    private String cnpjEmpresa;
    private String setorEmpresa; // Adicionar ao modelo Empresa se não existir
    private String localizacaoEmpresa; // Adicionar ao modelo Empresa se não existir
    private String descricaoEmpresa; // Adicionar ao modelo Empresa se não existir
    // private List<TeamMemberDTO> teamMembers; // Para uma futura evolução

    public HRProfileDTO() {}

    // Getters e Setters
    public Long getRhUserId() { return rhUserId; }
    public void setRhUserId(Long rhUserId) { this.rhUserId = rhUserId; }
    public String getNomeContatoRH() { return nomeContatoRH; }
    public void setNomeContatoRH(String nomeContatoRH) { this.nomeContatoRH = nomeContatoRH; }
    public String getEmailContatoRH() { return emailContatoRH; }
    public void setEmailContatoRH(String emailContatoRH) { this.emailContatoRH = emailContatoRH; }
    public String getAvatarUrlRH() { return avatarUrlRH; }
    public void setAvatarUrlRH(String avatarUrlRH) { this.avatarUrlRH = avatarUrlRH; }
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