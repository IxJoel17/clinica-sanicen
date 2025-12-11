package com.utp.clinicasanicen_be.service;

import com.utp.clinicasanicen_be.entity.Logeo;
import com.utp.clinicasanicen_be.entity.Usuario;
import com.utp.clinicasanicen_be.repository.LogeoRepository;
import com.utp.clinicasanicen_be.repository.UsuarioRepository;
import com.utp.clinicasanicen_be.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private LogeoRepository logeoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public Map<String, Object> login(String nombreUsuario, String contrasena) {
        logger.info("Intento de login para usuario: {}", nombreUsuario);
        
        Optional<Logeo> logeoOpt = logeoRepository.findByNombreUsuario(nombreUsuario);
        
        if (logeoOpt.isEmpty() || !logeoOpt.get().getEstado()) {
            logger.warn("Intento de login fallido - Usuario no encontrado o inactivo: {}", nombreUsuario);
            throw new RuntimeException("Usuario no encontrado o inactivo");
        }
        
        Logeo logeo = logeoOpt.get();
        
        // Verificar contraseña
        boolean passwordMatches = passwordEncoder.matches(contrasena, logeo.getContrasena()) || 
                                  logeo.getContrasena().equals(contrasena);
        
        if (!passwordMatches) {
            logger.warn("Intento de login fallido - Contraseña incorrecta para usuario: {}", nombreUsuario);
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        // Actualizar último acceso
        logeo.setUltimoAcceso(LocalDateTime.now());
        logeoRepository.save(logeo);
        logger.debug("Último acceso actualizado para usuario: {}", nombreUsuario);
        
        // Obtener usuario
        Usuario usuario = logeo.getUsuario();
        
        // Generar token JWT
        String token = jwtUtil.generateToken(nombreUsuario, usuario.getRol(), usuario.getIdUsuario());
        logger.info("Token JWT generado exitosamente para usuario: {} con rol: {}", nombreUsuario, usuario.getRol());
        
        // Crear respuesta con token
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login exitoso");
        response.put("token", token);
        response.put("idUsuario", usuario.getIdUsuario());
        response.put("nombre", usuario.getNombre());
        response.put("apellido", usuario.getApellido());
        response.put("correo", usuario.getCorreo());
        response.put("rol", usuario.getRol());
        response.put("nombreUsuario", logeo.getNombreUsuario());
        
        return response;
    }
    
    @Transactional
    public Usuario registrarUsuario(Usuario usuario, String nombreUsuario, String contrasena) {
        // Verificar si el nombre de usuario ya existe
        if (logeoRepository.findByNombreUsuario(nombreUsuario).isPresent()) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        
        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        // Crear logeo
        Logeo logeo = new Logeo();
        logeo.setUsuario(usuarioGuardado);
        logeo.setNombreUsuario(nombreUsuario);
        logeo.setContrasena(passwordEncoder.encode(contrasena));
        logeo.setEstado(true);
        
        logeoRepository.save(logeo);
        
        logger.info("Usuario registrado exitosamente: {}", nombreUsuario);
        return usuarioGuardado;
    }
    
    @Transactional
    public void cambiarContrasena(String nombreUsuario, String nuevaContrasena) {
        logger.info("Iniciando cambio de contraseña para usuario: {}", nombreUsuario);
        
        Optional<Logeo> logeoOpt = logeoRepository.findByNombreUsuario(nombreUsuario);
        
        if (logeoOpt.isEmpty()) {
            logger.warn("Intento de cambio de contraseña fallido - Usuario no encontrado: {}", nombreUsuario);
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Logeo logeo = logeoOpt.get();
        logeo.setContrasena(passwordEncoder.encode(nuevaContrasena));
        logeoRepository.save(logeo);
        
        logger.info("Contraseña cambiada exitosamente para usuario: {}", nombreUsuario);
    }
}

