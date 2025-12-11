package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "receta")
public class Receta {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_receta")
    private Integer idReceta;
    
    @Column(name = "fecha")
    private LocalDateTime fecha;
    
    @Column(name = "indicaciones", length = 500)
    private String indicaciones;
    
    @ManyToOne
    @JoinColumn(name = "id_medico", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas"})
    private Medico medico;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas", "boletasPago"})
    private Paciente paciente;
    
    @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Venta> ventas;
    
    public Receta() {
        this.fecha = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }
    
    
    public Integer getIdReceta() {
        return idReceta;
    }
    
    public void setIdReceta(Integer idReceta) {
        this.idReceta = idReceta;
    }
    
    public LocalDateTime getFecha() {
        return fecha;
    }
    
    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }
    
    public String getIndicaciones() {
        return indicaciones;
    }
    
    public void setIndicaciones(String indicaciones) {
        this.indicaciones = indicaciones;
    }
    
    public Medico getMedico() {
        return medico;
    }
    
    public void setMedico(Medico medico) {
        this.medico = medico;
    }
    
    public Paciente getPaciente() {
        return paciente;
    }
    
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
    public List<Venta> getVentas() {
        return ventas;
    }
    
    public void setVentas(List<Venta> ventas) {
        this.ventas = ventas;
    }
}

