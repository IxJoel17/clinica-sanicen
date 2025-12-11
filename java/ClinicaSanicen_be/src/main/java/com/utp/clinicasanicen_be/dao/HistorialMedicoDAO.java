package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.HistorialMedico;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class HistorialMedicoDAO {
    
    public HistorialMedico getByPaciente(Integer idPaciente) throws SQLException {
        String sql = "SELECT * FROM historial_medico WHERE id_paciente = ? ORDER BY fecha_creacion DESC LIMIT 1";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPaciente);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToHistorial(rs);
                }
            }
        }
        return null;
    }
    
    public List<HistorialMedico> getAllByPaciente(Integer idPaciente) throws SQLException {
        List<HistorialMedico> historiales = new ArrayList<>();
        String sql = "SELECT * FROM historial_medico WHERE id_paciente = ? ORDER BY fecha_creacion DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPaciente);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    historiales.add(mapResultSetToHistorial(rs));
                }
            }
        }
        return historiales;
    }
    
    public HistorialMedico getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM historial_medico WHERE id_historial = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToHistorial(rs);
                }
            }
        }
        return null;
    }
    
    public Integer create(HistorialMedico historial) throws SQLException {
        String sql = "INSERT INTO historial_medico (id_paciente, antecedentes, diagnosticos, tratamientos, alergias) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id_historial";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, historial.getIdPaciente());
            stmt.setString(2, historial.getAntecedentes());
            stmt.setString(3, historial.getDiagnosticos());
            stmt.setString(4, historial.getTratamientos());
            stmt.setString(5, historial.getAlergias());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_historial");
                }
            }
        }
        return null;
    }
    
    public boolean update(HistorialMedico historial) throws SQLException {
        String sql = "UPDATE historial_medico SET antecedentes = ?, diagnosticos = ?, " +
                     "tratamientos = ?, alergias = ? WHERE id_historial = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, historial.getAntecedentes());
            stmt.setString(2, historial.getDiagnosticos());
            stmt.setString(3, historial.getTratamientos());
            stmt.setString(4, historial.getAlergias());
            stmt.setInt(5, historial.getIdHistorial());
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    private HistorialMedico mapResultSetToHistorial(ResultSet rs) throws SQLException {
        return new HistorialMedico(
            rs.getInt("id_historial"),
            rs.getInt("id_paciente"),
            rs.getString("antecedentes"),
            rs.getString("diagnosticos"),
            rs.getString("tratamientos"),
            rs.getString("alergias"),
            rs.getTimestamp("fecha_creacion"),
            rs.getTimestamp("fecha_actualizacion")
        );
    }
}

