package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Receta;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RecetaDAO {
    
    public List<Receta> getByPaciente(Integer idPaciente) throws SQLException {
        List<Receta> recetas = new ArrayList<>();
        String sql = "SELECT * FROM receta WHERE id_paciente = ? ORDER BY fecha DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPaciente);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    recetas.add(mapResultSetToReceta(rs));
                }
            }
        }
        return recetas;
    }
    
    public Receta getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM receta WHERE id_receta = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToReceta(rs);
                }
            }
        }
        return null;
    }
    
    public Integer create(Receta receta) throws SQLException {
        String sql = "INSERT INTO receta (fecha, id_historial, id_medico, id_paciente, medicamentos, indicaciones) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id_receta";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setDate(1, receta.getFecha());
            stmt.setInt(2, receta.getIdHistorial());
            stmt.setInt(3, receta.getIdMedico());
            stmt.setInt(4, receta.getIdPaciente());
            stmt.setString(5, receta.getMedicamentos());
            stmt.setString(6, receta.getIndicaciones());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_receta");
                }
            }
        }
        return null;
    }
    
    private Receta mapResultSetToReceta(ResultSet rs) throws SQLException {
        return new Receta(
            rs.getInt("id_receta"),
            rs.getDate("fecha"),
            rs.getInt("id_historial"),
            rs.getInt("id_medico"),
            rs.getInt("id_paciente"),
            rs.getString("medicamentos"),
            rs.getString("indicaciones")
        );
    }
}

