package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.dto.request.PacienteRequestDTO;
import com.utp.clinicasanicen_be.dto.response.PacienteResponseDTO;
import com.utp.clinicasanicen_be.service.IPacienteService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {
    
    private static final Logger logger = LoggerFactory.getLogger(PacienteController.class);
    
    @Autowired
    private IPacienteService pacienteService;
    
    @GetMapping
    public ResponseEntity<List<PacienteResponseDTO>> getAllPacientes() {
        logger.info("Solicitud para listar todos los pacientes");
        List<PacienteResponseDTO> pacientes = pacienteService.getAllPacientes();
        logger.debug("Total de pacientes encontrados: {}", pacientes.size());
        return ResponseEntity.ok(pacientes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> getPacienteById(@PathVariable Integer id) {
        logger.info("Solicitud para obtener paciente por ID: {}", id);
        PacienteResponseDTO paciente = pacienteService.getPacienteById(id);
        return ResponseEntity.ok(paciente);
    }
    
    @GetMapping("/correo/{correo}")
    public ResponseEntity<PacienteResponseDTO> getPacienteByCorreo(@PathVariable String correo) {
        logger.info("Solicitud para obtener paciente por correo: {}", correo);
        PacienteResponseDTO paciente = pacienteService.getPacienteByCorreo(correo);
        return ResponseEntity.ok(paciente);
    }
    
    @PostMapping
    public ResponseEntity<PacienteResponseDTO> crearPaciente(@Valid @RequestBody PacienteRequestDTO dto) {
        logger.info("Solicitud para crear nuevo paciente: {} {}", dto.getNombre(), dto.getApellido());
        PacienteResponseDTO pacienteCreado = pacienteService.crearPaciente(dto);
        logger.info("Paciente creado exitosamente con ID: {}", pacienteCreado.getIdPaciente());
        return ResponseEntity.status(HttpStatus.CREATED).body(pacienteCreado);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> actualizarPaciente(
            @PathVariable Integer id, 
            @Valid @RequestBody PacienteRequestDTO dto) {
        logger.info("Solicitud para actualizar paciente con ID: {}", id);
        PacienteResponseDTO pacienteActualizado = pacienteService.actualizarPaciente(id, dto);
        logger.info("Paciente actualizado exitosamente con ID: {}", id);
        return ResponseEntity.ok(pacienteActualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable Integer id) {
        logger.info("Solicitud para eliminar paciente con ID: {}", id);
        pacienteService.eliminarPaciente(id);
        logger.info("Paciente eliminado exitosamente con ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}
