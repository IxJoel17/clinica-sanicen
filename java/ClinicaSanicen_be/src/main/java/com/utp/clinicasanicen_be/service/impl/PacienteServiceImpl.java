package com.utp.clinicasanicen_be.service.impl;

import com.utp.clinicasanicen_be.dto.request.PacienteRequestDTO;
import com.utp.clinicasanicen_be.dto.response.PacienteResponseDTO;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.exception.ResourceNotFoundException;
import com.utp.clinicasanicen_be.mapper.PacienteMapper;
import com.utp.clinicasanicen_be.repository.PacienteRepository;
import com.utp.clinicasanicen_be.service.IPacienteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de Paciente
 * Contiene la lógica de negocio para operaciones con pacientes
 */
@Service
public class PacienteServiceImpl implements IPacienteService {
    
    private static final Logger logger = LoggerFactory.getLogger(PacienteServiceImpl.class);
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private PacienteMapper pacienteMapper;
    
    @Override
    public List<PacienteResponseDTO> getAllPacientes() {
        logger.info("Obteniendo todos los pacientes");
        List<Paciente> pacientes = pacienteRepository.findAll();
        logger.debug("Total de pacientes encontrados: {}", pacientes.size());
        return pacientes.stream()
                .map(pacienteMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public PacienteResponseDTO getPacienteById(Integer id) {
        logger.info("Buscando paciente con ID: {}", id);
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Paciente no encontrado con ID: {}", id);
                    return new ResourceNotFoundException("Paciente no encontrado con ID: " + id);
                });
        logger.debug("Paciente encontrado: {} {}", paciente.getNombre(), paciente.getApellido());
        return pacienteMapper.toResponseDTO(paciente);
    }
    
    @Override
    public PacienteResponseDTO getPacienteByCorreo(String correo) {
        logger.info("Buscando paciente con correo: {}", correo);
        Paciente paciente = pacienteRepository.findByCorreo(correo)
                .orElseThrow(() -> {
                    logger.warn("Paciente no encontrado con correo: {}", correo);
                    return new ResourceNotFoundException("Paciente no encontrado con correo: " + correo);
                });
        logger.debug("Paciente encontrado por correo: {}", correo);
        return pacienteMapper.toResponseDTO(paciente);
    }
    
    @Override
    @Transactional
    public PacienteResponseDTO crearPaciente(PacienteRequestDTO dto) {
        logger.info("Creando nuevo paciente: {} {}", dto.getNombre(), dto.getApellido());
        
        // Convertir DTO a Entity
        Paciente paciente = pacienteMapper.toEntity(dto);
        
        // Generar número de historia automáticamente
        String nroHistoria = generarNumeroHistoria();
        paciente.setNroHistoria(nroHistoria);
        logger.info("Número de historia generado automáticamente: {}", nroHistoria);
        
        // Validaciones de negocio
        validarDatosPaciente(paciente);
        
        // Guardar
        Paciente pacienteGuardado = pacienteRepository.save(paciente);
        logger.info("Paciente creado exitosamente con ID: {} y número de historia: {}", 
                pacienteGuardado.getIdPaciente(), pacienteGuardado.getNroHistoria());
        
        return pacienteMapper.toResponseDTO(pacienteGuardado);
    }
    
    @Override
    @Transactional
    public PacienteResponseDTO actualizarPaciente(Integer id, PacienteRequestDTO dto) {
        logger.info("Actualizando paciente con ID: {}", id);
        
        // Buscar paciente existente
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Paciente no encontrado para actualizar con ID: {}", id);
                    return new ResourceNotFoundException("Paciente no encontrado con ID: " + id);
                });
        
        // Actualizar campos
        pacienteMapper.updateEntityFromDTO(paciente, dto);
        
        // Validaciones de negocio
        validarDatosPaciente(paciente);
        
        // Guardar cambios
        Paciente pacienteActualizado = pacienteRepository.save(paciente);
        logger.info("Paciente actualizado exitosamente con ID: {}", id);
        
        return pacienteMapper.toResponseDTO(pacienteActualizado);
    }
    
    @Override
    @Transactional
    public void eliminarPaciente(Integer id) {
        logger.info("Eliminando paciente con ID: {}", id);
        
        if (!pacienteRepository.existsById(id)) {
            logger.warn("Paciente no encontrado para eliminar con ID: {}", id);
            throw new ResourceNotFoundException("Paciente no encontrado con ID: " + id);
        }
        
        pacienteRepository.deleteById(id);
        logger.info("Paciente eliminado exitosamente con ID: {}", id);
    }
    
    /**
     * Genera el siguiente número de historia en formato H#####
     */
    private String generarNumeroHistoria() {
        Optional<String> ultimoNroHistoriaOpt = pacienteRepository.findMaxNroHistoria();
        
        int siguienteNumero = 1;
        if (ultimoNroHistoriaOpt.isPresent()) {
            String ultimoNroHistoria = ultimoNroHistoriaOpt.get();
            try {
                siguienteNumero = Integer.parseInt(ultimoNroHistoria.substring(1)) + 1;
            } catch (NumberFormatException e) {
                logger.warn("Error al parsear número de historia: {}, usando valor por defecto", ultimoNroHistoria);
                siguienteNumero = 1;
            }
        }
        
        // Formatear como H##### (H + 5 dígitos)
        return String.format("H%05d", siguienteNumero);
    }
    
    /**
     * Valida los datos del paciente según reglas de negocio
     */
    private void validarDatosPaciente(Paciente paciente) {
        // Validar que el correo no esté duplicado (si es nuevo o cambió)
        if (paciente.getCorreo() != null && !paciente.getCorreo().isEmpty()) {
            pacienteRepository.findByCorreo(paciente.getCorreo())
                    .ifPresent(p -> {
                        if (paciente.getIdPaciente() == null || 
                            !p.getIdPaciente().equals(paciente.getIdPaciente())) {
                            logger.warn("Intento de crear/actualizar paciente con correo duplicado: {}", 
                                    paciente.getCorreo());
                            throw new RuntimeException("Ya existe un paciente con ese correo electrónico");
                        }
                    });
        }
        
        // Validar que el número de historia no esté duplicado (si es nuevo)
        if (paciente.getNroHistoria() != null && paciente.getIdPaciente() == null) {
            pacienteRepository.findByNroHistoria(paciente.getNroHistoria())
                    .ifPresent(p -> {
                        logger.warn("Intento de crear paciente con número de historia duplicado: {}", 
                                paciente.getNroHistoria());
                        throw new RuntimeException("Ya existe un paciente con ese número de historia");
                    });
        }
    }
}

