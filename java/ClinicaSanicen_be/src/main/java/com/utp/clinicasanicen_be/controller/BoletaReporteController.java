package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Cita;
import com.utp.clinicasanicen_be.repository.CitaRepository;
import com.utp.clinicasanicen_be.service.BoletaReporteService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/boletas/reporte")
@CrossOrigin(origins = "*")
public class BoletaReporteController {

    private final CitaRepository citaRepository;
    private final BoletaReporteService boletaReporteService;

    public BoletaReporteController(
            CitaRepository citaRepository,
            BoletaReporteService boletaReporteService
    ) {
        this.citaRepository = citaRepository;
        this.boletaReporteService = boletaReporteService;
    }

    @GetMapping("/cita/{idCita}/pdf")
    public ResponseEntity<byte[]> descargarBoletaPorCita(@PathVariable Integer idCita) {

        Cita cita = citaRepository.findById(idCita)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        Map<String, Object> datos = new HashMap<>();

        datos.put("NUMERO_BOLETA", "B-" + cita.getIdCita());
        datos.put("PACIENTE", cita.getPaciente().getNombre() + " " + cita.getPaciente().getApellido());
        datos.put("MEDICO", cita.getMedico().getNombre() + " " + cita.getMedico().getApellido());
        datos.put("ESPECIALIDAD", cita.getMedico().getEspecialidad().getNombre());
        datos.put("FECHA_CITA", cita.getFecha().toString());
        datos.put("HORA_CITA", cita.getHora().toString());
        datos.put("MOTIVO", cita.getMotivo() != null ? cita.getMotivo() : "No registrado");
        datos.put("FORMA_PAGO", "Yape / Plin / Tarjeta / Efectivo");
        datos.put("MONTO", "20.00");
        datos.put("ESTADO", "PAGADO");

        byte[] pdf = boletaReporteService.generarBoletaCitaPdf(datos);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=boleta-cita-" + cita.getIdCita() + ".pdf")
            .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
            .header(HttpHeaders.PRAGMA, "no-cache")
            .header(HttpHeaders.EXPIRES, "0")
            .contentLength(pdf.length)
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdf);
    }
}