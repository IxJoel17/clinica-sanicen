package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Referencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReferenciaRepository extends JpaRepository<Referencia, Integer> {
    List<Referencia> findByPacienteIdPaciente(Integer idPaciente);
    List<Referencia> findByMedicoIdMedico(Integer idMedico);
}

