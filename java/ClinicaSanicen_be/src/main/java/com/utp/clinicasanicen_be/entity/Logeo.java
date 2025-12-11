package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logeo")
public class Logeo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_logeo")
    private Integer idLogeo;
    
    @OneToOne
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    @JsonIgnoreProperties({"logeo"})  // Evita referencia circular
    private Usuario usuario;
    
    @Column(name = "usuario", nullable = false, unique = true, length = 8)
    private String nombreUsuario;
    
    @Column(name = "contrasena", nullable = false, length = 200)
    private String contrasena;
    
    @Column(name = "estado")
    private Boolean estado = true;
    
    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;
    
    public Logeo() {}
    
    
    public Integer getIdLogeo() {
        return idLogeo;
    }
    
    public void setIdLogeo(Integer idLogeo) {
        this.idLogeo = idLogeo;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    public String getContrasena() {
        return contrasena;
    }
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    
    public Boolean getEstado() {
        return estado;
    }
    
    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
    
    public LocalDateTime getUltimoAcceso() {
        return ultimoAcceso;
    }
    
    public void setUltimoAcceso(LocalDateTime ultimoAcceso) {
        this.ultimoAcceso = ultimoAcceso;
    }
}

