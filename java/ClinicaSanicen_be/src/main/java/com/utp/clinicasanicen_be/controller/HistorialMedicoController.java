package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.HistorialMedico;
import com.utp.clinicasanicen_be.entity.Medico;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.repository.HistorialMedicoRepository;
import com.utp.clinicasanicen_be.repository.MedicoRepository;
import com.utp.clinicasanicen_be.repository.PacienteRepository;
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
@RequestMapping("/api/historial")
@CrossOrigin(origins = "*")
public class HistorialMedicoController {
    
    @Autowired
    private HistorialMedicoRepository historialMedicoRepository;
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> getByPaciente(@PathVariable Integer idPaciente) {
        List<HistorialMedico> historiales = historialMedicoRepository.findByPacienteIdPaciente(idPaciente);
        if (historiales.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapHistorialToSimpleMap(historiales.get(0)));
    }
    
    @GetMapping("/paciente/{idPaciente}/all")
    public ResponseEntity<List<Map<String, Object>>> getAllByPaciente(@PathVariable Integer idPaciente) {
        List<Map<String, Object>> historiales = historialMedicoRepository.findByPacienteIdPaciente(idPaciente).stream()
            .map(this::mapHistorialToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(historiales);
    }
    @GetMapping("/{id}")
public ResponseEntity<?> getById(@PathVariable Integer id) {
    Optional<HistorialMedico> historialOpt = historialMedicoRepository.findById(id);

    if (historialOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(mapHistorialToSimpleMap(historialOpt.get()));
}
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            HistorialMedico historial = new HistorialMedico();
            
            Optional<Paciente> paciente = pacienteRepository.findById((Integer) request.get("idPaciente"));
            Optional<Medico> medico = medicoRepository.findById((Integer) request.get("idMedico"));
            
            if (paciente.isEmpty() || medico.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Paciente o médico no encontrado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            historial.setPaciente(paciente.get());
            historial.setMedico(medico.get());
            historial.setDiagnostico((String) request.get("diagnostico"));
            historial.setTratamiento((String) request.get("tratamiento"));
            historial.setObservaciones((String) request.get("observaciones"));
            
            HistorialMedico historialGuardado = historialMedicoRepository.save(historial);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapHistorialToSimpleMap(historialGuardado));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Optional<HistorialMedico> historialExistente = historialMedicoRepository.findById(id);
            
            if (historialExistente.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            HistorialMedico historial = historialExistente.get();
            historial.setDiagnostico((String) request.get("diagnostico"));
            historial.setTratamiento((String) request.get("tratamiento"));
            historial.setObservaciones((String) request.get("observaciones"));
            
            HistorialMedico historialActualizado = historialMedicoRepository.save(historial);
            return ResponseEntity.ok(mapHistorialToSimpleMap(historialActualizado));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    private Map<String, Object> mapHistorialToSimpleMap(HistorialMedico historial) {
        Map<String, Object> map = new HashMap<>();
        map.put("idHistorial", historial.getIdHistorial());
        map.put("diagnostico", historial.getDiagnostico());
        map.put("tratamiento", historial.getTratamiento());
        map.put("observaciones", historial.getObservaciones());
        map.put("fechaRegistro", historial.getFechaRegistro());
        
        if (historial.getPaciente() != null) {
            Map<String, Object> pacienteMap = new HashMap<>();
            pacienteMap.put("idPaciente", historial.getPaciente().getIdPaciente());
            pacienteMap.put("nombre", historial.getPaciente().getNombre());
            pacienteMap.put("apellido", historial.getPaciente().getApellido());
            map.put("paciente", pacienteMap);
        }
        
        if (historial.getMedico() != null) {
            Map<String, Object> medicoMap = new HashMap<>();
            medicoMap.put("idMedico", historial.getMedico().getIdMedico());
            medicoMap.put("nombre", historial.getMedico().getNombre());
            medicoMap.put("apellido", historial.getMedico().getApellido());
            map.put("medico", medicoMap);
        }
        
        return map;
    }
}
