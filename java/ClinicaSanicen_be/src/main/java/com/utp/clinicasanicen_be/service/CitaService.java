package com.utp.clinicasanicen_be.service;

import com.utp.clinicasanicen_be.entity.Cita;
import com.utp.clinicasanicen_be.entity.Medico;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.repository.CitaRepository;
import com.utp.clinicasanicen_be.repository.MedicoRepository;
import com.utp.clinicasanicen_be.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CitaService {
    
    @Autowired
    private CitaRepository citaRepository;
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    public List<Cita> getAllCitas() {
        return citaRepository.findAll();
    }
    
    public Optional<Cita> getCitaById(Integer id) {
        return citaRepository.findById(id);
    }
    
    public List<Cita> getCitasByPaciente(Integer idPaciente) {
        return citaRepository.findByPacienteIdPaciente(idPaciente);
    }
    
    public List<Cita> getCitasByMedico(Integer idMedico) {
        return citaRepository.findByMedicoIdMedico(idMedico);
    }
    
    @Transactional
    public Cita crearCita(Cita cita) {
        // Verificar disponibilidad
        List<Cita> citasExistentes = citaRepository.findByMedicoIdMedicoAndFechaAndHora(
            cita.getMedico().getIdMedico(), 
            cita.getFecha(), 
            cita.getHora()
        );
        
        // Filtrar citas canceladas
        boolean hayConflicto = citasExistentes.stream()
            .anyMatch(c -> !"cancelada".equalsIgnoreCase(c.getEstado()));
        
        if (hayConflicto) {
            throw new RuntimeException("El médico ya tiene una cita en esa fecha/hora.");
        }
        
        // Verificar que el médico y paciente existan
        Optional<Medico> medico = medicoRepository.findById(cita.getMedico().getIdMedico());
        Optional<Paciente> paciente = pacienteRepository.findById(cita.getPaciente().getIdPaciente());
        
        if (medico.isEmpty()) {
            throw new RuntimeException("Médico no encontrado");
        }
        
        if (paciente.isEmpty()) {
            throw new RuntimeException("Paciente no encontrado");
        }
        
        cita.setMedico(medico.get());
        cita.setPaciente(paciente.get());
        cita.setEstado("programada");
        
        return citaRepository.save(cita);
    }
    
    @Transactional
    public Cita actualizarCita(Integer id, java.util.Map<String, Object> request) {
        Optional<Cita> citaExistente = citaRepository.findById(id);
        
        if (citaExistente.isEmpty()) {
            throw new RuntimeException("Cita no encontrada");
        }
        
        Cita cita = citaExistente.get();
        
        // Actualizar solo los campos que vienen en el request (actualización parcial)
        if (request.containsKey("fecha") && request.get("fecha") != null) {
            cita.setFecha(java.time.LocalDate.parse((String) request.get("fecha")));
        }
        if (request.containsKey("hora") && request.get("hora") != null) {
            cita.setHora(java.time.LocalTime.parse((String) request.get("hora")));
        }
        if (request.containsKey("estado") && request.get("estado") != null) {
            cita.setEstado((String) request.get("estado"));
        }
        if (request.containsKey("motivo") && request.get("motivo") != null) {
            cita.setMotivo((String) request.get("motivo"));
        }
        
        return citaRepository.save(cita);
    }
    
    @Transactional
    public void eliminarCita(Integer id) {
        citaRepository.deleteById(id);
    }
}

