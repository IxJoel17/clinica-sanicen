package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Paciente;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PacienteDAO {
    
    public List<Paciente> getAll() throws SQLException {
        List<Paciente> pacientes = new ArrayList<>();
        String sql = "SELECT * FROM paciente";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                pacientes.add(mapResultSetToPaciente(rs));
            }
        }
        return pacientes;
    }
    
    public Paciente getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM paciente WHERE id_paciente = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPaciente(rs);
                }
            }
        }
        return null;
    }
    
    public Paciente getByDni(String dni) throws SQLException {
        String sql = "SELECT * FROM paciente WHERE DNI = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, dni);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToPaciente(rs);
                }
            }
        }
        return null;
    }
    
    public Integer create(Paciente paciente) throws SQLException {
        String sql = "INSERT INTO paciente (nro_historia, nombre, DNI, fecha_nacimiento, direccion, telefono) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id_paciente";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, paciente.getNroHistoria());
            stmt.setString(2, paciente.getNombre());
            stmt.setString(3, paciente.getDni());
            stmt.setDate(4, paciente.getFechaNacimiento());
            stmt.setString(5, paciente.getDireccion());
            stmt.setString(6, paciente.getTelefono());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_paciente");
                }
            }
        }
        return null;
    }
    
    public boolean update(Paciente paciente) throws SQLException {
        String sql = "UPDATE paciente SET nro_historia = ?, nombre = ?, DNI = ?, " +
                     "fecha_nacimiento = ?, direccion = ?, telefono = ? WHERE id_paciente = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, paciente.getNroHistoria());
            stmt.setString(2, paciente.getNombre());
            stmt.setString(3, paciente.getDni());
            stmt.setDate(4, paciente.getFechaNacimiento());
            stmt.setString(5, paciente.getDireccion());
            stmt.setString(6, paciente.getTelefono());
            stmt.setInt(7, paciente.getIdPaciente());
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM paciente WHERE id_paciente = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
    
    private Paciente mapResultSetToPaciente(ResultSet rs) throws SQLException {
        return new Paciente(
            rs.getInt("id_paciente"),
            rs.getString("nro_historia"),
            rs.getString("nombre"),
            rs.getString("DNI"),
            rs.getDate("fecha_nacimiento"),
            rs.getString("direccion"),
            rs.getString("telefono")
        );
    }
}

