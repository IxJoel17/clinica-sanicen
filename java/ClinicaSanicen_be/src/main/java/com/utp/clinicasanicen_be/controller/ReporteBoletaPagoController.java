package com.utp.clinicasanicen_be.controller;

import com.utp.clinicasanicen_be.service.ReporteBoletaPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes/boletas")
@CrossOrigin(origins = "*")
public class ReporteBoletaPagoController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ReporteBoletaPagoService reporteBoletaPagoService;

    @GetMapping("/{idBoleta}/pdf")
    public ResponseEntity<?> generarBoletaPdf(@PathVariable Integer idBoleta) {
        try {
            String sql = """
                SELECT
                    b.id_boleta,
                    b.fecha_emision,
                    b.monto,
                    b.metodo_pago,
                    b.estado,
                    c.fecha AS fecha_cita,
                    c.hora AS hora_cita,
                    c.motivo,
                    p.nombre AS paciente_nombre,
                    p.apellido AS paciente_apellido,
                    m.nombre AS medico_nombre,
                    m.apellido AS medico_apellido,
                    e.nombre AS especialidad
                FROM boleta_pago b
                INNER JOIN cita c ON b.id_cita = c.id_cita
                INNER JOIN paciente p ON b.id_paciente = p.id_paciente
                INNER JOIN medico m ON c.id_medico = m.id_medico
                LEFT JOIN especialidades e ON m.id_especialidad = e.id_especialidad
                WHERE b.id_boleta = ?
            """;

            Map<String, Object> boleta = jdbcTemplate.queryForMap(sql, idBoleta);

            Map<String, Object> datos = new HashMap<>();

            InputStream logoStream = new ClassPathResource("static/img/logo.png").getInputStream();

            datos.put("LOGO_PATH", logoStream);

            datos.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
            datos.put("RUC", "20512609458");
            datos.put("DIRECCION", "Av. Principal 101 - Clínica Sanicen");
            datos.put("TELEFONO", "987654321");

            datos.put("ID_BOLETA", valorTexto(boleta.get("id_boleta")));
            datos.put("FECHA_EMISION", obtenerSoloFecha(valorTexto(boleta.get("fecha_emision"))));

            datos.put(
                    "PACIENTE",
                    valorTexto(boleta.get("paciente_nombre")) + " " +
                            valorTexto(boleta.get("paciente_apellido"))
            );

            datos.put(
                    "MEDICO",
                    valorTexto(boleta.get("medico_nombre")) + " " +
                            valorTexto(boleta.get("medico_apellido"))
            );

            datos.put("ESPECIALIDAD", valorTexto(boleta.get("especialidad")));
            datos.put("FECHA_CITA", valorTexto(boleta.get("fecha_cita")));
            datos.put("HORA_CITA", valorTexto(boleta.get("hora_cita")));
            datos.put("MOTIVO", valorTexto(boleta.get("motivo")));
            datos.put("MONTO", formatoMonto(boleta.get("monto")));
            datos.put("METODO_PAGO", valorTexto(boleta.get("metodo_pago")));
            datos.put("ESTADO", valorTexto(boleta.get("estado")).toUpperCase());

            byte[] pdf = reporteBoletaPagoService.generarBoletaPago(datos);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.inline()
                            .filename("boleta_pago_" + idBoleta + ".pdf")
                            .build()
            );

            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);

        } catch (EmptyResultDataAccessException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "No existe una boleta de pago con ID: " + idBoleta);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al generar boleta de pago PDF: " + e.getMessage());

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

    private String formatoMonto(Object valor) {
        if (valor == null) {
            return "S/ 0.00";
        }

        try {
            BigDecimal monto = new BigDecimal(String.valueOf(valor));
            return "S/ " + monto.setScale(2).toString();
        } catch (Exception e) {
            return "S/ " + valor;
        }
    }
}