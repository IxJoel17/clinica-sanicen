package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "cita")
public class Cita {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cita")
    private Integer idCita;
    
    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;
    
    @Column(name = "hora", nullable = false)
    private LocalTime hora;
    
    @Column(name = "estado", length = 50)
    private String estado = "programada";
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas", "boletasPago"})
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas"})
    private Medico medico;
    
    @Column(name = "motivo", length = 350)
    private String motivo;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToOne(mappedBy = "cita", cascade = CascadeType.ALL)
    @JsonIgnore
    private BoletaPago boletaPago;
    
    public Cita() {
        this.createdAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    
    public Integer getIdCita() {
        return idCita;
    }
    
    public void setIdCita(Integer idCita) {
        this.idCita = idCita;
    }
    
    public LocalDate getFecha() {
        return fecha;
    }
    
    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
    
    public LocalTime getHora() {
        return hora;
    }
    
    public void setHora(LocalTime hora) {
        this.hora = hora;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
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
    
    public String getMotivo() {
        return motivo;
    }
    
    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public BoletaPago getBoletaPago() {
        return boletaPago;
    }
    
    public void setBoletaPago(BoletaPago boletaPago) {
        this.boletaPago = boletaPago;
    }
}

