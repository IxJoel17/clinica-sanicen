package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Usuario;
import com.utp.clinicasanicen_be.repository.UsuarioRepository;
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
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<Map<String, Object>> usuarios = usuarioRepository.findAll().stream()
            .map(this::mapUsuarioToSimpleMap)
            .collect(Collectors.toList());
        return ResponseEntity.ok(usuarios);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(mapUsuarioToSimpleMap(usuarioOpt.get()));
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Usuario usuario) {
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapUsuarioToSimpleMap(usuarioGuardado));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        
        if (usuarioExistente.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        usuario.setIdUsuario(id);
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return ResponseEntity.ok(mapUsuarioToSimpleMap(usuarioActualizado));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    private Map<String, Object> mapUsuarioToSimpleMap(Usuario usuario) {
        Map<String, Object> map = new HashMap<>();
        map.put("idUsuario", usuario.getIdUsuario());
        map.put("nombre", usuario.getNombre());
        map.put("apellido", usuario.getApellido());
        map.put("direccion", usuario.getDireccion());
        map.put("telefono", usuario.getTelefono());
        map.put("correo", usuario.getCorreo());
        map.put("rol", usuario.getRol());
        map.put("fechaCreacion", usuario.getFechaCreacion());
        return map;
    }
}
