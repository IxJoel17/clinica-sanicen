package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "boleta_pago")
public class BoletaPago {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Integer idBoleta;
    
    @OneToOne
    @JoinColumn(name = "id_cita", nullable = false)
    @JsonIgnoreProperties({"paciente", "medico", "boletaPago"})
    private Cita cita;
    
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    @JsonIgnoreProperties({"citas", "historialesMedicos", "recetas", "boletasPago"})
    private Paciente paciente;
    
    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision;
    
    @Column(name = "monto", nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;
    
    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;
    
    @Column(name = "estado", length = 50)
    private String estado = "pagado";
    
    public BoletaPago() {
        this.fechaEmision = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        fechaEmision = LocalDateTime.now();
    }
    
    
    public Integer getIdBoleta() {
        return idBoleta;
    }
    
    public void setIdBoleta(Integer idBoleta) {
        this.idBoleta = idBoleta;
    }
    
    public Cita getCita() {
        return cita;
    }
    
    public void setCita(Cita cita) {
        this.cita = cita;
    }
    
    public Paciente getPaciente() {
        return paciente;
    }
    
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }
    
    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }
    
    public BigDecimal getMonto() {
        return monto;
    }
    
    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
}

