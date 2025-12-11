package com.utp.clinicasanicen_be.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "referencia")
public class Referencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_referencia")
    private Integer idReferencia;
    
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;
    
    @Column(name = "motivo", length = 200)
    private String motivo;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;
    
    @Column(name = "especialidad_destino", length = 200)
    private String especialidadDestino;
    
    public Referencia() {}
    
    
    public Integer getIdReferencia() {
        return idReferencia;
    }
    
    public void setIdReferencia(Integer idReferencia) {
        this.idReferencia = idReferencia;
    }
    
    public LocalDate getFecha() {
        return fecha;
    }
    
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public Paciente getPaciente() {
        return paciente;
    }
    
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
    public Medico getMedico() {
        return medico;
    }
    
    public void setMedico(Medico medico) {
        this.medico = medico;
    }
    
    public String getEspecialidadDestino() {
        return especialidadDestino;
    }
    
    public void setEspecialidadDestino(String especialidadDestino) {
        this.especialidadDestino = especialidadDestino;
    }
}

