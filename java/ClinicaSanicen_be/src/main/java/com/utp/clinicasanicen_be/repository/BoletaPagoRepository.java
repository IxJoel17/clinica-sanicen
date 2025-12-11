package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.BoletaPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BoletaPagoRepository extends JpaRepository<BoletaPago, Integer> {
    List<BoletaPago> findByPacienteIdPaciente(Integer idPaciente);
    Optional<BoletaPago> findByCitaIdCita(Integer idCita);
}

