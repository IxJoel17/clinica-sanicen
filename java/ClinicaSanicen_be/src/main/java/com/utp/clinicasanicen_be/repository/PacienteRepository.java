package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    Optional<Paciente> findByNroHistoria(String nroHistoria);
    Optional<Paciente> findByCorreo(String correo);
    
    @Query("SELECT MAX(p.nroHistoria) FROM Paciente p WHERE p.nroHistoria IS NOT NULL AND p.nroHistoria LIKE 'H%'")
    Optional<String> findMaxNroHistoria();
    
    @Query("SELECT p.nroHistoria FROM Paciente p WHERE p.nroHistoria IS NOT NULL AND p.nroHistoria LIKE 'H%'")
    List<String> findAllNroHistoriaStartingWithH();
}

