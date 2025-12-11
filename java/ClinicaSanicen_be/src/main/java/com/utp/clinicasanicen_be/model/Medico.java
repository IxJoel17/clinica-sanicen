package com.utp.clinicasanicen_be.model;

public class Medico {
    private Integer idMedico;
    private String nombre;
    private String apellido;
    private String cmp;
    private Integer especialidadId;
    private String telefono;
    private String correo;
    
    public Medico() {}
    
    public Medico(Integer idMedico, String nombre, String apellido, String cmp, 
                   Integer especialidadId, String telefono, String correo) {
        this.idMedico = idMedico;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cmp = cmp;
        this.especialidadId = especialidadId;
        this.telefono = telefono;
        this.correo = correo;
    }
    
    
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCmp() { return cmp; }
    public void setCmp(String cmp) { this.cmp = cmp; }
    
    public Integer getEspecialidadId() { return especialidadId; }
    public void setEspecialidadId(Integer especialidadId) { this.especialidadId = especialidadId; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
}

