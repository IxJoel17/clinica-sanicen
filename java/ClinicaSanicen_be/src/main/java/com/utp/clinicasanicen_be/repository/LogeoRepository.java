package com.utp.clinicasanicen_be.repository;

import com.utp.clinicasanicen_be.entity.Logeo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LogeoRepository extends JpaRepository<Logeo, Integer> {
    Optional<Logeo> findByNombreUsuario(String nombreUsuario);
    Optional<Logeo> findByNombreUsuarioAndContrasena(String nombreUsuario, String contrasena);
}

