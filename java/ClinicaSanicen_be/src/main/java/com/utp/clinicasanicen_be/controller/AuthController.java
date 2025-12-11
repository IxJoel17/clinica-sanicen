package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Usuario;
import com.utp.clinicasanicen_be.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        logger.info("Petición de login recibida");
        String nombreUsuario = credentials.get("usuario");
        String contrasena = credentials.get("contrasena");
        
        Map<String, Object> response = authService.login(nombreUsuario, contrasena);
        logger.info("Login exitoso para usuario: {}", nombreUsuario);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        logger.info("Petición de registro recibida");
        
        Usuario usuario = new Usuario();
        usuario.setNombre((String) request.get("nombre"));
        usuario.setApellido((String) request.get("apellido"));
        usuario.setDireccion((String) request.get("direccion"));
        usuario.setTelefono((String) request.get("telefono"));
        usuario.setCorreo((String) request.get("correo"));
        
        // Asignar rol "paciente" por defecto si no se especifica
        String rol = (String) request.get("rol");
        if (rol == null || rol.trim().isEmpty()) {
            rol = "paciente";
        }
        usuario.setRol(rol);
        
        String nombreUsuario = (String) request.get("nombreUsuario");
        String contrasena = (String) request.get("contrasena");
        
        Usuario usuarioGuardado = authService.registrarUsuario(usuario, nombreUsuario, contrasena);
        logger.info("Usuario registrado exitosamente: {}", nombreUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        logger.info("Petición de cambio de contraseña recibida");
        String nombreUsuario = request.get("nombreUsuario");
        String nuevaContrasena = request.get("nuevaContrasena");
        
        authService.cambiarContrasena(nombreUsuario, nuevaContrasena);
        logger.info("Contraseña cambiada exitosamente para usuario: {}", nombreUsuario);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Contraseña actualizada exitosamente");
        return ResponseEntity.ok(response);
    }
}
