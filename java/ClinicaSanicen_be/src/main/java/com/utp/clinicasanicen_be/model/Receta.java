package com.utp.clinicasanicen_be.model;

import java.sql.Date;

public class Receta {
    private Integer idReceta;
    private Date fecha;
    private Integer idHistorial;
    private Integer idMedico;
    private Integer idPaciente;
    private String medicamentos;
    private String indicaciones;
    
    public Receta() {}
    
    public Receta(Integer idReceta, Date fecha, Integer idHistorial, Integer idMedico, 
                  Integer idPaciente, String medicamentos, String indicaciones) {
        this.idReceta = idReceta;
        this.fecha = fecha;
        this.idHistorial = idHistorial;
        this.idMedico = idMedico;
        this.idPaciente = idPaciente;
        this.medicamentos = medicamentos;
        this.indicaciones = indicaciones;
    }
    
    
    public Integer getIdReceta() { return idReceta; }
    public void setIdReceta(Integer idReceta) { this.idReceta = idReceta; }
    
    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }
    
    public Integer getIdHistorial() { return idHistorial; }
    public void setIdHistorial(Integer idHistorial) { this.idHistorial = idHistorial; }
    
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
    
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public String getMedicamentos() { return medicamentos; }
    public void setMedicamentos(String medicamentos) { this.medicamentos = medicamentos; }
    
    public String getIndicaciones() { return indicaciones; }
    public void setIndicaciones(String indicaciones) { this.indicaciones = indicaciones; }
}

