package com.utp.clinicasanicen_be.model;

import java.sql.Timestamp;

public class Logeo {
    private Integer idLogeo;
    private Integer idUsuario;
    private String usuario;
    private String contraseña;
    private String estado;
    private Timestamp ultimoAcceso;
    
    public Logeo() {}
    
    public Logeo(Integer idLogeo, Integer idUsuario, String usuario, String contraseña, 
                 String estado, Timestamp ultimoAcceso) {
        this.idLogeo = idLogeo;
        this.idUsuario = idUsuario;
        this.usuario = usuario;
        this.contraseña = contraseña;
        this.estado = estado;
        this.ultimoAcceso = ultimoAcceso;
    }
    
    
    public Integer getIdLogeo() { return idLogeo; }
    public void setIdLogeo(Integer idLogeo) { this.idLogeo = idLogeo; }
    
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    
    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public Timestamp getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(Timestamp ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }
}

