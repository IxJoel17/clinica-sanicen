package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.DetalleReceta;
import com.utp.clinicasanicen_be.entity.Receta;
import com.utp.clinicasanicen_be.entity.Medico;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.repository.RecetaRepository;
import com.utp.clinicasanicen_be.repository.MedicoRepository;
import com.utp.clinicasanicen_be.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin(origins = "*")
public class RecetaController {
    
    @Autowired
    private RecetaRepository recetaRepository;
    
    @Autowired
    private MedicoRepository medicoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<Map<String, Object>>> getByPaciente(@PathVariable Integer idPaciente) {
        List<Map<String, Object>> recetas = recetaRepository.findByPacienteIdPaciente(idPaciente).stream()
            .map(this::mapRecetaToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(recetas);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<Receta> recetaOpt = recetaRepository.findById(id);
        
        if (recetaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapRecetaToSimpleMap(recetaOpt.get()));
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            Receta receta = new Receta();
            
            Optional<Medico> medico = medicoRepository.findById((Integer) request.get("idMedico"));
            Optional<Paciente> paciente = pacienteRepository.findById((Integer) request.get("idPaciente"));
            
            if (medico.isEmpty() || paciente.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Médico o paciente no encontrado");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            receta.setMedico(medico.get());
            receta.setPaciente(paciente.get());
            receta.setIndicaciones((String) request.get("indicaciones"));

            List<DetalleReceta> detallesReceta = new ArrayList<>();

            Object detallesObj = request.get("detalles");

            if (detallesObj instanceof List<?>) {
                List<?> detallesList = (List<?>) detallesObj;

                for (Object item : detallesList) {
                    if (item instanceof Map<?, ?>) {
                        Map<?, ?> detalleMap = (Map<?, ?>) item;

                        DetalleReceta detalle = new DetalleReceta();
                        detalle.setReceta(receta);
                        detalle.setMedicamento((String) detalleMap.get("medicamento"));
                        detalle.setDosis((String) detalleMap.get("dosis"));
                        detalle.setFrecuencia((String) detalleMap.get("frecuencia"));
                        detalle.setDuracion((String) detalleMap.get("duracion"));
                        detalle.setInstrucciones((String) detalleMap.get("instrucciones"));

                        detallesReceta.add(detalle);
                    }
                }
            }

            receta.setDetalles(detallesReceta);
            
            Receta recetaGuardada = recetaRepository.save(receta);

            return ResponseEntity.status(HttpStatus.CREATED).body(mapRecetaToSimpleMap(recetaGuardada));

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    private Map<String, Object> mapRecetaToSimpleMap(Receta receta) {
        Map<String, Object> map = new HashMap<>();
        map.put("idReceta", receta.getIdReceta());
        map.put("fecha", receta.getFecha());
        map.put("indicaciones", receta.getIndicaciones());
        
        if (receta.getMedico() != null) {
            Map<String, Object> medicoMap = new HashMap<>();
            medicoMap.put("idMedico", receta.getMedico().getIdMedico());
            medicoMap.put("nombre", receta.getMedico().getNombre());
            medicoMap.put("apellido", receta.getMedico().getApellido());
            map.put("medico", medicoMap);
        }
        
        if (receta.getPaciente() != null) {
            Map<String, Object> pacienteMap = new HashMap<>();
            pacienteMap.put("idPaciente", receta.getPaciente().getIdPaciente());
            pacienteMap.put("nombre", receta.getPaciente().getNombre());
            pacienteMap.put("apellido", receta.getPaciente().getApellido());
            map.put("paciente", pacienteMap);
        }

        if (receta.getDetalles() != null) {
            List<Map<String, Object>> detalles = receta.getDetalles().stream().map(detalle -> {
                Map<String, Object> detalleMap = new HashMap<>();
                detalleMap.put("idDetalleReceta", detalle.getIdDetalleReceta());
                detalleMap.put("medicamento", detalle.getMedicamento());
                detalleMap.put("dosis", detalle.getDosis());
                detalleMap.put("frecuencia", detalle.getFrecuencia());
                detalleMap.put("duracion", detalle.getDuracion());
                detalleMap.put("instrucciones", detalle.getInstrucciones());
                return detalleMap;
            }).collect(Collectors.toList());

            map.put("detalles", detalles);
        }
        
        return map;
    }
}