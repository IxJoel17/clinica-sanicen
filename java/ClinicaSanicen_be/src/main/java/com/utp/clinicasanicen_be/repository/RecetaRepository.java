package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Receta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Integer> {
    List<Receta> findByPacienteIdPaciente(Integer idPaciente);
    List<Receta> findByMedicoIdMedico(Integer idMedico);
}

