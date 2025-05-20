package com.simplyinvite_showcase_page.backend.controladores;

import com.simplyinvite_showcase_page.backend.dtos.ConviteDTO;
import com.simplyinvite_showcase_page.backend.modelos.StatusConvite;
import com.simplyinvite_showcase_page.backend.modelos.Usuario;
import com.simplyinvite_showcase_page.backend.servicos.ConviteServico;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.simplyinvite_showcase_page.backend.dtos.CriarConviteRequestDTO;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

import java.util.List;

// DTO para a requisição de resposta ao convite
class ResponderConviteRequestDTO {
    private StatusConvite status;
    public StatusConvite getStatus() { return status; }
    public void setStatus(StatusConvite status) { this.status = status; }
}

@RestController
@RequestMapping("/api/convites")
public class ConviteControlador {

    @Autowired
    private ConviteServico conviteServico;

    // Endpoint para o usuário autenticado (Talento) buscar seus convites recebidos
    @GetMapping("/recebidos")
    public ResponseEntity<List<ConviteDTO>> getConvitesRecebidos(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(401).build(); // Não autorizado se não houver usuário
        }
        // Validar se o usuário é do tipo TALENT se necessário, ex:
        // if (!"talent".equalsIgnoreCase(usuarioAutenticado.getTipoPerfil())) { ... }
        List<ConviteDTO> convites = conviteServico.getConvitesRecebidosPorUsuario(usuarioAutenticado.getId());
        return ResponseEntity.ok(convites);
    }

    // Endpoint para o usuário autenticado (RH/Gestor) buscar seus convites enviados
    @GetMapping("/enviados")
    public ResponseEntity<List<ConviteDTO>> getConvitesEnviados(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(401).build();
        }
        // Validar se o usuário é do tipo HR ou MANAGER se necessário
        List<ConviteDTO> convites = conviteServico.getConvitesEnviadosPorUsuario(usuarioAutenticado.getId());
        return ResponseEntity.ok(convites);
    }

    // Endpoint para o usuário autenticado (Talento) responder a um convite
    @PostMapping("/{conviteId}/responder")
    public ResponseEntity<ConviteDTO> responderConvite(@PathVariable Long conviteId,
                                                     @RequestBody ResponderConviteRequestDTO requestDTO,
                                                     @AuthenticationPrincipal Usuario usuarioAutenticado) {
        if (usuarioAutenticado == null) {
            return ResponseEntity.status(401).build();
        }
        
        if (requestDTO.getStatus() == null || 
            (requestDTO.getStatus() != StatusConvite.ACEITO && requestDTO.getStatus() != StatusConvite.RECUSADO)) {
            // Considerar lançar uma exceção que pode ser tratada por um @ControllerAdvice para respostas de erro melhores
            return ResponseEntity.badRequest().body(null); // Ou um DTO de erro
        }

        ConviteDTO conviteAtualizado = conviteServico.responderConvite(conviteId, requestDTO.getStatus(), usuarioAutenticado.getId());
        return ResponseEntity.ok(conviteAtualizado);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ConviteDTO> criarConvite(@Valid @RequestBody CriarConviteRequestDTO criarConviteDTO,
                                                 @AuthenticationPrincipal Usuario remetenteAutenticado) {
        if (remetenteAutenticado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Não autorizado
        }
        ConviteDTO novoConvite = conviteServico.criarConvite(criarConviteDTO, remetenteAutenticado);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoConvite);
    }
} 