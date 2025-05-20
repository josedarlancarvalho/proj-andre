package com.simplyinvite_showcase_page.backend.controladores;

import com.simplyinvite_showcase_page.backend.modelos.Empresa;
import com.simplyinvite_showcase_page.backend.repositorios.EmpresaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaControlador {
    @Autowired
    private EmpresaRepositorio empresaRepositorio;

    @GetMapping
    public List<Empresa> listarEmpresas() {
        return empresaRepositorio.findAll();
    }

    @PostMapping
    public Empresa criarEmpresa(@RequestBody Empresa empresa) {
        return empresaRepositorio.save(empresa);
    }

    @GetMapping("/{id}")
    public Empresa buscarEmpresa(@PathVariable Long id) {
        return empresaRepositorio.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Empresa atualizarEmpresa(@PathVariable Long id, @RequestBody Empresa empresa) {
        empresa.setId(id);
        return empresaRepositorio.save(empresa);
    }

    @DeleteMapping("/{id}")
    public void deletarEmpresa(@PathVariable Long id) {
        empresaRepositorio.deleteById(id);
    }
}
