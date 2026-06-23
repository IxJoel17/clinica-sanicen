package com.utp.clinicasanicen_be.service;

import com.utp.clinicasanicen_be.entity.DetalleReceta;
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
public class ReporteRecetaMedicaService {

    public byte[] generarReporteRecetaMedica(
            Map<String, Object> datos,
            List<DetalleReceta> detalles
    ) {
        try {
            ClassPathResource reportResource =
                    new ClassPathResource("reports/reporte_receta_medica.jrxml");

            InputStream reportStream = reportResource.getInputStream();

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            Map<String, Object> parametros = new HashMap<>();
            parametros.put("LOGO_PATH", new ClassPathResource("static/img/logo.png").getInputStream());
            parametros.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
            parametros.put("FECHA_EMISION", LocalDate.now().toString());

            parametros.putAll(datos);

            JRBeanCollectionDataSource dataSource =
                    new JRBeanCollectionDataSource(detalles);

            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport,
                    parametros,
                    dataSource
            );

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar receta médica PDF: " + e.getMessage(), e);
        }
    }
}