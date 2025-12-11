package com.utp.clinicasanicen_be.dao;

import com.utp.clinicasanicen_be.config.DatabaseConfig;
import com.utp.clinicasanicen_be.model.Usuario;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {
    
    public List<Usuario> getAll() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                usuarios.add(mapResultSetToUsuario(rs));
            }
        }
        return usuarios;
    }
    
    public Usuario getById(Integer id) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE id_usuario = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUsuario(rs);
                }
            }
        }
        return null;
    }
    
    public Usuario getByCorreo(String correo) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE correo = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, correo);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUsuario(rs);
                }
            }
        }
        return null;
    }
    
    public Integer create(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol) " +
                     "VALUES (?, ?, ?, ?, ?, ?) RETURNING id_usuario";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getApellido());
            stmt.setString(3, usuario.getDireccion());
            stmt.setString(4, usuario.getTelefono());
            stmt.setString(5, usuario.getCorreo());
            stmt.setString(6, usuario.getRol());
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id_usuario");
                }
            }
        }
        return null;
    }
    
    public boolean update(Usuario usuario) throws SQLException {
        String sql = "UPDATE usuario SET nombre = ?, apellido = ?, direccion = ?, " +
                     "telefono = ?, correo = ?, rol = ? WHERE id_usuario = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getApellido());
            stmt.setString(3, usuario.getDireccion());
            stmt.setString(4, usuario.getTelefono());
            stmt.setString(5, usuario.getCorreo());
            stmt.setString(6, usuario.getRol());
            stmt.setInt(7, usuario.getIdUsuario());
            
            return stmt.executeUpdate() > 0;
        }
    }
    
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE id_usuario = ?";
        
        try (Connection conn = DatabaseConfig.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        }
    }
    
    private Usuario mapResultSetToUsuario(ResultSet rs) throws SQLException {
        return new Usuario(
            rs.getInt("id_usuario"),
            rs.getString("nombre"),
            rs.getString("apellido"),
            rs.getString("direccion"),
            rs.getString("telefono"),
            rs.getString("correo"),
            rs.getString("rol")
        );
    }
}

