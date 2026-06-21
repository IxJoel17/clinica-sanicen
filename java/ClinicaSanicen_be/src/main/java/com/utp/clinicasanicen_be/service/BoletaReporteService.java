package com.utp.clinicasanicen_be.service;

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
public class BoletaReporteService {

    public byte[] generarBoletaCitaPdf(Map<String, Object> datos) {
    try {
        ClassPathResource reportResource = new ClassPathResource("reports/boleta_cita.jrxml");
        InputStream reportStream = reportResource.getInputStream();

        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("LOGO_PATH", new ClassPathResource("static/img/logo.png").getInputStream());
        parametros.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
        parametros.put("RUC", "20481234567");
        parametros.put("DIRECCION", "Av. Principal 123 - Lima, Perú");
        parametros.put("TELEFONO", "999 888 777");
        parametros.put("FECHA_EMISION", LocalDate.now().toString());

        parametros.putAll(datos);

        JRBeanCollectionDataSource dataSource =
                new JRBeanCollectionDataSource(List.of(datos));

        JasperPrint jasperPrint = JasperFillManager.fillReport(
                jasperReport,
                parametros,
                dataSource
        );

        return JasperExportManager.exportReportToPdf(jasperPrint);

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error al generar boleta PDF con JasperReports: " + e.getMessage(), e);
    }
}
}