package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_medico")
public class HistorialMedico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Integer idHistorial;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas", "boletasPago"})
    private Paciente paciente;
    
    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas"})
    private Medico medico;
    
    @Column(name = "diagnostico", length = 250)
    private String diagnostico;
    
    @Column(name = "tratamiento", length = 250)
    private String tratamiento;
    
    @Column(name = "observaciones", length = 250)
    private String observaciones;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    public HistorialMedico() {
        this.fechaRegistro = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }
    
    
    public Integer getIdHistorial() {
        return idHistorial;
    }
    
    public void setIdHistorial(Integer idHistorial) {
        this.idHistorial = idHistorial;
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
    
    public String getDiagnostico() {
        return diagnostico;
    }
    
    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }
    
    public String getTratamiento() {
        return tratamiento;
    }
    
    public void setTratamiento(String tratamiento) {
        this.tratamiento = tratamiento;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}

