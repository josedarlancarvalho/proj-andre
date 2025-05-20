package com.simplyinvite_showcase_page.backend.modelos;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
// import java.util.List; // Para @ElementCollection ou @OneToMany futuro

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private String nomeCompleto;

    @Column(nullable = false)
    private String tipoPerfil; // talent, hr, manager

    // Campos adicionados
    private String avatarUrl;
    private String telefone;
    private String cidade;
    private String estado;

    @Lob // Para textos mais longos
    private String bio;

    private String linkedinUrl;
    private String githubUrl;

    // Campos específicos para Talento
    private LocalDate dataNascimento; // Para calcular idade
    
    @Column(length = 1000) // Aumentar tamanho se necessário
    private String areasInteresse; // Ex: "Desenvolvimento Web,IA,Mobile"
    
    @Column(length = 1000)
    private String habilidadesPrincipais; // Ex: "React,Node.js,Python"

    // Campos específicos para RH/Gestor
    private String cargoNaEmpresa;

    @ManyToOne(fetch = FetchType.LAZY) // LAZY para não carregar sempre a empresa
    @JoinColumn(name = "empresa_id") // Chave estrangeira na tabela usuarios
    private Empresa empresa;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean onboardingComplete = false;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    public String getTipoPerfil() { return tipoPerfil; }
    public void setTipoPerfil(String tipoPerfil) { this.tipoPerfil = tipoPerfil; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
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
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    public String getAreasInteresse() { return areasInteresse; }
    public void setAreasInteresse(String areasInteresse) { this.areasInteresse = areasInteresse; }
    public String getHabilidadesPrincipais() { return habilidadesPrincipais; }
    public void setHabilidadesPrincipais(String habilidadesPrincipais) { this.habilidadesPrincipais = habilidadesPrincipais; }
    public String getCargoNaEmpresa() { return cargoNaEmpresa; }
    public void setCargoNaEmpresa(String cargoNaEmpresa) { this.cargoNaEmpresa = cargoNaEmpresa; }
    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public boolean isOnboardingComplete() { return onboardingComplete; }
    public void setOnboardingComplete(boolean onboardingComplete) { this.onboardingComplete = onboardingComplete; }

    // Métodos UserDetails Implementados
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (tipoPerfil == null) {
            return Collections.emptyList();
        }
        String role = tipoPerfil.toUpperCase();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email; // Usando email como username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Por enquanto, sempre verdadeiro
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Por enquanto, sempre verdadeiro
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Por enquanto, sempre verdadeiro
    }

    @Override
    public boolean isEnabled() {
        return true; // Por enquanto, sempre verdadeiro
    }
}
