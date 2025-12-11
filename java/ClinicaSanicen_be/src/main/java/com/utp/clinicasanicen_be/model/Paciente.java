package com.utp.clinicasanicen_be.model;

import java.sql.Date;

public class Paciente {
    private Integer idPaciente;
    private String nroHistoria;
    private String nombre;
    private String dni;
    private Date fechaNacimiento;
    private String direccion;
    private String telefono;
    
    public Paciente() {}
    
    public Paciente(Integer idPaciente, String nroHistoria, String nombre, String dni, 
                    Date fechaNacimiento, String direccion, String telefono) {
        this.idPaciente = idPaciente;
        this.nroHistoria = nroHistoria;
        this.nombre = nombre;
        this.dni = dni;
        this.fechaNacimiento = fechaNacimiento;
        this.direccion = direccion;
        this.telefono = telefono;
    }
    
    
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public String getNroHistoria() { return nroHistoria; }
    public void setNroHistoria(String nroHistoria) { this.nroHistoria = nroHistoria; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    
    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}

