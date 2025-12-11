package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Integer> {
    List<Medico> findByEspecialidadIdEspecialidad(Integer idEspecialidad);
    List<Medico> findByActivoTrue();
    Optional<Medico> findByCorreo(String correo);
}

