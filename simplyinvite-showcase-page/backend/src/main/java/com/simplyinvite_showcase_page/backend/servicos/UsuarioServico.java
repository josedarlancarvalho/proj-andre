package com.simplyinvite_showcase_page.backend.servicos;

import com.simplyinvite_showcase_page.backend.dtos.HRProfileDTO;
import com.simplyinvite_showcase_page.backend.dtos.ManagerProfileDTO;
import com.simplyinvite_showcase_page.backend.dtos.TalentProfileDTO;
import com.simplyinvite_showcase_page.backend.modelos.Empresa;
import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioServico {
    
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    public Object getProfileDtoByUserId(Long userId) {
        Optional<Usuario> usuarioOpt = usuarioRepositorio.findById(userId);
        if (usuarioOpt.isEmpty()) {
            return null; // Ou lançar uma exceção UserNotFoundException
        }

        Usuario usuario = usuarioOpt.get();
        String tipoPerfil = usuario.getTipoPerfil();

        if ("talent".equalsIgnoreCase(tipoPerfil)) {
            TalentProfileDTO dto = new TalentProfileDTO();
            dto.setId(usuario.getId());
            dto.setNomeCompleto(usuario.getNomeCompleto());
            dto.setEmail(usuario.getEmail());
            dto.setAvatarUrl(usuario.getAvatarUrl());
            dto.setCidade(usuario.getCidade());
            dto.setEstado(usuario.getEstado());
            dto.setBio(usuario.getBio());
            dto.setLinkedinUrl(usuario.getLinkedinUrl());
            dto.setGithubUrl(usuario.getGithubUrl());
            if (usuario.getDataNascimento() != null) {
                dto.setDataNascimento(usuario.getDataNascimento()); // Calcula a idade internamente
            }
            if (usuario.getAreasInteresse() != null) {
                dto.setAreasInteresseFromString(usuario.getAreasInteresse());
            }
            if (usuario.getHabilidadesPrincipais() != null) {
                dto.setHabilidadesPrincipaisFromString(usuario.getHabilidadesPrincipais());
            }
            return dto;
        } else if ("hr".equalsIgnoreCase(tipoPerfil)) {
            HRProfileDTO dto = new HRProfileDTO();
            dto.setRhUserId(usuario.getId());
            dto.setNomeContatoRH(usuario.getNomeCompleto());
            dto.setEmailContatoRH(usuario.getEmail());
            dto.setAvatarUrlRH(usuario.getAvatarUrl());
            dto.setCargoNaEmpresa(usuario.getCargoNaEmpresa());

            Empresa empresa = usuario.getEmpresa();
            if (empresa != null) {
                dto.setEmpresaId(empresa.getId());
                dto.setNomeEmpresa(empresa.getNome());
                dto.setCnpjEmpresa(empresa.getCnpj());
                dto.setSetorEmpresa(empresa.getSetor());
                dto.setLocalizacaoEmpresa(empresa.getLocalizacao());
                dto.setDescricaoEmpresa(empresa.getDescricao());
            }
            return dto;
        } else if ("manager".equalsIgnoreCase(tipoPerfil)) {
            ManagerProfileDTO dto = new ManagerProfileDTO();
            dto.setManagerUserId(usuario.getId());
            dto.setNomeContatoGestor(usuario.getNomeCompleto());
            dto.setEmailContatoGestor(usuario.getEmail());
            dto.setAvatarUrlGestor(usuario.getAvatarUrl());
            dto.setCargoNaEmpresa(usuario.getCargoNaEmpresa());

            Empresa empresa = usuario.getEmpresa();
            if (empresa != null) {
                dto.setEmpresaId(empresa.getId());
                dto.setNomeEmpresa(empresa.getNome());
                dto.setCnpjEmpresa(empresa.getCnpj());
                dto.setSetorEmpresa(empresa.getSetor());
                dto.setLocalizacaoEmpresa(empresa.getLocalizacao());
                dto.setDescricaoEmpresa(empresa.getDescricao());
            }
            return dto;
        }

        return null; // Tipo de perfil desconhecido ou não mapeado
    }
}
