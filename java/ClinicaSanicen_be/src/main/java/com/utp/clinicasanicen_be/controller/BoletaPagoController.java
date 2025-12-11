package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.BoletaPago;
import com.utp.clinicasanicen_be.entity.Paciente;
import com.utp.clinicasanicen_be.repository.BoletaPagoRepository;
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
@RequestMapping("/api/boletas")
@CrossOrigin(origins = "*")
public class BoletaPagoController {
    
    @Autowired
    private BoletaPagoRepository boletaPagoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<?> getByPaciente(@PathVariable Integer idPaciente) {
        Optional<Paciente> pacienteOpt = pacienteRepository.findById(idPaciente);
        
        if (pacienteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Paciente paciente = pacienteOpt.get();
        
        List<Map<String, Object>> boletas = boletaPagoRepository.findByPacienteIdPaciente(idPaciente).stream()
            .map(this::mapBoletaWithoutPaciente)
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
        
        response.put("boletas", boletas);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/cita/{idCita}")
    public ResponseEntity<?> getByCita(@PathVariable Integer idCita) {
        Optional<BoletaPago> boletaOpt = boletaPagoRepository.findByCitaIdCita(idCita);
        
        if (boletaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapBoletaToSimpleMap(boletaOpt.get()));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<BoletaPago> boletaOpt = boletaPagoRepository.findById(id);
        
        if (boletaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapBoletaToSimpleMap(boletaOpt.get()));
    }
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        try {
            BoletaPago boleta = new BoletaPago();
            
            com.utp.clinicasanicen_be.entity.Cita cita = new com.utp.clinicasanicen_be.entity.Cita();
            cita.setIdCita((Integer) request.get("idCita"));
            boleta.setCita(cita);
            
            com.utp.clinicasanicen_be.entity.Paciente paciente = new com.utp.clinicasanicen_be.entity.Paciente();
            paciente.setIdPaciente((Integer) request.get("idPaciente"));
            boleta.setPaciente(paciente);
            
            boleta.setMonto(new java.math.BigDecimal(request.get("monto").toString()));
            boleta.setMetodoPago((String) request.get("metodoPago"));
            if (request.containsKey("estado")) {
                boleta.setEstado((String) request.get("estado"));
            }
            
            BoletaPago boletaGuardada = boletaPagoRepository.save(boleta);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapBoletaToSimpleMap(boletaGuardada));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    private Map<String, Object> mapBoletaToSimpleMap(BoletaPago boleta) {
        Map<String, Object> map = new HashMap<>();
        map.put("idBoleta", boleta.getIdBoleta());
        map.put("fechaEmision", boleta.getFechaEmision());
        map.put("monto", boleta.getMonto());
        map.put("metodoPago", boleta.getMetodoPago());
        map.put("estado", boleta.getEstado());
        
        if (boleta.getCita() != null) {
            Map<String, Object> citaMap = new HashMap<>();
            citaMap.put("idCita", boleta.getCita().getIdCita());
            citaMap.put("fecha", boleta.getCita().getFecha());
            citaMap.put("hora", boleta.getCita().getHora());
            citaMap.put("estado", boleta.getCita().getEstado());
            map.put("cita", citaMap);
        }
        
        if (boleta.getPaciente() != null) {
            Map<String, Object> pacienteMap = new HashMap<>();
            pacienteMap.put("idPaciente", boleta.getPaciente().getIdPaciente());
            pacienteMap.put("nombre", boleta.getPaciente().getNombre());
            pacienteMap.put("apellido", boleta.getPaciente().getApellido());
            map.put("paciente", pacienteMap);
        }
        
        return map;
    }
    
    private Map<String, Object> mapBoletaWithoutPaciente(BoletaPago boleta) {
        Map<String, Object> map = new HashMap<>();
        map.put("idBoleta", boleta.getIdBoleta());
        map.put("fechaEmision", boleta.getFechaEmision());
        map.put("monto", boleta.getMonto());
        map.put("metodoPago", boleta.getMetodoPago());
        map.put("estado", boleta.getEstado());
        
        if (boleta.getCita() != null) {
            Map<String, Object> citaMap = new HashMap<>();
            citaMap.put("idCita", boleta.getCita().getIdCita());
            citaMap.put("fecha", boleta.getCita().getFecha());
            citaMap.put("hora", boleta.getCita().getHora());
            citaMap.put("estado", boleta.getCita().getEstado());
            citaMap.put("motivo", boleta.getCita().getMotivo());
            map.put("cita", citaMap);
        }
        
        return map;
    }
}
