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
        System.out.println("PASO 1: Entró al servicio Jasper");

        ClassPathResource reportResource = new ClassPathResource("reports/boleta_cita.jrxml");
        System.out.println("PASO 2: Existe JRXML: " + reportResource.exists());

        InputStream reportStream = reportResource.getInputStream();
        System.out.println("PASO 3: Abrió el InputStream del JRXML");

        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
        System.out.println("PASO 4: Compiló el JRXML correctamente");

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("LOGO_PATH", new ClassPathResource("static/img/logo.png").getInputStream());
        parametros.put("NOMBRE_CLINICA", "CLÍNICA SANICEN");
        parametros.put("RUC", "20481234567");
        parametros.put("DIRECCION", "Av. Principal 123 - Lima, Perú");
        parametros.put("TELEFONO", "999 888 777");
        parametros.put("FECHA_EMISION", LocalDate.now().toString());

        parametros.putAll(datos);
        System.out.println("PASO 5: Cargó los parámetros");

        JRBeanCollectionDataSource dataSource =
                new JRBeanCollectionDataSource(List.of(datos));

        System.out.println("PASO 6: Creó el datasource");

        JasperPrint jasperPrint = JasperFillManager.fillReport(
                jasperReport,
                parametros,
                dataSource
        );

        System.out.println("PASO 7: Llenó el reporte");

        byte[] pdf = JasperExportManager.exportReportToPdf(jasperPrint);

        System.out.println("PASO 8: Exportó el PDF correctamente");

        return pdf;

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Error al generar boleta PDF con JasperReports: " + e.getMessage(), e);
        }
    }
}