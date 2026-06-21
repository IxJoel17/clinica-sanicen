package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.dto.report.ReporteCitasEspecialidadDTO;
import com.utp.clinicasanicen_be.repository.CitaRepository;
import com.utp.clinicasanicen_be.service.ReporteCitasService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reportes/citas")
@CrossOrigin(origins = "*")
public class ReporteCitasController {

    private final CitaRepository citaRepository;
    private final ReporteCitasService reporteCitasService;

    public ReporteCitasController(
            CitaRepository citaRepository,
            ReporteCitasService reporteCitasService
    ) {
        this.citaRepository = citaRepository;
        this.reporteCitasService = reporteCitasService;
    }

    @GetMapping("/especialidades/pdf")
    public ResponseEntity<byte[]> descargarReporteCitasPorEspecialidad(
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin
    ) {
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);

        List<ReporteCitasEspecialidadDTO> datos =
                citaRepository.contarCitasPorEspecialidad(inicio, fin);

        byte[] pdf = reporteCitasService.generarReporteCitasPorEspecialidad(datos, inicio, fin);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reporte-citas-especialidad.pdf")
                .contentLength(pdf.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}