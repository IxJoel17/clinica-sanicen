package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.entity.Receta;
import com.utp.clinicasanicen_be.repository.RecetaRepository;
import com.utp.clinicasanicen_be.service.ReporteRecetaMedicaService;
import com.utp.clinicasanicen_be.entity.DetalleReceta;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes/recetas")
@CrossOrigin(origins = "*")
public class ReporteRecetaMedicaController {

    private final RecetaRepository recetaRepository;
    private final ReporteRecetaMedicaService reporteRecetaMedicaService;

    public ReporteRecetaMedicaController(
            RecetaRepository recetaRepository,
            ReporteRecetaMedicaService reporteRecetaMedicaService
    ) {
        this.recetaRepository = recetaRepository;
        this.reporteRecetaMedicaService = reporteRecetaMedicaService;
    }

    @GetMapping("/{idReceta}/pdf")
    public ResponseEntity<byte[]> descargarRecetaMedica(@PathVariable Integer idReceta) {

        Receta receta = recetaRepository.findById(idReceta)
                .orElseThrow(() -> new RuntimeException("Receta médica no encontrada"));
                    List<DetalleReceta> detalles = receta.getDetalles();

        Map<String, Object> datos = new HashMap<>();

        datos.put("NUMERO_RECETA", "RM-" + receta.getIdReceta());
        datos.put("PACIENTE", receta.getPaciente().getNombre() + " " + receta.getPaciente().getApellido());
        datos.put("MEDICO", receta.getMedico().getNombre() + " " + receta.getMedico().getApellido());
        datos.put("ESPECIALIDAD", receta.getMedico().getEspecialidad().getNombre());
        datos.put("FECHA_RECETA", receta.getFecha().toString());
        datos.put("INDICACIONES", receta.getIndicaciones() != null ? receta.getIndicaciones() : "No se registraron indicaciones.");

        byte[] pdf = reporteRecetaMedicaService.generarReporteRecetaMedica(datos, receta.getDetalles());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=receta-medica-" + receta.getIdReceta() + ".pdf")
                .contentLength(pdf.length)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}