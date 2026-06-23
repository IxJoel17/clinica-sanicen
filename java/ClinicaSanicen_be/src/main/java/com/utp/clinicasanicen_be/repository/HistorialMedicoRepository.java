package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.HistorialMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialMedicoRepository extends JpaRepository<HistorialMedico, Integer> {

    List<HistorialMedico> findByPacienteIdPaciente(Integer idPaciente);

    List<HistorialMedico> findByMedicoIdMedico(Integer idMedico);
}