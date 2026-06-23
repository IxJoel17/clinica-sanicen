package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.HistorialMedico;
import com.utp.clinicasanicen_be.repository.HistorialMedicoRepository;
import com.utp.clinicasanicen_be.service.ReporteHistorialMedicoService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes/historial")
@CrossOrigin(origins = "*")
public class ReporteHistorialMedicoController {

    private final HistorialMedicoRepository historialMedicoRepository;
    private final ReporteHistorialMedicoService reporteHistorialMedicoService;

    public ReporteHistorialMedicoController(
            HistorialMedicoRepository historialMedicoRepository,
            ReporteHistorialMedicoService reporteHistorialMedicoService
    ) {
        this.historialMedicoRepository = historialMedicoRepository;
        this.reporteHistorialMedicoService = reporteHistorialMedicoService;
    }

    @GetMapping("/{idHistorial}/pdf")
    public ResponseEntity<byte[]> descargarReporteHistorial(@PathVariable Integer idHistorial) {

        HistorialMedico historial = historialMedicoRepository.findById(idHistorial)
                .orElseThrow(() -> new RuntimeException("Historial médico no encontrado"));

        Map<String, Object> datos = new HashMap<>();

        datos.put("NUMERO_HISTORIAL", "HM-" + historial.getIdHistorial());
        datos.put("PACIENTE", historial.getPaciente().getNombre() + " " + historial.getPaciente().getApellido());
        datos.put("MEDICO", historial.getMedico().getNombre() + " " + historial.getMedico().getApellido());
        datos.put("ESPECIALIDAD", historial.getMedico().getEspecialidad().getNombre());
        datos.put("FECHA_REGISTRO", historial.getFechaRegistro().toString());
        datos.put("DIAGNOSTICO", historial.getDiagnostico() != null ? historial.getDiagnostico() : "No registrado");
        datos.put("TRATAMIENTO", historial.getTratamiento() != null ? historial.getTratamiento() : "No registrado");
        datos.put("OBSERVACIONES", historial.getObservaciones() != null ? historial.getObservaciones() : "Sin observaciones");

        byte[] pdf = reporteHistorialMedicoService.generarReporteHistorialMedico(datos);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reporte-historial-" + historial.getIdHistorial() + ".pdf")
                .contentLength(pdf.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
