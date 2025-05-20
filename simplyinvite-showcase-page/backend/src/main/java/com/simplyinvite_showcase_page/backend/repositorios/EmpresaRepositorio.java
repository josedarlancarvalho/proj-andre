package com.simplyinvite_showcase_page.backend.repositorios;

import com.simplyinvite_showcase_page.backend.modelos.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaRepositorio extends JpaRepository<Empresa, Long> {
}
