

-- ============================================
-- LIMPIAR TABLAS EXISTENTES (SI EXISTEN)
-- ============================================
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS boleta_pago CASCADE;
DROP TABLE IF EXISTS receta CASCADE;
DROP TABLE IF EXISTS historial_medico CASCADE;
DROP TABLE IF EXISTS cita CASCADE;
DROP TABLE IF EXISTS paciente CASCADE;
DROP TABLE IF EXISTS medico CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS logeo CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- ============================================
-- TABLA: usuario
-- ============================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    direccion VARCHAR(250),
    telefono VARCHAR(13),
    correo VARCHAR(150),
    rol VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: logeo
-- ============================================
CREATE TABLE logeo (
    id_logeo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL UNIQUE,
    usuario VARCHAR(8) NOT NULL UNIQUE,
    contrasena VARCHAR(200) NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP,
    CONSTRAINT FK_logeo_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

-- ============================================
-- TABLA: especialidades
-- ============================================
CREATE TABLE especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(350)
);

-- ============================================
-- TABLA: medico
-- ============================================
CREATE TABLE medico (
    id_medico SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    dni VARCHAR(8),
    telefono VARCHAR(13),
    correo VARCHAR(150),
    direccion VARCHAR(250),
    id_especialidad INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT FK_medico_especialidad FOREIGN KEY (id_especialidad)
        REFERENCES especialidades(id_especialidad)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_medico_especialidad ON medico(id_especialidad);

-- ============================================
-- TABLA: paciente
-- ============================================
CREATE TABLE paciente (
    id_paciente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
	dni VARCHAR(8),
    sexo VARCHAR(2),
    fecha_nacimiento DATE,
    direccion VARCHAR(250),
    telefono VARCHAR(13),
    correo VARCHAR(150),
    nro_historia VARCHAR(6)
);

-- ============================================
-- TABLA: cita
-- ============================================
CREATE TABLE cita (
    id_cita SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada',
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    motivo VARCHAR(350),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_cita_paciente FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,
    CONSTRAINT FK_cita_medico FOREIGN KEY (id_medico)
        REFERENCES medico(id_medico)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_cita_paciente ON cita(id_paciente);
CREATE INDEX IF NOT EXISTS IX_cita_medico ON cita(id_medico);

-- ============================================
-- TABLA: historial_medico
-- ============================================
CREATE TABLE historial_medico (
    id_historial SERIAL PRIMARY KEY,
    id_paciente INTEGER NOT NULL,
    id_medico INTEGER NOT NULL,
    diagnostico VARCHAR(250),
    tratamiento VARCHAR(250),
    observaciones VARCHAR(250),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_historial_paciente FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE,
    CONSTRAINT FK_historial_medico FOREIGN KEY (id_medico)
        REFERENCES medico(id_medico)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_historial_paciente ON historial_medico(id_paciente);
CREATE INDEX IF NOT EXISTS IX_historial_medico ON historial_medico(id_medico);

-- ============================================
-- TABLA: receta
-- ============================================
CREATE TABLE receta (
    id_receta SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    indicaciones VARCHAR(500),
    id_medico INTEGER NOT NULL,
    id_paciente INTEGER NOT NULL,
    CONSTRAINT FK_receta_medico FOREIGN KEY (id_medico)
        REFERENCES medico(id_medico)
        ON DELETE CASCADE,
    CONSTRAINT FK_receta_paciente FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_receta_medico ON receta(id_medico);
CREATE INDEX IF NOT EXISTS IX_receta_paciente ON receta(id_paciente);

-- ============================================
-- TABLA: venta
-- ============================================
CREATE TABLE venta (
    id_venta SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    id_receta INTEGER,
    id_usuario INTEGER,
    CONSTRAINT FK_venta_receta FOREIGN KEY (id_receta)
        REFERENCES receta(id_receta)
        ON DELETE SET NULL,
    CONSTRAINT FK_venta_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_venta_receta ON venta(id_receta);
CREATE INDEX IF NOT EXISTS IX_venta_usuario ON venta(id_usuario);

-- ============================================
-- TABLA: boleta_pago
-- ============================================
CREATE TABLE boleta_pago (
    id_boleta SERIAL PRIMARY KEY,
    id_cita INTEGER NOT NULL UNIQUE,
    id_paciente INTEGER NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'pagado',
    CONSTRAINT FK_boleta_cita FOREIGN KEY (id_cita)
        REFERENCES cita(id_cita)
        ON DELETE CASCADE,
    CONSTRAINT FK_boleta_paciente FOREIGN KEY (id_paciente)
        REFERENCES paciente(id_paciente)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_boleta_cita ON boleta_pago(id_cita);
CREATE INDEX IF NOT EXISTS IX_boleta_paciente ON boleta_pago(id_paciente);

-- ============================================
-- INSERTAR DATOS DE MUESTRA
-- ============================================

-- 1. ESPECIALIDADES
INSERT INTO especialidades (nombre, descripcion) VALUES
('Cardiología', 'Especialidad médica que se encarga del corazón y sistema cardiovascular'),
('Pediatría', 'Especialidad médica dedicada al cuidado de la salud de bebés, niños y adolescentes'),
('Medicina General', 'Atención primaria y prevención de enfermedades'),
('Dermatología', 'Especialidad médica que se encarga del diagnóstico y tratamiento de enfermedades de la piel'),
('Traumatología', 'Especialidad médica que se ocupa de las lesiones del sistema músculo-esquelético'),
('Neurología', 'Especialidad médica que trata los trastornos del sistema nervioso'),
('Ginecología', 'Especialidad médica que trata la salud del sistema reproductor femenino'),
('Psicología', 'Disciplina que estudia los procesos mentales y el comportamiento humano');

-- 2. USUARIOS ADMINISTRATIVOS
INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol, fecha_creacion) VALUES
('Juan', 'Pérez', 'Av. Principal 123', '987654321', 'juan.perez@clinicasanicen.com', 'administrador', CURRENT_TIMESTAMP),
('María', 'González', 'Jr. Los Olivos 456', '987654322', 'maria.gonzalez@clinicasanicen.com', 'recepcionista', CURRENT_TIMESTAMP),
('Carlos', 'Rodríguez', 'Calle Lima 789', '987654323', 'carlos.rodriguez@clinicasanicen.com', 'farmaceutico', CURRENT_TIMESTAMP),
('Ana', 'Martínez', 'Av. San Martín 321', '987654324', 'ana.martinez@clinicasanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Luis', 'Sánchez', 'Jr. Bolívar 654', '987654325', 'luis.sanchez@clinicasanicen.com', 'recepcionista', CURRENT_TIMESTAMP);

-- 3. USUARIOS MÉDICOS (para que puedan iniciar sesión)
INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol, fecha_creacion) VALUES
('Roberto', 'Vargas', 'Av. Los Médicos 100', '987654331', 'roberto.vargas@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP),
('Laura', 'Ramírez', 'Jr. Pediatría 200', '987654332', 'laura.ramirez@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP),
('Pedro', 'Mendoza', 'Calle Medicina 300', '987654333', 'pedro.mendoza@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP),
('Carmen', 'Silva', 'Av. Dermatología 400', '987654334', 'carmen.silva@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP),
('Miguel', 'Torres', 'Jr. Traumatología 500', '987654335', 'miguel.torres@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP),
('Patricia', 'Castro', 'Calle Neurología 600', '987654336', 'patricia.castro@clinicasanicen.com', 'medico', CURRENT_TIMESTAMP);

-- 4. CREDENCIALES DE LOGEO - ADMINISTRATIVOS
INSERT INTO logeo (id_usuario, usuario, contrasena, estado, ultimo_acceso) VALUES
(1, 'C222004', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(2, 'C212180', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(3, 'C232178', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(4, 'C222166', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL);

-- 5. CREDENCIALES DE LOGEO - MÉDICOS
INSERT INTO logeo (id_usuario, usuario, contrasena, estado, ultimo_acceso) VALUES
(5, 'J124578', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(6, 'J123456', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(7, 'J112233', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(8, 'J445566', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(9,'J778899', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(10,'J101112', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL);

-- 7. MÉDICOS (vinculados a usuarios por correo)
INSERT INTO medico (nombre, apellido, dni, telefono, correo, direccion, id_especialidad, activo) VALUES
('Dr. Roberto', 'Vargas', '12345678', '987654331', 'roberto.vargas@clinicasanicen.com', 'Av. Los Médicos 100', 1, TRUE),
('Dra. Laura', 'Ramírez', '23456789', '987654332', 'laura.ramirez@clinicasanicen.com', 'Jr. Pediatría 200', 2, TRUE),
('Dr. Pedro', 'Mendoza', '34567890', '987654333', 'pedro.mendoza@clinicasanicen.com', 'Calle Medicina 300', 3, TRUE),
('Dra. Carmen', 'Silva', '45678901', '987654334', 'carmen.silva@clinicasanicen.com', 'Av. Dermatología 400', 4, TRUE),
('Dr. Miguel', 'Torres', '56789012', '987654335', 'miguel.torres@clinicasanicen.com', 'Jr. Traumatología 500', 5, TRUE),
('Dra. Patricia', 'Castro', '67890123', '987654336', 'patricia.castro@clinicasanicen.com', 'Calle Neurología 600', 6, TRUE);

-- 8. PACIENTES
INSERT INTO paciente (nombre, apellido, sexo, fecha_nacimiento, dni, direccion, telefono, correo, nro_historia) VALUES
('José', 'Gutiérrez', 'M', '1985-05-15', '12345678', 'Av. Las Flores 123', '987654341', 'jose.gutierrez@email.com', 'H00001'),
('María', 'López', 'F', '1990-08-22', '23456789', 'Jr. Los Pinos 456', '987654342', 'maria.lopez@email.com', 'H00002'),
('Carlos', 'Fernández', 'M', '1978-12-10', '12457800', 'Calle Real 789', '987654343', 'carlos.fernandez@email.com', 'H00003'),
('Ana', 'Díaz', 'F', '1995-03-25', '19850515', 'Av. Principal 321', '987654344', 'ana.diaz@email.com', 'H00004'),
('Pedro', 'Morales', 'M', '1982-07-18', '09764311', 'Jr. San Juan 654', '987654345', 'pedro.morales@email.com', 'H00005'),
('Lucía', 'Herrera', 'F', '1988-11-30', '19855423', 'Calle Los Alamos 987', '987654346', 'lucia.herrera@email.com', 'H00006'),
('Juan', 'Ramos', 'M', '1975-02-14', '43267257', 'Av. Central 147', '987654347', 'juan.ramos@email.com', 'H00007'),
('Sofía', 'Jiménez', 'F', '1992-09-05', '19479056', 'Jr. Prim1avera 258', '987654348', 'sofia.jimenez@email.com', 'H00008');

-- 9. CITAS
INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico, motivo, created_at) VALUES
('2025-01-20', '09:00:00', 'programada', 1, 1, 'Consulta general por dolor de pecho', CURRENT_TIMESTAMP),
('2025-01-20', '10:30:00', 'programada', 2, 2, 'Control pediátrico para niño de 3 años', CURRENT_TIMESTAMP),
('2025-01-21', '08:00:00', 'programada', 3, 3, 'Chequeo médico anual', CURRENT_TIMESTAMP),
('2025-01-21', '11:00:00', 'programada', 4, 4, 'Consulta por erupción cutánea', CURRENT_TIMESTAMP),
('2025-01-22', '09:30:00', 'programada', 5, 5, 'Dolor en rodilla izquierda', CURRENT_TIMESTAMP),
('2025-01-22', '14:00:00', 'programada', 6, 1, 'Control cardíaco de seguimiento', CURRENT_TIMESTAMP),
('2025-01-23', '10:00:00', 'programada', 7, 2, 'Consulta pediátrica', CURRENT_TIMESTAMP),
('2025-01-23', '15:30:00', 'programada', 8, 3, 'Examen médico pre-ocupacional', CURRENT_TIMESTAMP),
('2025-01-15', '08:30:00', 'completada', 1, 1, 'Control post-operatorio', CURRENT_TIMESTAMP),
('2025-01-15', '13:00:00', 'completada', 2, 2, 'Vacunación', CURRENT_TIMESTAMP);

-- 10. HISTORIALES MÉDICOS
INSERT INTO historial_medico (id_paciente, id_medico, diagnostico, tratamiento, observaciones, fecha_registro) VALUES
(1, 1, 'Hipertensión arterial leve', 'Dieta baja en sodio y ejercicio moderado. Control en 3 meses.', 'Paciente con presión arterial ligeramente elevada. Sin síntomas graves.', CURRENT_TIMESTAMP),
(2, 2, 'Resfriado común', 'Reposo, líquidos abundantes y paracetamol según necesidad.', 'Síntomas leves. Buena evolución esperada.', CURRENT_TIMESTAMP),
(3, 3, 'Gripe estacional', 'Reposo, hidratación y medicamentos sintomáticos.', 'Cuadro viral típico. Seguimiento ambulatorio.', CURRENT_TIMESTAMP),
(4, 4, 'Dermatitis alérgica de contacto', 'Crema con corticoide tópico y evitar contacto con alérgeno.', 'Erupción en brazos y cuello. Mejoría con tratamiento.', CURRENT_TIMESTAMP),
(5, 5, 'Esguince de rodilla grado I', 'Reposo, hielo y antiinflamatorios. Fisioterapia recomendada.', 'Lesión deportiva. Recuperación completa esperada en 2 semanas.', CURRENT_TIMESTAMP),
(6, 1, 'Arritmia cardíaca benigna', 'Monitoreo y control cada 6 meses. Sin medicación por ahora.', 'Palpitaciones ocasionales. No requiere tratamiento inmediato.', CURRENT_TIMESTAMP);

-- 11. RECETAS
INSERT INTO receta (fecha, indicaciones, id_medico, id_paciente) VALUES
(CURRENT_TIMESTAMP, 'Paracetamol 500mg: 1 tableta cada 8 horas por 5 días. Tomar con alimentos.', 3, 3),
(CURRENT_TIMESTAMP, 'Hidrocortisona crema 1%: Aplicar sobre la zona afectada 2 veces al día por 7 días.', 4, 4),
(CURRENT_TIMESTAMP, 'Ibuprofeno 400mg: 1 tableta cada 12 horas por 3 días. Reposo de la extremidad afectada.', 5, 5),
(CURRENT_TIMESTAMP, 'Vitamina D: 1 cápsula al día por 1 mes. Tomar en la mañana con el desayuno.', 2, 2),
(CURRENT_TIMESTAMP, 'Amlodipino 5mg: 1 tableta diaria por la mañana. Control de presión arterial cada semana.', 1, 1);

-- 12. BOLETAS DE PAGO
INSERT INTO boleta_pago (id_cita, id_paciente, fecha_emision, monto, metodo_pago, estado) VALUES
(9, 1, CURRENT_TIMESTAMP, 150.00, 'efectivo', 'pagado'),
(10, 2, CURRENT_TIMESTAMP, 80.00, 'tarjeta', 'pagado'),
(1, 1, CURRENT_TIMESTAMP, 200.00, 'transferencia', 'pendiente'),
(2, 2, CURRENT_TIMESTAMP, 120.00, 'efectivo', 'pagado'),
(3, 3, CURRENT_TIMESTAMP, 180.00, 'tarjeta', 'pagado');

-- ============================================
-- VERIFICACIÓN DE DATOS INSERTADOS
-- ============================================
-- Puedes ejecutar estas consultas para verificar los datos:

-- SELECT COUNT(*) as total_especialidades FROM especialidades;
-- SELECT COUNT(*) as total_usuarios FROM usuario;
-- SELECT COUNT(*) as total_logeo FROM logeo;
-- SELECT COUNT(*) as total_medicos FROM medico;
-- SELECT COUNT(*) as total_pacientes FROM paciente;
-- SELECT COUNT(*) as total_citas FROM cita;
-- SELECT COUNT(*) as total_historiales FROM historial_medico;
-- SELECT COUNT(*) as total_recetas FROM receta;
-- SELECT COUNT(*) as total_boletas FROM boleta_pago;

-- ============================================
-- CREDENCIALES DE ACCESO
-- ============================================

/*
  USUARIOS ADMINISTRATIVOS:
  -------------------------
  Usuario: C222004       Contraseña: 123456  (Administrador)
  Usuario: C212180       Contraseña: 123456  (Administrador)
  Usuario: C232178       Contraseña: 123456  (Administrador)
  Usuario: C222166       Contraseña: 123456  (Administrador)

  USUARIOS MÉDICOS:
  -----------------
  Usuario: J124578       Contraseña: 123456  (Dr. Roberto Vargas - Cardiología)
  Usuario: J123456       Contraseña: 123456  (Dra. Laura Ramírez - Pediatría)
  Usuario: J112233       Contraseña: 123456  (Dr. Pedro Mendoza - Medicina General)
  Usuario: J445566       Contraseña: 123456  (Dra. Carmen Silva - Dermatología)
  Usuario: J778899       Contraseña: 123456  (Dr. Miguel Torres - Traumatología)
  Usuario: J101112       Contraseña: 123456  (Dra. Patricia Castro - Neurología)

  NOTA IMPORTANTE:
  - Todos los usuarios que se registren desde la web tendrán rol 'paciente'
  - Los médicos pueden iniciar sesión con sus credenciales y ver/confirmar citas
*/
