package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Cita;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CitaDAO {
    
    public List<Cita> getAll() throws SQLException {
        List<Cita> citas = new ArrayList<>();
        String sql = "SELECT * FROM cita ORDER BY fecha DESC, hora DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                citas.add(mapResultSetToCita(rs));
            }
        }
        return citas;
    }
    
    public Cita getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM cita WHERE id_cita = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCita(rs);
                }
            }
        }
        return null;
    }
    
    public List<Cita> getByPaciente(Integer idPaciente) throws SQLException {
        List<Cita> citas = new ArrayList<>();
        String sql = "SELECT * FROM cita WHERE id_paciente = ? ORDER BY fecha DESC, hora DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idPaciente);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    citas.add(mapResultSetToCita(rs));
                }
            }
        }
        return citas;
    }
    
    public List<Cita> getByMedico(Integer idMedico) throws SQLException {
        List<Cita> citas = new ArrayList<>();
        String sql = "SELECT * FROM cita WHERE id_medico = ? ORDER BY fecha DESC, hora DESC";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, idMedico);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    citas.add(mapResultSetToCita(rs));
                }
            }
        }
        return citas;
    }
    
    public Integer create(Cita cita) throws SQLException {
        String sql = "INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico) " +
                     "VALUES (?, ?, ?, ?, ?) RETURNING id_cita";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setDate(1, cita.getFecha());
            stmt.setTime(2, cita.getHora());
            stmt.setString(3, cita.getEstado() != null ? cita.getEstado() : "pendiente");
            stmt.setInt(4, cita.getIdPaciente());
            stmt.setInt(5, cita.getIdMedico());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_cita");
                }
            }
        }
        return null;
    }
    
    public boolean update(Cita cita) throws SQLException {
        String sql = "UPDATE cita SET fecha = ?, hora = ?, estado = ?, " +
                     "id_paciente = ?, id_medico = ? WHERE id_cita = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setDate(1, cita.getFecha());
            stmt.setTime(2, cita.getHora());
            stmt.setString(3, cita.getEstado());
            stmt.setInt(4, cita.getIdPaciente());
            stmt.setInt(5, cita.getIdMedico());
            stmt.setInt(6, cita.getIdCita());
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM cita WHERE id_cita = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
    
    private Cita mapResultSetToCita(ResultSet rs) throws SQLException {
        return new Cita(
            rs.getInt("id_cita"),
            rs.getDate("fecha"),
            rs.getTime("hora"),
            rs.getString("estado"),
            rs.getInt("id_paciente"),
            rs.getInt("id_medico")
        );
    }
}

