package com.utp.clinicasanicen_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

@SpringBootApplication
public class ClinicaSanicenApplication {

    public static void main(String[] args) {
        try {
            String url = System.getenv().getOrDefault("DB_URL", "jdbc:postgresql://ep-weathered-band-ai32ui1t-pooler.c-4.us-east-1.aws.neon.tech/sanicen?sslmode=require&channel_binding=require");
            String user = System.getenv().getOrDefault("DB_USER", "neondb_owner");
            String password = System.getenv().getOrDefault("DB_PASSWORD", "npg_FmOxU1dTuA6J");
            
            Class.forName("org.postgresql.Driver");
            try (Connection conn = DriverManager.getConnection(url, user, password);
                 Statement stmt = conn.createStatement()) {
                System.out.println("Running database patch to create 'referencia' table if it doesn't exist...");
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS referencia (" +
                    "    id_referencia SERIAL PRIMARY KEY," +
                    "    fecha DATE NOT NULL," +
                    "    motivo VARCHAR(200)," +
                    "    id_paciente INTEGER NOT NULL," +
                    "    id_medico INTEGER NOT NULL," +
                    "    especialidad_destino VARCHAR(200)," +
                    "    CONSTRAINT FK_referencia_paciente FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente) ON DELETE CASCADE," +
                    "    CONSTRAINT FK_referencia_medico FOREIGN KEY (id_medico) REFERENCES medico(id_medico) ON DELETE CASCADE" +
                    ")"
                );
                stmt.execute("CREATE INDEX IF NOT EXISTS IX_referencia_paciente ON referencia(id_paciente)");
                stmt.execute("CREATE INDEX IF NOT EXISTS IX_referencia_medico ON referencia(id_medico)");
                System.out.println("Database patch executed successfully!");
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not run DB patch: " + e.getMessage());
        }

        SpringApplication.run(ClinicaSanicenApplication.class, args);
    }
}

