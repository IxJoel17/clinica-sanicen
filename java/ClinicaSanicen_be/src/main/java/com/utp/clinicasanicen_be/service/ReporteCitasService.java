package com.utp.clinicasanicen_be.service;

import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReporteCitasService {

    public byte[] generarComprobanteCita(Map<String, Object> datos) {
        try {
            ClassPathResource reportResource =
                    new ClassPathResource("reports/boleta_cita.jrxml");

            InputStream reportStream = reportResource.getInputStream();

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport,
                    new HashMap<>(datos),
                    new JREmptyDataSource(1)
            );

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar comprobante de cita PDF: " + e.getMessage(), e);
        }
    }
}