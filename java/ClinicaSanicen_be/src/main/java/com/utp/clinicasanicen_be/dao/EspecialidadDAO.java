package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Especialidad;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EspecialidadDAO {
    
    public List<Especialidad> getAll() throws SQLException {
        List<Especialidad> especialidades = new ArrayList<>();
        String sql = "SELECT * FROM especialidades";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                especialidades.add(mapResultSetToEspecialidad(rs));
            }
        }
        return especialidades;
    }
    
    public Especialidad getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM especialidades WHERE id_especialiad = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToEspecialidad(rs);
                }
            }
        }
        return null;
    }
    
    private Especialidad mapResultSetToEspecialidad(ResultSet rs) throws SQLException {
        return new Especialidad(
            rs.getInt("id_especialiad"),
            rs.getString("nombre"),
            rs.getString("descripcion")
        );
    }
}

