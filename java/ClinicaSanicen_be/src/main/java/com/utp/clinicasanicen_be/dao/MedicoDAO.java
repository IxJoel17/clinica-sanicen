package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Medico;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MedicoDAO {
    
    public List<Medico> getAll() throws SQLException {
        List<Medico> medicos = new ArrayList<>();
        String sql = "SELECT * FROM medico";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                medicos.add(mapResultSetToMedico(rs));
            }
        }
        return medicos;
    }
    
    public Medico getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM medico WHERE id_medico = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToMedico(rs);
                }
            }
        }
        return null;
    }
    
    public List<Medico> getByEspecialidad(Integer especialidadId) throws SQLException {
        List<Medico> medicos = new ArrayList<>();
        String sql = "SELECT * FROM medico WHERE especialidad_id = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, especialidadId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    medicos.add(mapResultSetToMedico(rs));
                }
            }
        }
        return medicos;
    }
    
    private Medico mapResultSetToMedico(ResultSet rs) throws SQLException {
        return new Medico(
            rs.getInt("id_medico"),
            rs.getString("nombre"),
            rs.getString("apellido"),
            rs.getString("CMP"),
            rs.getInt("especialidad_id"),
            rs.getString("teléfono"),
            rs.getString("correo")
        );
    }
}

