package com.utp.clinicasanicen_be.service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

@Service
public class ReporteBoletaPagoService {

    public byte[] generarBoletaPago(Map<String, Object> datos) {
        try {
            ClassPathResource reportResource =
                    new ClassPathResource("reports/reporte_boleta_pago.jrxml");

            InputStream reportStream = reportResource.getInputStream();

            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);

            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    jasperReport,
                    new HashMap<>(datos),
                    new JREmptyDataSource()
            );

            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error al generar boleta de pago PDF: " + e.getMessage(), e);
        }
    }
}