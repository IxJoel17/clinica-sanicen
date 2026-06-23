package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.DetalleReceta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleRecetaRepository extends JpaRepository<DetalleReceta, Integer> {

    List<DetalleReceta> findByRecetaIdReceta(Integer idReceta);
}