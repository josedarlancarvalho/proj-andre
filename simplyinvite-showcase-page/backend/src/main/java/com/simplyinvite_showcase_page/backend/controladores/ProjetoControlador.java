package com.simplyinvite_showcase_page.backend.controladores;

// import com.simplyinvite_showcase_page.backend.modelos.Projeto; // Não mais retornado diretamente
import com.simplyinvite_showcase_page.backend.dtos.ProjetoDTO;
import com.simplyinvite_showcase_page.backend.servicos.ProjetoServico;
// import com.simplyinvite_showcase_page.backend.repositorios.ProjetoRepositorio; // Não mais usado diretamente
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
public class ProjetoControlador {
    // @Autowired
    // private ProjetoRepositorio projetoRepositorio; // Substituído pelo serviço

    @Autowired
    private ProjetoServico projetoServico;

    @GetMapping
    public ResponseEntity<List<ProjetoDTO>> listarTodosProjetos() {
        List<ProjetoDTO> projetos = projetoServico.getAllProjetosDTO();
        return ResponseEntity.ok(projetos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetoDTO> buscarProjetoPorId(@PathVariable Long id) {
        ProjetoDTO projetoDto = projetoServico.getProjetoDTOById(id);
        if (projetoDto != null) {
            return ResponseEntity.ok(projetoDto);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProjetoDTO>> listarProjetosPorUsuarioId(@PathVariable Long usuarioId) {
        List<ProjetoDTO> projetos = projetoServico.getProjetosDTOByUsuarioId(usuarioId);
        if (projetos.isEmpty()) {
            // Retorna ok com lista vazia em vez de 404 se o usuário não tiver projetos
            return ResponseEntity.ok(projetos);
        }
        return ResponseEntity.ok(projetos);
    }

    // Endpoints POST, PUT, DELETE podem ser ajustados depois para usar DTOs e o serviço
    /*
    @PostMapping
    public Projeto criarProjeto(@RequestBody Projeto projeto) {
        return projetoRepositorio.save(projeto);
    }

    @PutMapping("/{id}")
    public Projeto atualizarProjeto(@PathVariable Long id, @RequestBody Projeto projeto) {
        projeto.setId(id);
        return projetoRepositorio.save(projeto);
    }

    @DeleteMapping("/{id}")
    public void deletarProjeto(@PathVariable Long id) {
        projetoRepositorio.deleteById(id);
    }
    */
}
