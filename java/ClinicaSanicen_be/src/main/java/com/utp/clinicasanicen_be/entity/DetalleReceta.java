package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "detalle_receta")
public class DetalleReceta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_receta")
    private Integer idDetalleReceta;

    @ManyToOne
    @JoinColumn(name = "id_receta", nullable = false)
    @JsonIgnoreProperties({"detalles", "ventas"})
    private Receta receta;

    @Column(name = "medicamento", length = 150, nullable = false)
    private String medicamento;

    @Column(name = "dosis", length = 100)
    private String dosis;

    @Column(name = "frecuencia", length = 100)
    private String frecuencia;

    @Column(name = "duracion", length = 100)
    private String duracion;

    @Column(name = "instrucciones", length = 250)
    private String instrucciones;

    public DetalleReceta() {
    }

    public Integer getIdDetalleReceta() {
        return idDetalleReceta;
    }

    public void setIdDetalleReceta(Integer idDetalleReceta) {
        this.idDetalleReceta = idDetalleReceta;
    }

    public Receta getReceta() {
        return receta;
    }

    public void setReceta(Receta receta) {
        this.receta = receta;
    }

    public String getMedicamento() {
        return medicamento;
    }

    public void setMedicamento(String medicamento) {
        this.medicamento = medicamento;
    }

    public String getDosis() {
        return dosis;
    }

    public void setDosis(String dosis) {
        this.dosis = dosis;
    }

    public String getFrecuencia() {
        return frecuencia;
    }

    public void setFrecuencia(String frecuencia) {
        this.frecuencia = frecuencia;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public String getInstrucciones() {
        return instrucciones;
    }

    public void setInstrucciones(String instrucciones) {
        this.instrucciones = instrucciones;
    }
}