package com.simplyinvite_showcase_page.backend.controladores;

import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.repositorios.UsuarioRepositorio;
import com.simplyinvite_showcase_page.backend.seguranca.JwtUtil;
import com.simplyinvite_showcase_page.backend.dtos.LoginRequest;
import com.simplyinvite_showcase_page.backend.dtos.UsuarioLoginResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Usuario user = usuarioRepositorio.findByEmail(loginRequest.getEmail());
        if (user != null && passwordEncoder.matches(loginRequest.getSenha(), user.getSenha())) {
            String token = JwtUtil.gerarToken(user);

            UsuarioLoginResponseDTO usuarioResponse = new UsuarioLoginResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getNomeCompleto(),
                user.getTipoPerfil(),
                user.getAvatarUrl(),
                user.isOnboardingComplete()
            );

            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
                put("token", token);
                put("tipoPerfil", user.getTipoPerfil());
                put("usuario", usuarioResponse);
            }});
        } else {
            return ResponseEntity.status(401).body(new java.util.HashMap<String, Object>() {{
                put("mensagem", "Credenciais inválidas");
            }});
        }
    }

    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getMeuPerfil(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(new java.util.HashMap<String, Object>() {{
                put("mensagem", "Não autorizado: Nenhum usuário autenticado encontrado.");
            }});
        }

        Usuario usuario = usuarioRepositorio.findByEmail(userDetails.getUsername());

        if (usuario == null) {
            return ResponseEntity.status(404).body(new java.util.HashMap<String, Object>() {{
                put("mensagem", "Usuário não encontrado no banco de dados.");
            }});
        }

        UsuarioLoginResponseDTO usuarioResponse = new UsuarioLoginResponseDTO(
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNomeCompleto(),
            usuario.getTipoPerfil(),
            usuario.getAvatarUrl(),
            usuario.isOnboardingComplete()
        );
        
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("usuario", usuarioResponse);
            put("tipoPerfil", usuario.getTipoPerfil());
        }});
    }
}
