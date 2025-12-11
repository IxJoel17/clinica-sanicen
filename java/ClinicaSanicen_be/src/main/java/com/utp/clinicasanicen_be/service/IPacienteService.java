package com.utp.clinicasanicen_be.service;

import com.utp.clinicasanicen_be.dto.request.PacienteRequestDTO;
import com.utp.clinicasanicen_be.dto.response.PacienteResponseDTO;

import java.util.List;

/**
 * Interfaz de servicio para operaciones de Paciente
 * Define el contrato para la lógica de negocio
 */
public interface IPacienteService {
    List<PacienteResponseDTO> getAllPacientes();
    
    PacienteResponseDTO getPacienteById(Integer id);
    
    PacienteResponseDTO getPacienteByCorreo(String correo);
    
    PacienteResponseDTO crearPaciente(PacienteRequestDTO dto);
    
    PacienteResponseDTO actualizarPaciente(Integer id, PacienteRequestDTO dto);
    
    void eliminarPaciente(Integer id);
}

