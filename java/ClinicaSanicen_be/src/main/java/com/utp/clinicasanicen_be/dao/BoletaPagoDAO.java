package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.BoletaPago;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BoletaPagoDAO {
    
    public List<BoletaPago> getByPaciente(Integer idPaciente) throws SQLException {
        List<BoletaPago> boletas = new ArrayList<>();
        String sql = "SELECT * FROM boleta_pago WHERE id_paciente = ? ORDER BY fecha_emision DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPaciente);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    boletas.add(mapResultSetToBoleta(rs));
                }
            }
        }
        return boletas;
    }
    
    public BoletaPago getByCita(Integer idCita) throws SQLException {
        String sql = "SELECT * FROM boleta_pago WHERE id_cita = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idCita);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBoleta(rs);
                }
            }
        }
        return null;
    }
    
    public BoletaPago getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM boleta_pago WHERE id_boleta = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBoleta(rs);
                }
            }
        }
        return null;
    }
    
    public Integer create(BoletaPago boleta) throws SQLException {
        String sql = "INSERT INTO boleta_pago (id_cita, id_paciente, fecha_emision, monto, metodo_pago, estado) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id_boleta";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, boleta.getIdCita());
            stmt.setInt(2, boleta.getIdPaciente());
            stmt.setTimestamp(3, boleta.getFechaEmision());
            stmt.setBigDecimal(4, boleta.getMonto());
            stmt.setString(5, boleta.getMetodoPago());
            stmt.setString(6, boleta.getEstado() != null ? boleta.getEstado() : "pendiente");
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_boleta");
                }
            }
        }
        return null;
    }
    
    private BoletaPago mapResultSetToBoleta(ResultSet rs) throws SQLException {
        return new BoletaPago(
            rs.getInt("id_boleta"),
            rs.getInt("id_cita"),
            rs.getInt("id_paciente"),
            rs.getTimestamp("fecha_emision"),
            rs.getBigDecimal("monto"),
            rs.getString("metodo_pago"),
            rs.getString("estado")
        );
    }
}

