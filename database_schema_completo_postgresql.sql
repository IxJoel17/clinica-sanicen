


-- LIMPIAR TABLAS EXISTENTES
DROP TABLE IF EXISTS venta CASCADE;
DROP TABLE IF EXISTS boleta_pago CASCADE;
DROP TABLE IF EXISTS detalle_receta CASCADE;
DROP TABLE IF EXISTS receta CASCADE;
DROP TABLE IF EXISTS historial_medico CASCADE;
DROP TABLE IF EXISTS cita CASCADE;
DROP TABLE IF EXISTS paciente CASCADE;
DROP TABLE IF EXISTS medico CASCADE;
DROP TABLE IF EXISTS especialidades CASCADE;
DROP TABLE IF EXISTS logeo CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

-- TABLA: usuario
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

-- TABLA: logeo
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

-- TABLA: especialidades
CREATE TABLE especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(350)
);

-- TABLA: medico
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

-- TABLA: paciente
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

-- TABLA: cita
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

-- TABLA: historial_medico
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

-- TABLA: receta
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

-- TABLA: detalle_receta
CREATE TABLE detalle_receta (
    id_detalle_receta SERIAL PRIMARY KEY,
    id_receta INTEGER NOT NULL,
    medicamento VARCHAR(150) NOT NULL,
    dosis VARCHAR(100),
    frecuencia VARCHAR(100),
    duracion VARCHAR(100),
    instrucciones VARCHAR(250),
    CONSTRAINT FK_detalle_receta_receta FOREIGN KEY (id_receta)
        REFERENCES receta(id_receta)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_detalle_receta_receta ON detalle_receta(id_receta);
-- TABLA: venta
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

-- TABLA: boleta_pago
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


-- 1. ESPECIALIDADES
INSERT INTO especialidades (nombre, descripcion) VALUES
('Medicina general', 'Atención primaria, prevención, diagnóstico y tratamiento inicial de enfermedades comunes.'),
('Endocrinología', 'Diagnóstico y tratamiento de enfermedades hormonales y metabólicas.'),
('Ortodoncia', 'Corrección de la posición de dientes y maxilares.'),
('Periodoncia', 'Prevención, diagnóstico y tratamiento de enfermedades de encías y tejidos de soporte dental.'),
('Implantología', 'Colocación y control de implantes dentales.'),
('Cirugía oral', 'Procedimientos quirúrgicos dentro de la cavidad oral.'),
('Odontopediatría', 'Atención odontológica especializada en niños y adolescentes.'),
('Odontología preventiva', 'Prevención de enfermedades bucales mediante controles y educación.'),
('Rehabilitación oral', 'Restauración funcional y estética de dientes y estructuras orales.'),
('Patología bucal', 'Diagnóstico de lesiones y enfermedades de la boca.'),
('Radiología', 'Apoyo diagnóstico mediante imágenes radiográficas.'),
('Rayos panorámicos', 'Servicio de imagen dental panorámica para diagnóstico integral.'),
('TAC 3D', 'Tomografía dental tridimensional para diagnóstico avanzado.'),
('Blanqueamiento', 'Tratamiento estético para aclaramiento dental.'),
('Limpiezas', 'Profilaxis y limpieza dental profesional.'),
('Extracciones', 'Retiro de piezas dentales cuando el tratamiento lo requiere.'),
('Prótesis', 'Diseño y colocación de prótesis dentales.'),
('Cirugías', 'Procedimientos quirúrgicos médicos u odontológicos programados.'),
('Psicología', 'Evaluación y acompañamiento psicológico del paciente.'),
('Nutrición', 'Orientación alimentaria y control nutricional.'),
('Podología', 'Atención y cuidado especializado de los pies.'),
('Laboratorio dental', 'Elaboración y apoyo técnico para trabajos dentales.'),
('Fisioterapia', 'Rehabilitación física y recuperación funcional.'),
('Traumatología', 'Atención de lesiones óseas, articulares y musculares.'),
('Laboratorio', 'Servicio de análisis clínicos de apoyo diagnóstico.'),
('Optometría', 'Evaluación visual y corrección óptica básica.'),
('Oftalmología', 'Diagnóstico y tratamiento de enfermedades de los ojos.'),
('Otorrinolaringología', 'Atención de oído, nariz y garganta.'),
('Dermatología', 'Diagnóstico y tratamiento de enfermedades de la piel.'),
('Medicina interna', 'Atención integral de enfermedades en adultos.'),
('Medicina estética', 'Procedimientos orientados al cuidado estético y bienestar del paciente.');


-- 2. USUARIOS DEL SISTEMA: 5 ADMINISTRADORES + 15 MEDICOS + 3 RECEPCIONISTAS + 27 PACIENTES = 50
INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol, fecha_creacion) VALUES
('Carmen', 'Lopez', 'Av. Principal 101', '987650001', 'carmen.lopez@sanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Carlos', 'Mejia', 'Av. Principal 102', '987650002', 'carlos.mejia@sanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Claudia', 'Torres', 'Av. Principal 103', '987650003', 'claudia.torres@sanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Cristian', 'Ramos', 'Av. Principal 104', '987650004', 'cristian.ramos@sanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Carolina', 'Vargas', 'Av. Principal 105', '987650005', 'carolina.vargas@sanicen.com', 'administrador', CURRENT_TIMESTAMP),
('Roberto', 'Vargas', 'Consultorio 201', '987651001', 'roberto.vargas@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Laura', 'Ramirez', 'Consultorio 202', '987651002', 'laura.ramirez@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Pedro', 'Mendoza', 'Consultorio 203', '987651003', 'pedro.mendoza@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Carmen', 'Silva', 'Consultorio 204', '987651004', 'carmen.silva@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Miguel', 'Torres', 'Consultorio 205', '987651005', 'miguel.torres@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Patricia', 'Castro', 'Consultorio 206', '987651006', 'patricia.castro@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Jose', 'Fernandez', 'Consultorio 207', '987651007', 'jose.fernandez@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Daniela', 'Paredes', 'Consultorio 208', '987651008', 'daniela.paredes@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Fernando', 'Quispe', 'Consultorio 209', '987651009', 'fernando.quispe@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Valeria', 'Navarro', 'Consultorio 210', '987651010', 'valeria.navarro@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Rosa', 'Huaman', 'Consultorio 211', '987651011', 'rosa.huaman@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Sergio', 'Salazar', 'Consultorio 212', '987651012', 'sergio.salazar@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Mariana', 'Flores', 'Consultorio 213', '987651013', 'mariana.flores@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Andres', 'Cordova', 'Consultorio 214', '987651014', 'andres.cordova@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Luciana', 'Reyes', 'Consultorio 215', '987651015', 'luciana.reyes@sanicen.com', 'medico', CURRENT_TIMESTAMP),
('Zully Tatiana', 'Tello Ramos', 'Recepcion 1', '987652001', 'zully.tello@sanicen.com', 'recepcionista', CURRENT_TIMESTAMP),
('Daniel Mirco', 'Mesa Medina', 'Recepcion 2', '987652002', 'daniel.medina@sanicen.com', 'recepcionista', CURRENT_TIMESTAMP),
('Ubaldo', 'Sanchez', 'Recepcion 3', '987652003', 'ubaldo.sanchez@sanicen.com', 'recepcionista', CURRENT_TIMESTAMP),
('Jose', 'Gutierrez', 'Av. Las Flores 101', '987653001', 'jose.gutierrez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Maria', 'Lopez', 'Jr. Los Pinos 102', '987653002', 'maria.lopez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Carlos', 'Fernandez', 'Calle Real 103', '987653003', 'carlos.fernandez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Ana', 'Diaz', 'Av. Principal 104', '987653004', 'ana.diaz@email.com', 'paciente', CURRENT_TIMESTAMP),
('Pedro', 'Morales', 'Jr. San Juan 105', '987653005', 'pedro.morales@email.com', 'paciente', CURRENT_TIMESTAMP),
('Lucia', 'Herrera', 'Calle Los Alamos 106', '987653006', 'lucia.herrera@email.com', 'paciente', CURRENT_TIMESTAMP),
('Juan', 'Ramos', 'Av. Central 107', '987653007', 'juan.ramos@email.com', 'paciente', CURRENT_TIMESTAMP),
('Sofia', 'Jimenez', 'Jr. Primavera 108', '987653008', 'sofia.jimenez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Diego', 'Castillo', 'Av. Peru 109', '987653009', 'diego.castillo@email.com', 'paciente', CURRENT_TIMESTAMP),
('Camila', 'Vega', 'Calle Union 110', '987653010', 'camila.vega@email.com', 'paciente', CURRENT_TIMESTAMP),
('Luis', 'Soto', 'Jr. Lima 111', '987653011', 'luis.soto@email.com', 'paciente', CURRENT_TIMESTAMP),
('Andrea', 'Poma', 'Av. Salud 112', '987653012', 'andrea.poma@email.com', 'paciente', CURRENT_TIMESTAMP),
('Marco', 'Nunez', 'Calle Norte 113', '987653013', 'marco.nunez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Fiorella', 'Campos', 'Jr. Sur 114', '987653014', 'fiorella.campos@email.com', 'paciente', CURRENT_TIMESTAMP),
('Alonso', 'Rojas', 'Av. Los Olivos 115', '987653015', 'alonso.rojas@email.com', 'paciente', CURRENT_TIMESTAMP),
('Diana', 'Mamani', 'Calle San Jose 116', '987653016', 'diana.mamani@email.com', 'paciente', CURRENT_TIMESTAMP),
('Renato', 'Ibarra', 'Jr. Ayacucho 117', '987653017', 'renato.ibarra@email.com', 'paciente', CURRENT_TIMESTAMP),
('Paola', 'Chavez', 'Av. Grau 118', '987653018', 'paola.chavez@email.com', 'paciente', CURRENT_TIMESTAMP),
('Javier', 'Ortega', 'Calle Progreso 119', '987653019', 'javier.ortega@email.com', 'paciente', CURRENT_TIMESTAMP),
('Milagros', 'Caceres', 'Jr. Libertad 120', '987653020', 'milagros.caceres@email.com', 'paciente', CURRENT_TIMESTAMP),
('Hector', 'Bellido', 'Av. Esperanza 121', '987653021', 'hector.bellido@email.com', 'paciente', CURRENT_TIMESTAMP),
('Gabriela', 'Valdivia', 'Calle Hospital 122', '987653022', 'gabriela.valdivia@email.com', 'paciente', CURRENT_TIMESTAMP),
('Martin', 'Aguilar', 'Jr. Bolognesi 123', '987653023', 'martin.aguilar@email.com', 'paciente', CURRENT_TIMESTAMP),
('Elena', 'Carranza', 'Av. Alameda 124', '987653024', 'elena.carranza@email.com', 'paciente', CURRENT_TIMESTAMP),
('Brayan', 'Espinoza', 'Calle Los Cedros 125', '987653025', 'brayan.espinoza@email.com', 'paciente', CURRENT_TIMESTAMP),
('Karla', 'Benavides', 'Jr. Los Sauces 126', '987653026', 'karla.benavides@email.com', 'paciente', CURRENT_TIMESTAMP),
('Oscar', 'Medina', 'Av. Sanicen 127', '987653027', 'oscar.medina@email.com', 'paciente', CURRENT_TIMESTAMP);


-- 3. LOGEO: admin=C, medico=J, recepcionista=U, paciente=DNI
INSERT INTO logeo (id_usuario, usuario, contrasena, estado, ultimo_acceso) VALUES
(1, 'C222004', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(2, 'C212180', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(3, 'C232178', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(4, 'C222166', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(5, 'C252001', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(6, 'J124578', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(7, 'J123456', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(8, 'J112233', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(9, 'J445566', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(10, 'J778899', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(11, 'J101112', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(12, 'J202601', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(13, 'J202602', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(14, 'J202603', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(15, 'J202604', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(16, 'J202605', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(17, 'J202606', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(18, 'J202607', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(19, 'J202608', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(20, 'J202609', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(21, 'U100001', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(22, 'U100002', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(23, 'U100003', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(24, '72849136', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(25, '45678912', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(26, '80563427', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(27, '61394285', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(28, '79421063', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(29, '38275691', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(30, '94058217', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(31, '56731849', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(32, '82190475', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(33, '30947582', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(34, '67582914', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(35, '49821736', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(36, '73468250', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(37, '59284617', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(38, '84613592', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(39, '27195864', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(40, '90376428', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(41, '51827369', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(42, '64729185', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(43, '38915672', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(44, '76048291', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(45, '83491726', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(46, '29568143', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(47, '98134752', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(48, '42675918', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(49, '70428596', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL),
(50, '35198274', '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE, NULL);


-- 4. MEDICOS: 15 REGISTROS
INSERT INTO medico (nombre, apellido, dni, telefono, correo, direccion, id_especialidad, activo) VALUES
('Roberto', 'Vargas', '70000001', '987651001', 'roberto.vargas@sanicen.com', 'Consultorio 201', 1, TRUE),
('Laura', 'Ramirez', '70000002', '987651002', 'laura.ramirez@sanicen.com', 'Consultorio 202', 2, TRUE),
('Pedro', 'Mendoza', '70000003', '987651003', 'pedro.mendoza@sanicen.com', 'Consultorio 203', 3, TRUE),
('Carmen', 'Silva', '70000004', '987651004', 'carmen.silva@sanicen.com', 'Consultorio 204', 4, TRUE),
('Miguel', 'Torres', '70000005', '987651005', 'miguel.torres@sanicen.com', 'Consultorio 205', 5, TRUE),
('Patricia', 'Castro', '70000006', '987651006', 'patricia.castro@sanicen.com', 'Consultorio 206', 6, TRUE),
('Jose', 'Fernandez', '70000007', '987651007', 'jose.fernandez@sanicen.com', 'Consultorio 207', 7, TRUE),
('Daniela', 'Paredes', '70000008', '987651008', 'daniela.paredes@sanicen.com', 'Consultorio 208', 8, TRUE),
('Fernando', 'Quispe', '70000009', '987651009', 'fernando.quispe@sanicen.com', 'Consultorio 209', 9, TRUE),
('Valeria', 'Navarro', '70000010', '987651010', 'valeria.navarro@sanicen.com', 'Consultorio 210', 10, TRUE),
('Rosa', 'Huaman', '70000011', '987651011', 'rosa.huaman@sanicen.com', 'Consultorio 211', 11, TRUE),
('Sergio', 'Salazar', '70000012', '987651012', 'sergio.salazar@sanicen.com', 'Consultorio 212', 19, TRUE),
('Mariana', 'Flores', '70000013', '987651013', 'mariana.flores@sanicen.com', 'Consultorio 213', 20, TRUE),
('Andres', 'Cordova', '70000014', '987651014', 'andres.cordova@sanicen.com', 'Consultorio 214', 23, TRUE),
('Luciana', 'Reyes', '70000015', '987651015', 'luciana.reyes@sanicen.com', 'Consultorio 215', 29, TRUE);


-- 5. PACIENTES: 27 REGISTROS. EL USUARIO DE ACCESO ES SU DNI
INSERT INTO paciente (nombre, apellido, dni, sexo, fecha_nacimiento, direccion, telefono, correo, nro_historia) VALUES
('Jose', 'Gutierrez', '72849136', 'M', '1985-05-15', 'Av. Las Flores 101', '987653001', 'jose.gutierrez@email.com', 'H00001'),
('Maria', 'Lopez', '45678912', 'F', '1990-08-22', 'Jr. Los Pinos 102', '987653002', 'maria.lopez@email.com', 'H00002'),
('Carlos', 'Fernandez', '80563427', 'M', '1978-12-10', 'Calle Real 103', '987653003', 'carlos.fernandez@email.com', 'H00003'),
('Ana', 'Diaz', '61394285', 'F', '1995-03-25', 'Av. Principal 104', '987653004', 'ana.diaz@email.com', 'H00004'),
('Pedro', 'Morales', '79421063', 'M', '1982-07-18', 'Jr. San Juan 105', '987653005', 'pedro.morales@email.com', 'H00005'),
('Lucia', 'Herrera', '38275691', 'F', '1988-11-30', 'Calle Los Alamos 106', '987653006', 'lucia.herrera@email.com', 'H00006'),
('Juan', 'Ramos', '94058217', 'M', '1975-02-14', 'Av. Central 107', '987653007', 'juan.ramos@email.com', 'H00007'),
('Sofia', 'Jimenez', '56731849', 'F', '1992-09-05', 'Jr. Primavera 108', '987653008', 'sofia.jimenez@email.com', 'H00008'),
('Diego', 'Castillo', '82190475', 'M', '1999-01-12', 'Av. Peru 109', '987653009', 'diego.castillo@email.com', 'H00009'),
('Camila', 'Vega', '30947582', 'F', '2001-04-19', 'Calle Union 110', '987653010', 'camila.vega@email.com', 'H00010'),
('Luis', 'Soto', '67582914', 'M', '1984-06-21', 'Jr. Lima 111', '987653011', 'luis.soto@email.com', 'H00011'),
('Andrea', 'Poma', '49821736', 'F', '1997-10-09', 'Av. Salud 112', '987653012', 'andrea.poma@email.com', 'H00012'),
('Marco', 'Nunez', '73468250', 'M', '1991-12-01', 'Calle Norte 113', '987653013', 'marco.nunez@email.com', 'H00013'),
('Fiorella', 'Campos', '59284617', 'F', '1989-07-27', 'Jr. Sur 114', '987653014', 'fiorella.campos@email.com', 'H00014'),
('Alonso', 'Rojas', '84613592', 'M', '1994-02-08', 'Av. Los Olivos 115', '987653015', 'alonso.rojas@email.com', 'H00015'),
('Diana', 'Mamani', '27195864', 'F', '1998-05-30', 'Calle San Jose 116', '987653016', 'diana.mamani@email.com', 'H00016'),
('Renato', 'Ibarra', '90376428', 'M', '1980-09-16', 'Jr. Ayacucho 117', '987653017', 'renato.ibarra@email.com', 'H00017'),
('Paola', 'Chavez', '51827369', 'F', '1993-11-11', 'Av. Grau 118', '987653018', 'paola.chavez@email.com', 'H00018'),
('Javier', 'Ortega', '64729185', 'M', '1979-03-03', 'Calle Progreso 119', '987653019', 'javier.ortega@email.com', 'H00019'),
('Milagros', 'Caceres', '38915672', 'F', '1987-01-29', 'Jr. Libertad 120', '987653020', 'milagros.caceres@email.com', 'H00020'),
('Hector', 'Bellido', '76048291', 'M', '1996-08-13', 'Av. Esperanza 121', '987653021', 'hector.bellido@email.com', 'H00021'),
('Gabriela', 'Valdivia', '83491726', 'F', '2000-06-07', 'Calle Hospital 122', '987653022', 'gabriela.valdivia@email.com', 'H00022'),
('Martin', 'Aguilar', '29568143', 'M', '1986-04-24', 'Jr. Bolognesi 123', '987653023', 'martin.aguilar@email.com', 'H00023'),
('Elena', 'Carranza', '98134752', 'F', '1990-12-18', 'Av. Alameda 124', '987653024', 'elena.carranza@email.com', 'H00024'),
('Brayan', 'Espinoza', '42675918', 'M', '2002-02-20', 'Calle Los Cedros 125', '987653025', 'brayan.espinoza@email.com', 'H00025'),
('Karla', 'Benavides', '70428596', 'F', '1995-09-28', 'Jr. Los Sauces 126', '987653026', 'karla.benavides@email.com', 'H00026'),
('Oscar', 'Medina', '35198274', 'M', '1983-10-05', 'Av. Sanicen 127', '987653027', 'oscar.medina@email.com', 'H00027');


-- 6. CITAS DE PRUEBA PARA DASHBOARD
INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico, motivo, created_at) VALUES
('2026-06-01', '08:00:00', 'programada', 1, 1, 'Consulta general de rutina', CURRENT_TIMESTAMP),
('2026-06-02', '09:30:00', 'programada', 2, 2, 'Control de glucosa y metabolismo', CURRENT_TIMESTAMP),
('2026-06-03', '10:00:00', 'pendiente', 3, 3, 'Evaluacion de ortodoncia', CURRENT_TIMESTAMP),
('2026-06-04', '11:30:00', 'completada', 4, 4, 'Control periodontal', CURRENT_TIMESTAMP),
('2026-06-05', '12:00:00', 'cancelada', 5, 5, 'Revision de implante dental', CURRENT_TIMESTAMP),
('2026-06-06', '13:30:00', 'programada', 6, 6, 'Extraccion dental programada', CURRENT_TIMESTAMP),
('2026-06-07', '14:00:00', 'programada', 7, 7, 'Control odontopediatrico', CURRENT_TIMESTAMP),
('2026-06-08', '15:30:00', 'pendiente', 8, 8, 'Limpieza y prevencion dental', CURRENT_TIMESTAMP),
('2026-06-09', '08:00:00', 'completada', 9, 9, 'Rehabilitacion oral', CURRENT_TIMESTAMP),
('2026-06-10', '09:30:00', 'cancelada', 10, 10, 'Evaluacion de lesion bucal', CURRENT_TIMESTAMP),
('2026-06-11', '10:00:00', 'programada', 11, 11, 'Radiografia panoramica', CURRENT_TIMESTAMP),
('2026-06-12', '11:30:00', 'programada', 12, 12, 'Consulta psicologica inicial', CURRENT_TIMESTAMP),
('2026-06-13', '12:00:00', 'pendiente', 13, 13, 'Evaluacion nutricional', CURRENT_TIMESTAMP),
('2026-06-14', '13:30:00', 'completada', 14, 14, 'Terapia fisica inicial', CURRENT_TIMESTAMP),
('2026-06-15', '14:00:00', 'cancelada', 15, 15, 'Consulta dermatologica', CURRENT_TIMESTAMP),
('2026-06-16', '15:30:00', 'programada', 16, 1, 'Dolor dental agudo', CURRENT_TIMESTAMP),
('2026-06-17', '08:00:00', 'programada', 17, 2, 'Control post tratamiento', CURRENT_TIMESTAMP),
('2026-06-18', '09:30:00', 'pendiente', 18, 3, 'Chequeo preventivo', CURRENT_TIMESTAMP),
('2026-06-19', '10:00:00', 'completada', 19, 4, 'Consulta por dolor muscular', CURRENT_TIMESTAMP),
('2026-06-20', '11:30:00', 'cancelada', 20, 5, 'Control de piel', CURRENT_TIMESTAMP),
('2026-06-21', '12:00:00', 'programada', 21, 6, 'Revision de protesis', CURRENT_TIMESTAMP),
('2026-06-22', '13:30:00', 'programada', 22, 7, 'Consulta por sangrado de encias', CURRENT_TIMESTAMP),
('2026-06-23', '14:00:00', 'pendiente', 23, 8, 'Evaluacion bucal', CURRENT_TIMESTAMP),
('2026-06-24', '15:30:00', 'completada', 24, 9, 'Consulta por dolor de garganta', CURRENT_TIMESTAMP),
('2026-06-25', '08:00:00', 'cancelada', 25, 10, 'Control medico general', CURRENT_TIMESTAMP),
('2026-06-26', '09:30:00', 'programada', 26, 11, 'Consulta por cefalea', CURRENT_TIMESTAMP),
('2026-06-27', '10:00:00', 'programada', 27, 12, 'Chequeo de rutina', CURRENT_TIMESTAMP),
('2026-06-28', '11:30:00', 'pendiente', 1, 13, 'Dolor lumbar', CURRENT_TIMESTAMP),
('2026-06-01', '12:00:00', 'completada', 2, 14, 'Control odontologico', CURRENT_TIMESTAMP),
('2026-06-02', '13:30:00', 'cancelada', 3, 15, 'Consulta por alergia', CURRENT_TIMESTAMP);


-- 7. HISTORIALES MEDICOS DE PRUEBA
INSERT INTO historial_medico (id_paciente, id_medico, diagnostico, tratamiento, observaciones, fecha_registro) VALUES
(1, 1, 'Caries dental', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(2, 2, 'Gingivitis leve', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(3, 3, 'Control general normal', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(4, 4, 'Dermatitis leve', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(5, 5, 'Dolor muscular', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(6, 6, 'Ansiedad leve', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(7, 7, 'Sobrepeso', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(8, 8, 'Esguince leve', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(9, 9, 'Rinitis alergica', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(10, 10, 'Cefalea tensional', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(11, 11, 'Dolor dental', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(12, 12, 'Inflamacion de encias', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(13, 13, 'Lumbalgia', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(14, 14, 'Irritacion cutanea', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP),
(15, 15, 'Control odontologico', 'Tratamiento indicado segun evaluacion y control posterior.', 'Registro generado para prueba del sistema Sanicen.', CURRENT_TIMESTAMP);


-- 8. RECETAS DE PRUEBA
INSERT INTO receta (fecha, indicaciones, id_medico, id_paciente) VALUES
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 1, 1),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 2, 2),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 3, 3),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 4, 4),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 5, 5),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 6, 6),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 7, 7),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 8, 8),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 9, 9),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 10, 10),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 11, 11),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 12, 12),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 13, 13),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 14, 14),
(CURRENT_TIMESTAMP, 'Indicaciones medicas registradas. Cumplir tratamiento y asistir a control.', 15, 15);

-- 8.1 DETALLE DE RECETAS DE PRUEBA
INSERT INTO detalle_receta (id_receta, medicamento, dosis, frecuencia, duracion, instrucciones) VALUES
(1, 'Paracetamol 500 mg', '1 tableta', 'Cada 8 horas', '3 días', 'Tomar después de los alimentos.'),
(1, 'Ibuprofeno 400 mg', '1 tableta', 'Cada 12 horas', '2 días', 'Evitar si presenta gastritis.'),

(2, 'Clorhexidina 0.12%', 'Enjuague bucal', '2 veces al día', '7 días', 'No ingerir. Usar después del cepillado.'),
(2, 'Amoxicilina 500 mg', '1 cápsula', 'Cada 8 horas', '5 días', 'Tomar con abundante agua.'),

(3, 'Loratadina 10 mg', '1 tableta', 'Cada 24 horas', '5 días', 'Tomar preferentemente por la noche.'),

(4, 'Diclofenaco gel', 'Aplicación local', 'Cada 12 horas', '4 días', 'Aplicar en la zona afectada.'),

(5, 'Omeprazol 20 mg', '1 cápsula', 'Cada 24 horas', '7 días', 'Tomar antes del desayuno.'),

(6, 'Naproxeno 550 mg', '1 tableta', 'Cada 12 horas', '3 días', 'Tomar después de los alimentos.'),

(7, 'Vitamina C 500 mg', '1 tableta', 'Cada 24 horas', '10 días', 'Tomar con agua.'),

(8, 'Metamizol 500 mg', '1 tableta', 'Cada 8 horas', '3 días', 'Solo si presenta dolor.'),

(9, 'Cetirizina 10 mg', '1 tableta', 'Cada 24 horas', '5 días', 'Evitar conducir si causa sueño.'),

(10, 'Paracetamol 500 mg', '1 tableta', 'Cada 8 horas', '3 días', 'Tomar si presenta dolor o fiebre.');

-- 9. VENTAS DE PRUEBA
INSERT INTO venta (fecha, monto_total, id_receta, id_usuario) VALUES
(CURRENT_TIMESTAMP, 60.00, 1, 21),
(CURRENT_TIMESTAMP, 70.00, 2, 22),
(CURRENT_TIMESTAMP, 80.00, 3, 23),
(CURRENT_TIMESTAMP, 90.00, 4, 21),
(CURRENT_TIMESTAMP, 100.00, 5, 22),
(CURRENT_TIMESTAMP, 110.00, 6, 23),
(CURRENT_TIMESTAMP, 120.00, 7, 21),
(CURRENT_TIMESTAMP, 130.00, 8, 22),
(CURRENT_TIMESTAMP, 140.00, 9, 23),
(CURRENT_TIMESTAMP, 150.00, 10, 21),
(CURRENT_TIMESTAMP, 160.00, 11, 22),
(CURRENT_TIMESTAMP, 170.00, 12, 23);


-- 10. BOLETAS DE PAGO PARA DASHBOARD
INSERT INTO boleta_pago (id_cita, id_paciente, fecha_emision, monto, metodo_pago, estado) VALUES
(1, 1, CURRENT_TIMESTAMP, 100.00, 'efectivo', 'pagado'),
(2, 2, CURRENT_TIMESTAMP, 120.00, 'tarjeta', 'pagado'),
(3, 3, CURRENT_TIMESTAMP, 140.00, 'yape', 'pendiente'),
(4, 4, CURRENT_TIMESTAMP, 160.00, 'plin', 'pagado'),
(5, 5, CURRENT_TIMESTAMP, 180.00, 'transferencia', 'pagado'),
(6, 6, CURRENT_TIMESTAMP, 80.00, 'efectivo', 'pendiente'),
(7, 7, CURRENT_TIMESTAMP, 100.00, 'tarjeta', 'pagado'),
(8, 8, CURRENT_TIMESTAMP, 120.00, 'yape', 'pagado'),
(9, 9, CURRENT_TIMESTAMP, 140.00, 'plin', 'pendiente'),
(10, 10, CURRENT_TIMESTAMP, 160.00, 'transferencia', 'pagado'),
(11, 11, CURRENT_TIMESTAMP, 180.00, 'efectivo', 'pagado'),
(12, 12, CURRENT_TIMESTAMP, 80.00, 'tarjeta', 'pendiente'),
(13, 13, CURRENT_TIMESTAMP, 100.00, 'yape', 'pagado'),
(14, 14, CURRENT_TIMESTAMP, 120.00, 'plin', 'pagado'),
(15, 15, CURRENT_TIMESTAMP, 140.00, 'transferencia', 'pendiente'),
(16, 16, CURRENT_TIMESTAMP, 160.00, 'efectivo', 'pagado'),
(17, 17, CURRENT_TIMESTAMP, 180.00, 'tarjeta', 'pagado'),
(18, 18, CURRENT_TIMESTAMP, 80.00, 'yape', 'pendiente'),
(19, 19, CURRENT_TIMESTAMP, 100.00, 'plin', 'pagado'),
(20, 20, CURRENT_TIMESTAMP, 120.00, 'transferencia', 'pagado'),
(21, 21, CURRENT_TIMESTAMP, 140.00, 'efectivo', 'pendiente'),
(22, 22, CURRENT_TIMESTAMP, 160.00, 'tarjeta', 'pagado'),
(23, 23, CURRENT_TIMESTAMP, 180.00, 'yape', 'pagado'),
(24, 24, CURRENT_TIMESTAMP, 80.00, 'plin', 'pendiente'),
(25, 25, CURRENT_TIMESTAMP, 100.00, 'transferencia', 'pagado');



-- ============================================================
-- VERIFICACION RAPIDA
-- ============================================================
-- SELECT rol, COUNT(*) AS cantidad FROM usuario GROUP BY rol ORDER BY rol;
-- SELECT COUNT(*) AS total_usuarios FROM usuario;
-- SELECT COUNT(*) AS total_logeo FROM logeo;
-- SELECT COUNT(*) AS total_medicos FROM medico;
-- SELECT COUNT(*) AS total_pacientes FROM paciente;
-- SELECT COUNT(*) AS total_especialidades FROM especialidades;
-- SELECT COUNT(*) AS total_citas FROM cita;
-- SELECT COUNT(*) AS total_boletas FROM boleta_pago;
--
-- Debe salir:
-- administrador = 5
-- medico = 15
-- recepcionista = 3
-- paciente = 27
-- total usuarios = 50

/*
CREDENCIALES DE ACCESO
Contrasena general para todos: 123456

  ADMINISTRADORES:
  Usuario: C222004 | Clave: 123456 | Carmen Lopez
  Usuario: C212180 | Clave: 123456 | Carlos Mejia
  Usuario: C232178 | Clave: 123456 | Claudia Torres
  Usuario: C222166 | Clave: 123456 | Cristian Ramos
  Usuario: C252001 | Clave: 123456 | Carolina Vargas
  MEDICOS:
  Usuario: J124578 | Clave: 123456 | Roberto Vargas
  Usuario: J123456 | Clave: 123456 | Laura Ramirez
  Usuario: J112233 | Clave: 123456 | Pedro Mendoza
  Usuario: J445566 | Clave: 123456 | Carmen Silva
  Usuario: J778899 | Clave: 123456 | Miguel Torres
  Usuario: J101112 | Clave: 123456 | Patricia Castro
  Usuario: J202601 | Clave: 123456 | Jose Fernandez
  Usuario: J202602 | Clave: 123456 | Daniela Paredes
  Usuario: J202603 | Clave: 123456 | Fernando Quispe
  Usuario: J202604 | Clave: 123456 | Valeria Navarro
  Usuario: J202605 | Clave: 123456 | Rosa Huaman
  Usuario: J202606 | Clave: 123456 | Sergio Salazar
  Usuario: J202607 | Clave: 123456 | Mariana Flores
  Usuario: J202608 | Clave: 123456 | Andres Cordova
  Usuario: J202609 | Clave: 123456 | Luciana Reyes
  RECEPCIONISTAS:
  Usuario: U100001 | Clave: 123456 | Zully Tatiana Tello Ramos
  Usuario: U100002 | Clave: 123456 | Ulises Ponce
  Usuario: U100003 | Clave: 123456 | Ubaldo Sanchez
  PACIENTES: Usuario = DNI | Clave = 123456
  Ejemplo paciente: 72849136 | Clave: 123456
*/