package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {
    List<Venta> findByUsuarioIdUsuario(Integer idUsuario);
    List<Venta> findByRecetaIdReceta(Integer idReceta);
}

