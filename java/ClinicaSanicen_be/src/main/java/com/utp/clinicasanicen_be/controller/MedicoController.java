package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Especialidad;
import com.utp.clinicasanicen_be.entity.Medico;
import com.utp.clinicasanicen_be.repository.EspecialidadRepository;
import com.utp.clinicasanicen_be.repository.MedicoRepository;
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
@RequestMapping("/api/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    @Autowired
    private EspecialidadRepository especialidadRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllMedicos() {
        List<Map<String, Object>> medicos = medicoRepository.findByActivoTrue().stream()
            .map(this::mapMedicoToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMedicoById(@PathVariable Integer id) {
        Optional<Medico> medicoOpt = medicoRepository.findById(id);
        
        if (medicoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapMedicoToSimpleMap(medicoOpt.get()));
    }
    
    @GetMapping("/correo/{correo}")
    public ResponseEntity<?> getMedicoByCorreo(@PathVariable String correo) {
        Optional<Medico> medicoOpt = medicoRepository.findByCorreo(correo);
        
        if (medicoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapMedicoToSimpleMap(medicoOpt.get()));
    }
    
    @GetMapping("/especialidad/{idEspecialidad}")
    public ResponseEntity<?> getMedicosByEspecialidad(@PathVariable Integer idEspecialidad) {
        Optional<Especialidad> especialidadOpt = especialidadRepository.findById(idEspecialidad);
        
        if (especialidadOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Especialidad especialidad = especialidadOpt.get();
        
        List<Map<String, Object>> medicos = medicoRepository.findByEspecialidadIdEspecialidad(idEspecialidad).stream()
            .map(this::mapMedicoWithoutEspecialidad)
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> especialidadMap = new HashMap<>();
        especialidadMap.put("idEspecialidad", especialidad.getIdEspecialidad());
        especialidadMap.put("nombre", especialidad.getNombre());
        response.put("especialidad", especialidadMap);
        
        response.put("medicos", medicos);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllMedicosIncludingInactive() {
        List<Map<String, Object>> medicos = medicoRepository.findAll().stream()
            .map(this::mapMedicoToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }
    
    @PostMapping
    public ResponseEntity<?> crearMedico(@RequestBody Map<String, Object> request) {
        try {
            Medico medico = new Medico();
            medico.setNombre((String) request.get("nombre"));
            medico.setApellido((String) request.get("apellido"));
            medico.setDni((String) request.get("dni"));
            medico.setTelefono((String) request.get("telefono"));
            medico.setCorreo((String) request.get("correo"));
            medico.setDireccion((String) request.get("direccion"));
            
            if (request.get("activo") != null) {
                medico.setActivo((Boolean) request.get("activo"));
            } else {
                medico.setActivo(true);
            }
            
            if (request.get("idEspecialidad") != null) {
                Optional<Especialidad> especialidadOpt = especialidadRepository.findById((Integer) request.get("idEspecialidad"));
                if (especialidadOpt.isPresent()) {
                    medico.setEspecialidad(especialidadOpt.get());
                }
            }
            
            Medico medicoGuardado = medicoRepository.save(medico);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapMedicoToSimpleMap(medicoGuardado));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMedico(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Medico> medicoOpt = medicoRepository.findById(id);
            
            if (medicoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Medico medico = medicoOpt.get();
            
            if (request.containsKey("nombre")) {
                medico.setNombre((String) request.get("nombre"));
            }
            if (request.containsKey("apellido")) {
                medico.setApellido((String) request.get("apellido"));
            }
            if (request.containsKey("dni")) {
                medico.setDni((String) request.get("dni"));
            }
            if (request.containsKey("telefono")) {
                medico.setTelefono((String) request.get("telefono"));
            }
            if (request.containsKey("correo")) {
                medico.setCorreo((String) request.get("correo"));
            }
            if (request.containsKey("direccion")) {
                medico.setDireccion((String) request.get("direccion"));
            }
            if (request.containsKey("activo")) {
                medico.setActivo((Boolean) request.get("activo"));
            }
            if (request.containsKey("idEspecialidad")) {
                if (request.get("idEspecialidad") != null) {
                    Optional<Especialidad> especialidadOpt = especialidadRepository.findById((Integer) request.get("idEspecialidad"));
                    if (especialidadOpt.isPresent()) {
                        medico.setEspecialidad(especialidadOpt.get());
                    }
                } else {
                    medico.setEspecialidad(null);
                }
            }
            
            Medico medicoActualizado = medicoRepository.save(medico);
            return ResponseEntity.ok(mapMedicoToSimpleMap(medicoActualizado));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMedico(@PathVariable Integer id) {
        try {
            Optional<Medico> medicoOpt = medicoRepository.findById(id);
            
            if (medicoOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Medico medico = medicoOpt.get();
            medico.setActivo(false);
            medicoRepository.save(medico);
            
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    private Map<String, Object> mapMedicoToSimpleMap(Medico medico) {
        Map<String, Object> map = new HashMap<>();
        map.put("idMedico", medico.getIdMedico());
        map.put("nombre", medico.getNombre());
        map.put("apellido", medico.getApellido());
        map.put("dni", medico.getDni());
        map.put("telefono", medico.getTelefono());
        map.put("correo", medico.getCorreo());
        map.put("direccion", medico.getDireccion());
        map.put("activo", medico.getActivo());
        
        if (medico.getEspecialidad() != null) {
            Map<String, Object> especialidadMap = new HashMap<>();
            especialidadMap.put("idEspecialidad", medico.getEspecialidad().getIdEspecialidad());
            especialidadMap.put("nombre", medico.getEspecialidad().getNombre());
            map.put("especialidad", especialidadMap);
        }
        
        return map;
    }
    
    private Map<String, Object> mapMedicoWithoutEspecialidad(Medico medico) {
        Map<String, Object> map = new HashMap<>();
        map.put("idMedico", medico.getIdMedico());
        map.put("nombre", medico.getNombre());
        map.put("apellido", medico.getApellido());
        map.put("dni", medico.getDni());
        map.put("telefono", medico.getTelefono());
        map.put("correo", medico.getCorreo());
        map.put("direccion", medico.getDireccion());
        map.put("activo", medico.getActivo());
        return map;
    }
}
