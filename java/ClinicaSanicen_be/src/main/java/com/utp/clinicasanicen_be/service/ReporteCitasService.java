package com.utp.clinicasanicen_be.service;

import com.utp.clinicasanicen_be.dto.report.ReporteCitasEspecialidadDTO;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReporteCitasService {

    public byte[] generarReporteCitasPorEspecialidad(
            List<ReporteCitasEspecialidadDTO> datos,
            LocalDate fechaInicio,
            LocalDate fechaFin
    ) {
        try {
            ClassPathResource reportResource =
                    new ClassPathResource("reports/reporte_citas_especialidad.jrxml");

            InputStream reportStream = reportResource.getInputStream();

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            Long totalCitas = datos.stream()
                    .mapToLong(ReporteCitasEspecialidadDTO::getCantidad)
                    .sum();

            Map<String, Object> parametros = new HashMap<>();
            parametros.put("LOGO_PATH", new ClassPathResource("static/img/logo.png").getInputStream());
            parametros.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
            parametros.put("TITULO", "REPORTE SEMANAL DE CITAS MÉDICAS");
            parametros.put("FECHA_INICIO", fechaInicio.toString());
            parametros.put("FECHA_FIN", fechaFin.toString());
            parametros.put("TOTAL_CITAS", totalCitas.toString());

            JRBeanCollectionDataSource dataSource =
                    new JRBeanCollectionDataSource(datos);

            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport,
                    parametros,
                    dataSource
            );

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar reporte semanal de citas: " + e.getMessage(), e);
        }
    }
}