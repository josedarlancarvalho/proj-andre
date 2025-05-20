package com.simplyinvite_showcase_page.backend.controladores;

import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import com.simplyinvite_showcase_page.backend.servicos.UsuarioServico;
import com.simplyinvite_showcase_page.backend.dtos.OnboardingRequestDTO;
import com.simplyinvite_showcase_page.backend.dtos.UsuarioLoginResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioControlador {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private UsuarioServico usuarioServico;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioRepositorio.findAll();
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepositorio.save(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Long id) {
        return usuarioRepositorio.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/perfil")
    public ResponseEntity<?> buscarPerfilUsuario(@PathVariable Long id) {
        Object perfilDto = usuarioServico.getProfileDtoByUserId(id);
        if (perfilDto != null) {
            return ResponseEntity.ok(perfilDto);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public Usuario atualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return usuarioRepositorio.save(usuario);
    }

    @DeleteMapping("/{id}")
    public void deletarUsuario(@PathVariable Long id) {
        usuarioRepositorio.deleteById(id);
    }

    @PutMapping("/me/onboarding")
    public ResponseEntity<?> completarOnboarding(@AuthenticationPrincipal UserDetails userDetails, 
                                                 @RequestBody OnboardingRequestDTO onboardingData) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Não autorizado: Nenhum usuário autenticado encontrado.");
        }

        Usuario usuario = usuarioRepositorio.findByEmail(userDetails.getUsername());
        if (usuario == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado no banco de dados.");
        }

        if (onboardingData.getExperiences() != null) {
            usuario.setBio(onboardingData.getExperiences());
        }
        if (onboardingData.getPortfolioLinks() != null) {
            usuario.setGithubUrl(onboardingData.getPortfolioLinks());
        }
        if (onboardingData.getEducationalBackground() != null){
            // Você pode querer salvar isso em um campo específico se "bio" já estiver em uso
            // ou concatenar com a bio existente.
            // Ex: usuario.setFormacao(onboardingData.getEducationalBackground());
        }
        
        usuario.setOnboardingComplete(true);
        Usuario usuarioSalvo = usuarioRepositorio.save(usuario);

        UsuarioLoginResponseDTO usuarioResponse = new UsuarioLoginResponseDTO(
            usuarioSalvo.getId(),
            usuarioSalvo.getEmail(),
            usuarioSalvo.getNomeCompleto(),
            usuarioSalvo.getTipoPerfil(),
            usuarioSalvo.getAvatarUrl(),
            usuarioSalvo.isOnboardingComplete()
        );

        return ResponseEntity.ok(usuarioResponse);
    }
}
