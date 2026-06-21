package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.dto.report.ReporteCitasEspecialidadDTO;
import com.utp.clinicasanicen_be.entity.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Integer> {

    List<Cita> findByPacienteIdPaciente(Integer idPaciente);

    List<Cita> findByMedicoIdMedico(Integer idMedico);

    List<Cita> findByMedicoIdMedicoAndFechaAndHora(Integer idMedico, LocalDate fecha, LocalTime hora);

    List<Cita> findByMedicoIdMedicoAndFecha(Integer idMedico, LocalDate fecha);

    @Query("""
           SELECT new com.utp.clinicasanicen_be.dto.report.ReporteCitasEspecialidadDTO(
               c.medico.especialidad.nombre,
               COUNT(c)
           )
           FROM Cita c
           WHERE c.fecha BETWEEN :fechaInicio AND :fechaFin
           GROUP BY c.medico.especialidad.nombre
           ORDER BY COUNT(c) DESC
           """)
    List<ReporteCitasEspecialidadDTO> contarCitasPorEspecialidad(
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin
    );
}