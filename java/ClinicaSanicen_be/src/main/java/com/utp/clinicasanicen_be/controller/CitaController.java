package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Cita;
import com.utp.clinicasanicen_be.entity.Medico;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.repository.MedicoRepository;
import com.utp.clinicasanicen_be.repository.PacienteRepository;
import com.utp.clinicasanicen_be.service.CitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citas")
@CrossOrigin(origins = "*")
public class CitaController {
    
    @Autowired
    private CitaService citaService;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCitas() {
        List<Map<String, Object>> citas = citaService.getAllCitas().stream()
            .map(this::mapCitaToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCitaById(@PathVariable Integer id) {
        return citaService.getCitaById(id)
            .map(cita -> ResponseEntity.ok(mapCitaToSimpleMap(cita)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> getCitasByPaciente(@PathVariable Integer idPaciente) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(idPaciente);
        
        if (pacienteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Paciente paciente = pacienteOpt.get();
        
        List<Map<String, Object>> citas = citaService.getCitasByPaciente(idPaciente).stream()
            .map(this::mapCitaWithoutPaciente)
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> pacienteMap = new HashMap<>();
        pacienteMap.put("idPaciente", paciente.getIdPaciente());
        pacienteMap.put("nombre", paciente.getNombre());
        pacienteMap.put("apellido", paciente.getApellido());
        pacienteMap.put("sexo", paciente.getSexo());
        pacienteMap.put("fechaNacimiento", paciente.getFechaNacimiento());
        pacienteMap.put("direccion", paciente.getDireccion());
        pacienteMap.put("telefono", paciente.getTelefono());
        pacienteMap.put("correo", paciente.getCorreo());
        pacienteMap.put("nroHistoria", paciente.getNroHistoria());
        response.put("paciente", pacienteMap);
        
        response.put("citas", citas);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<?> getCitasByMedico(@PathVariable Integer idMedico) {
        Optional<Medico> medicoOpt = medicoRepository.findById(idMedico);
        
        if (medicoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Medico medico = medicoOpt.get();
        
        List<Map<String, Object>> citas = citaService.getCitasByMedico(idMedico).stream()
            .map(this::mapCitaWithoutMedico)
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> medicoMap = new HashMap<>();
        medicoMap.put("idMedico", medico.getIdMedico());
        medicoMap.put("nombre", medico.getNombre());
        medicoMap.put("apellido", medico.getApellido());
        medicoMap.put("dni", medico.getDni());
        medicoMap.put("telefono", medico.getTelefono());
        medicoMap.put("correo", medico.getCorreo());
        medicoMap.put("direccion", medico.getDireccion());
        medicoMap.put("activo", medico.getActivo());
        if (medico.getEspecialidad() != null) {
            Map<String, Object> especialidadMap = new HashMap<>();
            especialidadMap.put("idEspecialidad", medico.getEspecialidad().getIdEspecialidad());
            especialidadMap.put("nombre", medico.getEspecialidad().getNombre());
            medicoMap.put("especialidad", especialidadMap);
        }
        response.put("medico", medicoMap);
        
        response.put("citas", citas);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<?> crearCita(@RequestBody Map<String, Object> request) {
        try {
            Cita cita = new Cita();
            cita.setFecha(java.time.LocalDate.parse((String) request.get("fecha")));
            cita.setHora(java.time.LocalTime.parse((String) request.get("hora")));
            cita.setMotivo((String) request.get("motivo"));
            
            Medico medico = new Medico();
            medico.setIdMedico((Integer) request.get("idMedico"));
            cita.setMedico(medico);
            
            Paciente paciente = new Paciente();
            paciente.setIdPaciente((Integer) request.get("idPaciente"));
            cita.setPaciente(paciente);
            
            Cita citaCreada = citaService.crearCita(cita);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapCitaToSimpleMap(citaCreada));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCita(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Cita citaActualizada = citaService.actualizarCita(id, request);
            return ResponseEntity.ok(mapCitaToSimpleMap(citaActualizada));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCita(@PathVariable Integer id) {
        try {
            citaService.eliminarCita(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    private Map<String, Object> mapCitaToSimpleMap(Cita cita) {
        Map<String, Object> map = new HashMap<>();
        map.put("idCita", cita.getIdCita());
        map.put("fecha", cita.getFecha());
        map.put("hora", cita.getHora());
        map.put("estado", cita.getEstado());
        map.put("motivo", cita.getMotivo());
        map.put("createdAt", cita.getCreatedAt());
        
        if (cita.getPaciente() != null) {
            Map<String, Object> pacienteMap = new HashMap<>();
            pacienteMap.put("idPaciente", cita.getPaciente().getIdPaciente());
            pacienteMap.put("nombre", cita.getPaciente().getNombre());
            pacienteMap.put("apellido", cita.getPaciente().getApellido());
            map.put("paciente", pacienteMap);
        }
        
        if (cita.getMedico() != null) {
            Map<String, Object> medicoMap = new HashMap<>();
            medicoMap.put("idMedico", cita.getMedico().getIdMedico());
            medicoMap.put("nombre", cita.getMedico().getNombre());
            medicoMap.put("apellido", cita.getMedico().getApellido());
            if (cita.getMedico().getEspecialidad() != null) {
                medicoMap.put("especialidad", cita.getMedico().getEspecialidad().getNombre());
            }
            map.put("medico", medicoMap);
        }
        
        return map;
    }
    
    private Map<String, Object> mapCitaWithoutPaciente(Cita cita) {
        Map<String, Object> map = new HashMap<>();
        map.put("idCita", cita.getIdCita());
        map.put("fecha", cita.getFecha());
        map.put("hora", cita.getHora());
        map.put("estado", cita.getEstado());
        map.put("motivo", cita.getMotivo());
        map.put("createdAt", cita.getCreatedAt());
        
        if (cita.getMedico() != null) {
            Map<String, Object> medicoMap = new HashMap<>();
            medicoMap.put("idMedico", cita.getMedico().getIdMedico());
            medicoMap.put("nombre", cita.getMedico().getNombre());
            medicoMap.put("apellido", cita.getMedico().getApellido());
            if (cita.getMedico().getEspecialidad() != null) {
                medicoMap.put("especialidad", cita.getMedico().getEspecialidad().getNombre());
            }
            map.put("medico", medicoMap);
        }
        
        return map;
    }
    
    private Map<String, Object> mapCitaWithoutMedico(Cita cita) {
        Map<String, Object> map = new HashMap<>();
        map.put("idCita", cita.getIdCita());
        map.put("fecha", cita.getFecha());
        map.put("hora", cita.getHora());
        map.put("estado", cita.getEstado());
        map.put("motivo", cita.getMotivo());
        map.put("createdAt", cita.getCreatedAt());
        
        if (cita.getPaciente() != null) {
            Map<String, Object> pacienteMap = new HashMap<>();
            pacienteMap.put("idPaciente", cita.getPaciente().getIdPaciente());
            pacienteMap.put("nombre", cita.getPaciente().getNombre());
            pacienteMap.put("apellido", cita.getPaciente().getApellido());
            map.put("paciente", pacienteMap);
        }
        
        return map;
    }
}
