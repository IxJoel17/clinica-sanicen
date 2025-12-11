package com.utp.clinicasanicen_be.model;

import java.sql.Timestamp;

public class HistorialMedico {
    private Integer idHistorial;
    private Integer idPaciente;
    private String antecedentes;
    private String diagnosticos;
    private String tratamientos;
    private String alergias;
    private Timestamp fechaCreacion;
    private Timestamp fechaActualizacion;
    
    public HistorialMedico() {}
    
    public HistorialMedico(Integer idHistorial, Integer idPaciente, String antecedentes, 
                           String diagnosticos, String tratamientos, String alergias,
                           Timestamp fechaCreacion, Timestamp fechaActualizacion) {
        this.idHistorial = idHistorial;
        this.idPaciente = idPaciente;
        this.antecedentes = antecedentes;
        this.diagnosticos = diagnosticos;
        this.tratamientos = tratamientos;
        this.alergias = alergias;
        this.fechaCreacion = fechaCreacion;
        this.fechaActualizacion = fechaActualizacion;
    }
    
    
    public Integer getIdHistorial() { return idHistorial; }
    public void setIdHistorial(Integer idHistorial) { this.idHistorial = idHistorial; }
    
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public String getAntecedentes() { return antecedentes; }
    public void setAntecedentes(String antecedentes) { this.antecedentes = antecedentes; }
    
    public String getDiagnosticos() { return diagnosticos; }
    public void setDiagnosticos(String diagnosticos) { this.diagnosticos = diagnosticos; }
    
    public String getTratamientos() { return tratamientos; }
    public void setTratamientos(String tratamientos) { this.tratamientos = tratamientos; }
    
    public String getAlergias() { return alergias; }
    public void setAlergias(String alergias) { this.alergias = alergias; }
    
    public Timestamp getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(Timestamp fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public Timestamp getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(Timestamp fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}

