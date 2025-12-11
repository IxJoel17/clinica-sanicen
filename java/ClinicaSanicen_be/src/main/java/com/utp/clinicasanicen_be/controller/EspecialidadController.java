package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Especialidad;
import com.utp.clinicasanicen_be.repository.EspecialidadRepository;
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
@RequestMapping("/api/especialidades")
@CrossOrigin(origins = "*")
public class EspecialidadController {
    
    @Autowired
    private EspecialidadRepository especialidadRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllEspecialidades() {
        List<Map<String, Object>> especialidades = especialidadRepository.findAll().stream()
            .map(esp -> {
                Map<String, Object> map = new HashMap<>();
                map.put("idEspecialidad", esp.getIdEspecialidad());
                map.put("nombre", esp.getNombre());
                map.put("descripcion", esp.getDescripcion());
                return map;
            })
            .collect(Collectors.toList());
        return ResponseEntity.ok(especialidades);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEspecialidadById(@PathVariable Integer id) {
        Optional<Especialidad> especialidadOpt = especialidadRepository.findById(id);
        
        if (especialidadOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Especialidad esp = especialidadOpt.get();
        Map<String, Object> response = new HashMap<>();
        response.put("idEspecialidad", esp.getIdEspecialidad());
        response.put("nombre", esp.getNombre());
        response.put("descripcion", esp.getDescripcion());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<?> crearEspecialidad(@RequestBody Map<String, Object> request) {
        try {
            Especialidad especialidad = new Especialidad();
            especialidad.setNombre((String) request.get("nombre"));
            especialidad.setDescripcion((String) request.get("descripcion"));
            
            Especialidad especialidadGuardada = especialidadRepository.save(especialidad);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idEspecialidad", especialidadGuardada.getIdEspecialidad());
            response.put("nombre", especialidadGuardada.getNombre());
            response.put("descripcion", especialidadGuardada.getDescripcion());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEspecialidad(@PathVariable Integer id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Especialidad> especialidadOpt = especialidadRepository.findById(id);
            
            if (especialidadOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Especialidad especialidad = especialidadOpt.get();
            
            if (request.containsKey("nombre")) {
                especialidad.setNombre((String) request.get("nombre"));
            }
            if (request.containsKey("descripcion")) {
                especialidad.setDescripcion((String) request.get("descripcion"));
            }
            
            Especialidad especialidadActualizada = especialidadRepository.save(especialidad);
            
            Map<String, Object> response = new HashMap<>();
            response.put("idEspecialidad", especialidadActualizada.getIdEspecialidad());
            response.put("nombre", especialidadActualizada.getNombre());
            response.put("descripcion", especialidadActualizada.getDescripcion());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEspecialidad(@PathVariable Integer id) {
        try {
            if (especialidadRepository.existsById(id)) {
                especialidadRepository.deleteById(id);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
