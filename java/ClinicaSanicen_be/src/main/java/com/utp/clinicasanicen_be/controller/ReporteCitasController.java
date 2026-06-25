package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.service.ReporteCitasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteCitasController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ReporteCitasService reporteCitasService;

    @GetMapping("/citas/{idCita}/pdf")
    public ResponseEntity<?> generarComprobanteCitaPdf(@PathVariable Integer idCita) {
        try {
            String sql = """
                SELECT
                    c.id_cita,
                    c.fecha AS fecha_cita,
                    c.hora AS hora_cita,
                    c.estado,
                    c.motivo,
                    p.nombre AS paciente_nombre,
                    p.apellido AS paciente_apellido,
                    p.dni AS paciente_dni,
                    m.nombre AS medico_nombre,
                    m.apellido AS medico_apellido,
                    e.nombre AS especialidad
                FROM cita c
                INNER JOIN paciente p ON c.id_paciente = p.id_paciente
                INNER JOIN medico m ON c.id_medico = m.id_medico
                LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                WHERE c.id_cita = ?
            """;

            Map<String, Object> cita = jdbcTemplate.queryForMap(sql, idCita);

            Map<String, Object> datos = new HashMap<>();

            InputStream logoStream = null;

            try {
                logoStream = new ClassPathResource("static/img/logo.png").getInputStream();
            } catch (Exception ignored) {
                logoStream = null;
            }

            datos.put("LOGO_PATH", logoStream);
            datos.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
            datos.put("FECHA_EMISION", obtenerSoloFecha(String.valueOf(java.time.LocalDate.now())));
            datos.put("NUMERO_CITA", valorTexto(cita.get("id_cita")));

            datos.put(
                    "PACIENTE",
                    valorTexto(cita.get("paciente_nombre")) + " " +
                            valorTexto(cita.get("paciente_apellido"))
            );

            datos.put("DNI", valorTexto(cita.get("paciente_dni")));

            datos.put(
                    "MEDICO",
                    valorTexto(cita.get("medico_nombre")) + " " +
                            valorTexto(cita.get("medico_apellido"))
            );

            datos.put("ESPECIALIDAD", valorTexto(cita.get("especialidad")));
            datos.put("FECHA_CITA", valorTexto(cita.get("fecha_cita")));
            datos.put("HORA_CITA", valorTexto(cita.get("hora_cita")));
            datos.put("MOTIVO", valorTexto(cita.get("motivo")));
            datos.put("ESTADO", valorTexto(cita.get("estado")).toUpperCase());

            byte[] pdf = reporteCitasService.generarComprobanteCita(datos);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename("comprobante_cita_" + idCita + ".pdf")
                            .build()
            );

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);

        } catch (EmptyResultDataAccessException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No existe una cita con ID: " + idCita);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al generar comprobante de cita PDF: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private String valorTexto(Object valor) {
        if (valor == null) {
            return "No registrado";
        }

        return String.valueOf(valor);
    }

    private String obtenerSoloFecha(String fechaCompleta) {
        if (fechaCompleta == null || fechaCompleta.equals("No registrado")) {
            return "No registrado";
        }

        if (fechaCompleta.length() >= 10) {
            return fechaCompleta.substring(0, 10);
        }

        return fechaCompleta;
    }
}