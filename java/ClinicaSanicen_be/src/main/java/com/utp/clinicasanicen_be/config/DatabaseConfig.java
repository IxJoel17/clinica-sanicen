package com.utp.clinicasanicen_be.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConfig {

    // Las credenciales se leen desde variables de entorno del sistema.
    // Si la variable no esta definida, se usa el valor por defecto apuntando a Neon Tech.
    // Para produccion segura, define las variables de entorno: DB_URL, DB_USER, DB_PASSWORD
    private static final String URL = System.getenv().getOrDefault(
        "DB_URL",
        "jdbc:postgresql://ep-weathered-band-ai32ui1t-pooler.c-4.us-east-1.aws.neon.tech/sanicen?sslmode=require&channel_binding=require"
    );
    private static final String USER = System.getenv().getOrDefault(
        "DB_USER",
        "neondb_owner"
    );
    private static final String PASSWORD = System.getenv().getOrDefault(
        "DB_PASSWORD",
        "npg_FmOxU1dTuA6J"
    );

    // Singleton thread-safe con doble verificacion
    private static volatile DatabaseConfig instance;
    private Connection connection;

    private DatabaseConfig() {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("Error cargando el driver de PostgreSQL", e);
        }
    }

    public static DatabaseConfig getInstance() {
        if (instance == null) {
            synchronized (DatabaseConfig.class) {
                if (instance == null) {
                    instance = new DatabaseConfig();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            connection = DriverManager.getConnection(URL, USER, PASSWORD);
        }
        return connection;
    }

    public void closeConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}

