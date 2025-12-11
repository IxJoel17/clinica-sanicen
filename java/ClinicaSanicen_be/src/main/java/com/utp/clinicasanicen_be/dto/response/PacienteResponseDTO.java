package com.utp.clinicasanicen_be.dto.response;

import java.time.LocalDate;

/**
 * DTO para respuestas de Paciente
 */
public class PacienteResponseDTO {
    
    private Integer idPaciente;
    private String nombre;
    private String apellido;
    private String sexo;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String telefono;
    private String correo;
    private String nroHistoria;
    
    public PacienteResponseDTO() {}
    
    public PacienteResponseDTO(Integer idPaciente, String nombre, String apellido, 
                              String sexo, LocalDate fechaNacimiento, String direccion, 
                              String telefono, String correo, String nroHistoria) {
        this.idPaciente = idPaciente;
        this.nombre = nombre;
        this.apellido = apellido;
        this.sexo = sexo;
        this.fechaNacimiento = fechaNacimiento;
        this.direccion = direccion;
        this.telefono = telefono;
        this.correo = correo;
        this.nroHistoria = nroHistoria;
    }
    
    public Integer getIdPaciente() {
        return idPaciente;
    }
    
    public void setIdPaciente(Integer idPaciente) {
        this.idPaciente = idPaciente;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    
    public String getSexo() {
        return sexo;
    }
    
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }
    
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getNroHistoria() {
        return nroHistoria;
    }
    
    public void setNroHistoria(String nroHistoria) {
        this.nroHistoria = nroHistoria;
    }
}

