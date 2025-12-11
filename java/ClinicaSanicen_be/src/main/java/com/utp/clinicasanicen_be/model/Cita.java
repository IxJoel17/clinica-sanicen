package com.utp.clinicasanicen_be.model;

import java.sql.Date;
import java.sql.Time;

public class Cita {
    private Integer idCita;
    private Date fecha;
    private Time hora;
    private String estado;
    private Integer idPaciente;
    private Integer idMedico;
    
    public Cita() {}
    
    public Cita(Integer idCita, Date fecha, Time hora, String estado, 
                Integer idPaciente, Integer idMedico) {
        this.idCita = idCita;
        this.fecha = fecha;
        this.hora = hora;
        this.estado = estado;
        this.idPaciente = idPaciente;
        this.idMedico = idMedico;
    }
    
    
    public Integer getIdCita() { return idCita; }
    public void setIdCita(Integer idCita) { this.idCita = idCita; }
    
    public Date getFecha() { return fecha; }
    public void setFecha(Date fecha) { this.fecha = fecha; }
    
    public Time getHora() { return hora; }
    public void setHora(Time hora) { this.hora = hora; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public Integer getIdMedico() { return idMedico; }
    public void setIdMedico(Integer idMedico) { this.idMedico = idMedico; }
}

