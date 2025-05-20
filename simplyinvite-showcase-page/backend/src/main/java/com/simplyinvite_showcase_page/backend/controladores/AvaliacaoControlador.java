package com.simplyinvite_showcase_page.backend.controladores;

// import com.simplyinvite_showcase_page.backend.modelos.Avaliacao; // Não mais retornado diretamente
import com.simplyinvite_showcase_page.backend.dtos.AvaliacaoDTO;
import com.simplyinvite_showcase_page.backend.servicos.AvaliacaoServico;
// import com.simplyinvite_showcase_page.backend.repositorios.AvaliacaoRepositorio; // Não mais usado diretamente
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoControlador {

    @Autowired
    private AvaliacaoServico avaliacaoServico;

    // Endpoint para buscar todas as avaliações de um projeto específico
    @GetMapping("/projeto/{projetoId}")
    public ResponseEntity<List<AvaliacaoDTO>> listarAvaliacoesPorProjetoId(@PathVariable Long projetoId) {
        List<AvaliacaoDTO> avaliacoes = avaliacaoServico.getAvaliacoesByProjetoId(projetoId);
        // Retorna OK com lista vazia se não houver avaliações, o que é um estado válido.
        return ResponseEntity.ok(avaliacoes);
    }

    // Os endpoints GET gerais, POST, PUT, DELETE podem ser ajustados ou adicionados conforme necessário.
    // Por exemplo, um GET /{id} para buscar uma AvaliacaoDTO específica.
    // Um POST para criar uma nova avaliação, recebendo um DTO e usando o serviço.

    /* Exemplo de como poderia ser o POST (requer ajustes no serviço e DTO de entrada)
    @PostMapping
    public ResponseEntity<AvaliacaoDTO> criarAvaliacao(@RequestBody CriarAvaliacaoRequestDTO requestDTO) {
        AvaliacaoDTO novaAvaliacao = avaliacaoServico.criarNovaAvaliacao(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaAvaliacao);
    }
    */

    /* GET geral antigo - pode ser removido ou ajustado para DTOs se necessário
    @GetMapping
    public List<Avaliacao> listarAvaliacoes() {
        return avaliacaoRepositorio.findAll();
    }
    */
}
