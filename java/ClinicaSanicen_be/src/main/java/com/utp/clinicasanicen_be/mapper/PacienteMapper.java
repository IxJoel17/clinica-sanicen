package com.utp.clinicasanicen_be.mapper;

import com.utp.clinicasanicen_be.dto.request.PacienteRequestDTO;
import com.utp.clinicasanicen_be.dto.response.PacienteResponseDTO;
import com.utp.clinicasanicen_be.entity.Paciente;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Mapper para convertir entre Entity y DTOs de Paciente
 */
@Component
public class PacienteMapper {
    
    /**
     * Convierte Entity a ResponseDTO
     */
    public PacienteResponseDTO toResponseDTO(Paciente paciente) {
        if (paciente == null) {
            return null;
        }
        
        PacienteResponseDTO dto = new PacienteResponseDTO();
        dto.setIdPaciente(paciente.getIdPaciente());
        dto.setNombre(paciente.getNombre());
        dto.setApellido(paciente.getApellido());
        dto.setSexo(paciente.getSexo());
        dto.setFechaNacimiento(paciente.getFechaNacimiento());
        dto.setDireccion(paciente.getDireccion());
        dto.setTelefono(paciente.getTelefono());
        dto.setCorreo(paciente.getCorreo());
        dto.setNroHistoria(paciente.getNroHistoria());
        return dto;
    }
    
    public Paciente toEntity(PacienteRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Paciente paciente = new Paciente();
        paciente.setNombre(dto.getNombre());
        paciente.setApellido(dto.getApellido());
        paciente.setSexo(dto.getSexo());
        
        // Convertir fecha de String a LocalDate
        if (dto.getFechaNacimiento() != null && !dto.getFechaNacimiento().isEmpty()) {
            try {
                paciente.setFechaNacimiento(LocalDate.parse(dto.getFechaNacimiento()));
            } catch (Exception e) {
            }
        }
        
        paciente.setDireccion(dto.getDireccion());
        paciente.setTelefono(dto.getTelefono());
        paciente.setCorreo(dto.getCorreo());
        
        return paciente;
    }
    
    /**
     * Actualiza una Entity existente con datos del RequestDTO
     */
    public void updateEntityFromDTO(Paciente paciente, PacienteRequestDTO dto) {
        if (paciente == null || dto == null) {
            return;
        }
        
        if (dto.getNombre() != null) {
            paciente.setNombre(dto.getNombre());
        }
        if (dto.getApellido() != null) {
            paciente.setApellido(dto.getApellido());
        }
        if (dto.getSexo() != null) {
            paciente.setSexo(dto.getSexo());
        }
        if (dto.getDireccion() != null) {
            paciente.setDireccion(dto.getDireccion());
        }
        if (dto.getTelefono() != null) {
            paciente.setTelefono(dto.getTelefono());
        }
        if (dto.getCorreo() != null) {
            paciente.setCorreo(dto.getCorreo());
        }
        
        if (dto.getFechaNacimiento() != null && !dto.getFechaNacimiento().isEmpty()) {
            try {
                paciente.setFechaNacimiento(LocalDate.parse(dto.getFechaNacimiento()));
            } catch (Exception e) {
            }
        }
    }
}

