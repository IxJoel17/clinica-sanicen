package com.utp.clinicasanicen_be.dto.report;

public class ReporteCitasEspecialidadDTO {

    private String especialidad;
    private Long cantidad;

    public ReporteCitasEspecialidadDTO(String especialidad, Long cantidad) {
        this.especialidad = especialidad;
        this.cantidad = cantidad;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public Long getCantidad() {
        return cantidad;
    }
}