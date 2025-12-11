package com.utp.clinicasanicen_be.dto.response;

public class EspecialidadResponseDTO {
    
    private Integer idEspecialidad;
    private String nombre;
    private String descripcion;
    
    public EspecialidadResponseDTO() {}
    
    public Integer getIdEspecialidad() { return idEspecialidad; }
    public void setIdEspecialidad(Integer idEspecialidad) { this.idEspecialidad = idEspecialidad; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}

