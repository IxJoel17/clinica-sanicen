package com.utp.clinicasanicen_be.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class BoletaPago {
    private Integer idBoleta;
    private Integer idCita;
    private Integer idPaciente;
    private Timestamp fechaEmision;
    private BigDecimal monto;
    private String metodoPago;
    private String estado;
    
    public BoletaPago() {}
    
    public BoletaPago(Integer idBoleta, Integer idCita, Integer idPaciente, 
                      Timestamp fechaEmision, BigDecimal monto, String metodoPago, String estado) {
        this.idBoleta = idBoleta;
        this.idCita = idCita;
        this.idPaciente = idPaciente;
        this.fechaEmision = fechaEmision;
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.estado = estado;
    }
    
    
    public Integer getIdBoleta() { return idBoleta; }
    public void setIdBoleta(Integer idBoleta) { this.idBoleta = idBoleta; }
    
    public Integer getIdCita() { return idCita; }
    public void setIdCita(Integer idCita) { this.idCita = idCita; }
    
    public Integer getIdPaciente() { return idPaciente; }
    public void setIdPaciente(Integer idPaciente) { this.idPaciente = idPaciente; }
    
    public Timestamp getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(Timestamp fechaEmision) { this.fechaEmision = fechaEmision; }
    
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}

