	-- ============================================================
	-- BASE DE DATOS FINAL - CLINICA SANICEN
	-- 31 especialidades, 62 medicos, 130 pacientes, 325 citas completadas y 186 futuras (pendientes/programadas/confirmadas)
	-- Cada paciente tiene 2 o 3 citas completadas y todos los médicos tienen citas.
	-- Contraseña general: 123456
	-- ============================================================
	
	DROP SCHEMA public CASCADE;
	CREATE SCHEMA public;
	
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
	
	CREATE TABLE logeo (
	    id_logeo SERIAL PRIMARY KEY,
	    id_usuario INTEGER NOT NULL UNIQUE,
	    usuario VARCHAR(8) NOT NULL UNIQUE,
	    contrasena VARCHAR(200) NOT NULL,
	    estado BOOLEAN DEFAULT TRUE,
	    ultimo_acceso TIMESTAMP,
	    CONSTRAINT FK_logeo_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
	);
	
	CREATE TABLE especialidades (
	    id_especialidad SERIAL PRIMARY KEY,
	    nombre VARCHAR(150) NOT NULL,
	    descripcion VARCHAR(350)
	);
	
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
	    CONSTRAINT FK_medico_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidades(id_especialidad) ON DELETE SET NULL
	);
	
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
	
	CREATE TABLE cita (
	    id_cita SERIAL PRIMARY KEY,
	    fecha DATE NOT NULL,
	    hora TIME NOT NULL,
	    estado VARCHAR(50) DEFAULT 'programada',
	    id_paciente INTEGER NOT NULL REFERENCES paciente(id_paciente) ON DELETE CASCADE,
	    id_medico INTEGER NOT NULL REFERENCES medico(id_medico) ON DELETE CASCADE,
	    motivo VARCHAR(350),
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE historial_medico (
	    id_historial SERIAL PRIMARY KEY,
	    id_paciente INTEGER NOT NULL REFERENCES paciente(id_paciente) ON DELETE CASCADE,
	    id_medico INTEGER NOT NULL REFERENCES medico(id_medico) ON DELETE CASCADE,
	    diagnostico VARCHAR(250),
	    tratamiento VARCHAR(250),
	    observaciones VARCHAR(250),
	    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE receta (
	    id_receta SERIAL PRIMARY KEY,
	    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    indicaciones VARCHAR(500),
	    id_medico INTEGER NOT NULL REFERENCES medico(id_medico) ON DELETE CASCADE,
	    id_paciente INTEGER NOT NULL REFERENCES paciente(id_paciente) ON DELETE CASCADE
	);
	
	CREATE TABLE detalle_receta (
	    id_detalle_receta SERIAL PRIMARY KEY,
	    id_receta INTEGER NOT NULL REFERENCES receta(id_receta) ON DELETE CASCADE,
	    medicamento VARCHAR(150) NOT NULL,
	    dosis VARCHAR(100),
	    frecuencia VARCHAR(100),
	    duracion VARCHAR(100),
	    instrucciones VARCHAR(250)
	);
	
	CREATE TABLE venta (
	    id_venta SERIAL PRIMARY KEY,
	    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    monto_total DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
	    id_receta INTEGER REFERENCES receta(id_receta) ON DELETE SET NULL,
	    id_usuario INTEGER REFERENCES usuario(id_usuario) ON DELETE SET NULL
	);
	
	CREATE TABLE boleta_pago (
	    id_boleta SERIAL PRIMARY KEY,
	    id_cita INTEGER NOT NULL UNIQUE REFERENCES cita(id_cita) ON DELETE CASCADE,
	    id_paciente INTEGER NOT NULL REFERENCES paciente(id_paciente) ON DELETE CASCADE,
	    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	    monto DECIMAL(10, 2) NOT NULL,
	    metodo_pago VARCHAR(50),
	    estado VARCHAR(50) DEFAULT 'pagado'
	);
	
	INSERT INTO especialidades (nombre, descripcion) VALUES
	('Medicina general','Atención primaria, prevención, diagnóstico y tratamiento inicial de enfermedades comunes.'),
	('Endocrinología','Diagnóstico y tratamiento de enfermedades hormonales y metabólicas.'),
	('Ortodoncia','Corrección de la posición de dientes y maxilares.'),
	('Periodoncia','Prevención, diagnóstico y tratamiento de enfermedades de encías y tejidos de soporte dental.'),
	('Implantología','Colocación y control de implantes dentales.'),
	('Cirugía oral','Procedimientos quirúrgicos dentro de la cavidad oral.'),
	('Odontopediatría','Atención odontológica especializada en niños y adolescentes.'),
	('Odontología preventiva','Prevención de enfermedades bucales mediante controles y educación.'),
	('Rehabilitación oral','Restauración funcional y estética de dientes y estructuras orales.'),
	('Patología bucal','Diagnóstico de lesiones y enfermedades de la boca.'),
	('Radiología','Apoyo diagnóstico mediante imágenes radiográficas.'),
	('Rayos panorámicos','Servicio de imagen dental panorámica para diagnóstico integral.'),
	('TAC 3D','Tomografía dental tridimensional para diagnóstico avanzado.'),
	('Blanqueamiento','Tratamiento estético para aclaramiento dental.'),
	('Limpiezas','Profilaxis y limpieza dental profesional.'),
	('Extracciones','Retiro de piezas dentales cuando el tratamiento lo requiere.'),
	('Prótesis','Diseño y colocación de prótesis dentales.'),
	('Cirugías','Procedimientos quirúrgicos médicos u odontológicos programados.'),
	('Psicología','Evaluación y acompañamiento psicológico del paciente.'),
	('Nutrición','Orientación alimentaria y control nutricional.'),
	('Podología','Atención y cuidado especializado de los pies.'),
	('Laboratorio dental','Elaboración y apoyo técnico para trabajos dentales.'),
	('Fisioterapia','Rehabilitación física y recuperación funcional.'),
	('Traumatología','Atención de lesiones óseas, articulares y musculares.'),
	('Laboratorio','Servicio de análisis clínicos de apoyo diagnóstico.'),
	('Optometría','Evaluación visual y corrección óptica básica.'),
	('Oftalmología','Diagnóstico y tratamiento de enfermedades de los ojos.'),
	('Otorrinolaringología','Atención de oído, nariz y garganta.'),
	('Dermatología','Diagnóstico y tratamiento de enfermedades de la piel.'),
	('Medicina interna','Atención integral de enfermedades en adultos.'),
	('Medicina estética','Procedimientos orientados al cuidado estético y bienestar del paciente.');
	
	INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol) VALUES
	('Carmen','Lopez','Av. Principal 101','987650001','carmen.lopez@sanicen.com','administrador'),
	('Carlos','Mejia','Av. Principal 102','987650002','carlos.mejia@sanicen.com','administrador'),
	('Claudia','Torres','Av. Principal 103','987650003','claudia.torres@sanicen.com','administrador'),
	('Cristian','Ramos','Av. Principal 104','987650004','cristian.ramos@sanicen.com','administrador'),
	('Carolina','Vargas','Av. Principal 105','987650005','carolina.vargas@sanicen.com','administrador');
	
	INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol)
SELECT nombre, apellido, 'Consultorio ' || (200 + rn), '987651' || LPAD(rn::TEXT,3,'0'), lower(nombre || '.' || apellido || '@sanicen.com'), 'medico'
FROM (VALUES
	(1,'Roberto','Vargas'),
	(2,'Laura','Ramirez'),
	(3,'Pedro','Mendoza'),
	(4,'Carmen','Silva'),
	(5,'Miguel','Torres'),
	(6,'Patricia','Castro'),
	(7,'Jose','Fernandez'),
	(8,'Daniela','Paredes'),
	(9,'Fernando','Quispe'),
	(10,'Valeria','Navarro'),
	(11,'Rosa','Huaman'),
	(12,'Sergio','Salazar'),
	(13,'Mariana','Flores'),
	(14,'Andres','Cordova'),
	(15,'Luciana','Reyes'),
	(16,'Hugo','Alvarez'),
	(17,'Natalia','Rojas'),
	(18,'Esteban','Morales'),
	(19,'Camila','Salas'),
	(20,'Victor','Peña'),
	(21,'Adriana','Mamani'),
	(22,'Ricardo','Sanchez'),
	(23,'Gabriel','Lozano'),
	(24,'Daniel','Castillo'),
	(25,'Silvia','Campos'),
	(26,'Mario','Huerta'),
	(27,'Diana','Carrillo'),
	(28,'Mauricio','Vega'),
	(29,'Elisa','Paredes'),
	(30,'Julio','Ibarra'),
	(31,'Renata','Cruz'),
	(32,'Felipe','Noriega'),
	(33,'Monica','Caceres'),
	(34,'Alvaro','Renteria'),
	(35,'Paola','Herrera'),
	(36,'Diego','Medina'),
	(37,'Fiorella','Aguilar'),
	(38,'Javier','Romero'),
	(39,'Karla','Espinoza'),
	(40,'Bruno','Acosta'),
	(41,'Milagros','Chavez'),
	(42,'Gustavo','Cabrera'),
	(43,'Claudia','Ortega'),
	(44,'Sebastian','Valverde'),
	(45,'Andrea','Palacios'),
	(46,'Mateo','Soto'),
	(47,'Jimena','Leon'),
	(48,'Emilio','Ponce'),
	(49,'Sofia','Tello'),
	(50,'Rodrigo','Arias'),
	(51,'Valentina','Rivas'),
	(52,'Alejandro','Meza'),
	(53,'Daniela','Pinto'),
	(54,'Ximena','Aguirre'),
	(55,'Renzo','Molina'),
	(56,'Camilo','Herrera'),
	(57,'Isabella','Garcia'),
	(58,'Thiago','Vasquez'),
	(59,'Antonella','Cortez'),
	(60,'Benjamin','Espino'),
	(61,'Ariana','Vera'),
	(62,'Nicolas','Zamora')) AS med(rn,nombre,apellido);
	
	INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol) VALUES
	('Zully Tatiana','Tello Ramos','Recepcion 1','987652001','zully.tello@sanicen.com','recepcionista'),
	('Ulises','Ponce','Recepcion 2','987652002','ulises.ponce@sanicen.com','recepcionista'),
	('Ubaldo','Sanchez','Recepcion 3','987652003','ubaldo.sanchez@sanicen.com','recepcionista');
	
	INSERT INTO usuario (nombre, apellido, direccion, telefono, correo, rol)
SELECT datos.nombre, datos.apellido, 'Av. Paciente '||datos.id, '987653'||LPAD(datos.id::TEXT,3,'0'), 'paciente'||datos.id||'@email.com', 'paciente'
FROM (VALUES
(1,'Jose','Gutierrez'),
(2,'Maria','Ramos'),
(3,'Luis','Torres'),
(4,'Ana','Vargas'),
(5,'Carlos','Mendoza'),
(6,'Lucia','Castillo'),
(7,'Pedro','Quispe'),
(8,'Rosa','Flores'),
(9,'Miguel','Salazar'),
(10,'Daniela','Paredes'),
(11,'Fernando','Navarro'),
(12,'Valeria','Huaman'),
(13,'Sergio','Reyes'),
(14,'Mariana','Cordova'),
(15,'Andres','Silva'),
(16,'Luciana','Rojas'),
(17,'Hugo','Alvarez'),
(18,'Natalia','Morales'),
(19,'Esteban','Salas'),
(20,'Camila','Peña'),
(21,'Victor','Mamani'),
(22,'Adriana','Sanchez'),
(23,'Ricardo','Lozano'),
(24,'Gabriel','Campos'),
(25,'Silvia','Huerta'),
(26,'Mario','Carrillo'),
(27,'Diana','Vega'),
(28,'Mauricio','Cruz'),
(29,'Elisa','Ibarra'),
(30,'Julio','Noriega'),
(31,'Renata','Caceres'),
(32,'Felipe','Renteria'),
(33,'Monica','Delgado'),
(34,'Alvaro','Benavides'),
(35,'Paola','Herrera'),
(36,'Diego','Medina'),
(37,'Fiorella','Aguilar'),
(38,'Javier','Romero'),
(39,'Karla','Espinoza'),
(40,'Bruno','Acosta'),
(41,'Milagros','Chavez'),
(42,'Gustavo','Cabrera'),
(43,'Claudia','Ortega'),
(44,'Sebastian','Valverde'),
(45,'Andrea','Palacios'),
(46,'Mateo','Soto'),
(47,'Jimena','Leon'),
(48,'Emilio','Ponce'),
(49,'Sofia','Tello'),
(50,'Rodrigo','Arias'),
(51,'Valentina','Rivas'),
(52,'Alejandro','Meza'),
(53,'Daniel','Pinto'),
(54,'Ximena','Aguirre'),
(55,'Renzo','Molina'),
(56,'Camilo','Herrera'),
(57,'Isabella','Garcia'),
(58,'Thiago','Vasquez'),
(59,'Antonella','Cortez'),
(60,'Benjamin','Espino'),
(61,'Ariana','Vera'),
(62,'Nicolas','Zamora'),
(63,'Fernanda','Chavez'),
(64,'Matias','Paredes'),
(65,'Micaela','Soria'),
(66,'Samuel','Leon'),
(67,'Alessandra','Quiroz'),
(68,'Piero','Campos'),
(69,'Dulce','Bravo'),
(70,'Gonzalo','Medrano'),
(71,'Bianca','Fuentes'),
(72,'Enzo','Cabrera'),
(73,'Noemi','Aguilar'),
(74,'Kevin','Palomino'),
(75,'Valeria','Cano'),
(76,'Joaquin','Rosales'),
(77,'Romina','Castaneda'),
(78,'Leonardo','Tapia'),
(79,'Fabiana','Vargas'),
(80,'Cristopher','Flores'),
(81,'Aylin','Mendoza'),
(82,'Bryan','Soto'),
(83,'Leslie','Pacheco'),
(84,'Oscar','Nunez'),
(85,'Nayeli','Saavedra'),
(86,'Marco','Carranza'),
(87,'Rocio','Alarcon'),
(88,'Franco','Bautista'),
(89,'Kiara','Montes'),
(90,'Aaron','Reategui'),
(91,'Priscila','Zuniga'),
(92,'Alan','Calderon'),
(93,'Nicole','Valdivia'),
(94,'Ivan','Moya'),
(95,'Carla','Arias'),
(96,'Joel','Luna'),
(97,'Tamara','Escobar'),
(98,'Martin','Cueva'),
(99,'Miriam','Suarez'),
(100,'Dante','Villar'),
(101,'Yasmin','Ponce'),
(102,'Cristian','Vasquez'),
(103,'Brenda','Ticona'),
(104,'Erick','Pizarro'),
(105,'Lourdes','Arce'),
(106,'Rafael','Cisneros'),
(107,'Katherine','Lima'),
(108,'Hector','Delgado'),
(109,'Melissa','Rios'),
(110,'Jhon','Mamani'),
(111,'Grecia','Palacios'),
(112,'Emanuel','Aguilar'),
(113,'Dayana','Rojas'),
(114,'Santiago','Torres'),
(115,'Cielo','Salinas'),
(116,'Adrian','Fuentes'),
(117,'Luana','Cordova'),
(118,'Gael','Navarro'),
(119,'Marisol','Reyes'),
(120,'Tomas','Huaman'),
(121,'Estrella','Campos'),
(122,'Cesar','Ortega'),
(123,'Anahi','Bravo'),
(124,'Iker','Santos'),
(125,'Marlene','Cruz'),
(126,'Axel','Carrillo'),
(127,'Samanta','Espinoza'),
(128,'Ruben','Vega'),
(129,'Naomi','Carrasco'),
(130,'Dylan','Herrera')
) AS datos(id, nombre, apellido);
	
	INSERT INTO logeo (id_usuario, usuario, contrasena, estado) VALUES
	(1,'C222004','$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq',TRUE),
	(2,'C212180','$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq',TRUE),
	(3,'C232178','$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq',TRUE),
	(4,'C222166','$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq',TRUE),
	(5,'C252001','$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq',TRUE);
	
	INSERT INTO logeo (id_usuario, usuario, contrasena, estado)
	SELECT id_usuario, 'J'||LPAD((202600 + ROW_NUMBER() OVER (ORDER BY id_usuario))::TEXT,6,'0'), '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE
	FROM usuario WHERE rol='medico';
	UPDATE logeo SET usuario='J124578' WHERE id_usuario=6;
	UPDATE logeo SET usuario='J123456' WHERE id_usuario=7;
	UPDATE logeo SET usuario='J112233' WHERE id_usuario=8;
	UPDATE logeo SET usuario='J445566' WHERE id_usuario=9;
	UPDATE logeo SET usuario='J778899' WHERE id_usuario=10;
	UPDATE logeo SET usuario='J101112' WHERE id_usuario=11;
	
	INSERT INTO logeo (id_usuario, usuario, contrasena, estado)
	SELECT id_usuario, 'U10000'||ROW_NUMBER() OVER (ORDER BY id_usuario), '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE
	FROM usuario WHERE rol='recepcionista';
	
	INSERT INTO medico (nombre, apellido, dni, telefono, correo, direccion, id_especialidad, activo)
SELECT u.nombre, u.apellido,
       LPAD((70000000 + ROW_NUMBER() OVER (ORDER BY u.id_usuario))::TEXT,8,'0'),
       u.telefono, u.correo, u.direccion,
       CASE 
         WHEN ROW_NUMBER() OVER (ORDER BY u.id_usuario) <= 31 
           THEN ROW_NUMBER() OVER (ORDER BY u.id_usuario)
         ELSE ((ROW_NUMBER() OVER (ORDER BY u.id_usuario) - 32) % 31) + 1
       END,
       TRUE
FROM usuario u WHERE u.rol='medico';
	
	INSERT INTO paciente (nombre, apellido, dni, sexo, fecha_nacimiento, direccion, telefono, correo, nro_historia)
SELECT datos.nombre, datos.apellido, LPAD((72840000 + datos.id)::TEXT,8,'0'), CASE WHEN datos.id%2=0 THEN 'F' ELSE 'M' END,
DATE '1980-01-01' + (datos.id * INTERVAL '90 days'), 'Av. Paciente '||datos.id, '987653'||LPAD(datos.id::TEXT,3,'0'), 'paciente'||datos.id||'@email.com', 'H'||LPAD(datos.id::TEXT,5,'0')
FROM (VALUES
(1,'Jose','Gutierrez'),
(2,'Maria','Ramos'),
(3,'Luis','Torres'),
(4,'Ana','Vargas'),
(5,'Carlos','Mendoza'),
(6,'Lucia','Castillo'),
(7,'Pedro','Quispe'),
(8,'Rosa','Flores'),
(9,'Miguel','Salazar'),
(10,'Daniela','Paredes'),
(11,'Fernando','Navarro'),
(12,'Valeria','Huaman'),
(13,'Sergio','Reyes'),
(14,'Mariana','Cordova'),
(15,'Andres','Silva'),
(16,'Luciana','Rojas'),
(17,'Hugo','Alvarez'),
(18,'Natalia','Morales'),
(19,'Esteban','Salas'),
(20,'Camila','Peña'),
(21,'Victor','Mamani'),
(22,'Adriana','Sanchez'),
(23,'Ricardo','Lozano'),
(24,'Gabriel','Campos'),
(25,'Silvia','Huerta'),
(26,'Mario','Carrillo'),
(27,'Diana','Vega'),
(28,'Mauricio','Cruz'),
(29,'Elisa','Ibarra'),
(30,'Julio','Noriega'),
(31,'Renata','Caceres'),
(32,'Felipe','Renteria'),
(33,'Monica','Delgado'),
(34,'Alvaro','Benavides'),
(35,'Paola','Herrera'),
(36,'Diego','Medina'),
(37,'Fiorella','Aguilar'),
(38,'Javier','Romero'),
(39,'Karla','Espinoza'),
(40,'Bruno','Acosta'),
(41,'Milagros','Chavez'),
(42,'Gustavo','Cabrera'),
(43,'Claudia','Ortega'),
(44,'Sebastian','Valverde'),
(45,'Andrea','Palacios'),
(46,'Mateo','Soto'),
(47,'Jimena','Leon'),
(48,'Emilio','Ponce'),
(49,'Sofia','Tello'),
(50,'Rodrigo','Arias'),
(51,'Valentina','Rivas'),
(52,'Alejandro','Meza'),
(53,'Daniel','Pinto'),
(54,'Ximena','Aguirre'),
(55,'Renzo','Molina'),
(56,'Camilo','Herrera'),
(57,'Isabella','Garcia'),
(58,'Thiago','Vasquez'),
(59,'Antonella','Cortez'),
(60,'Benjamin','Espino'),
(61,'Ariana','Vera'),
(62,'Nicolas','Zamora'),
(63,'Fernanda','Chavez'),
(64,'Matias','Paredes'),
(65,'Micaela','Soria'),
(66,'Samuel','Leon'),
(67,'Alessandra','Quiroz'),
(68,'Piero','Campos'),
(69,'Dulce','Bravo'),
(70,'Gonzalo','Medrano'),
(71,'Bianca','Fuentes'),
(72,'Enzo','Cabrera'),
(73,'Noemi','Aguilar'),
(74,'Kevin','Palomino'),
(75,'Valeria','Cano'),
(76,'Joaquin','Rosales'),
(77,'Romina','Castaneda'),
(78,'Leonardo','Tapia'),
(79,'Fabiana','Vargas'),
(80,'Cristopher','Flores'),
(81,'Aylin','Mendoza'),
(82,'Bryan','Soto'),
(83,'Leslie','Pacheco'),
(84,'Oscar','Nunez'),
(85,'Nayeli','Saavedra'),
(86,'Marco','Carranza'),
(87,'Rocio','Alarcon'),
(88,'Franco','Bautista'),
(89,'Kiara','Montes'),
(90,'Aaron','Reategui'),
(91,'Priscila','Zuniga'),
(92,'Alan','Calderon'),
(93,'Nicole','Valdivia'),
(94,'Ivan','Moya'),
(95,'Carla','Arias'),
(96,'Joel','Luna'),
(97,'Tamara','Escobar'),
(98,'Martin','Cueva'),
(99,'Miriam','Suarez'),
(100,'Dante','Villar'),
(101,'Yasmin','Ponce'),
(102,'Cristian','Vasquez'),
(103,'Brenda','Ticona'),
(104,'Erick','Pizarro'),
(105,'Lourdes','Arce'),
(106,'Rafael','Cisneros'),
(107,'Katherine','Lima'),
(108,'Hector','Delgado'),
(109,'Melissa','Rios'),
(110,'Jhon','Mamani'),
(111,'Grecia','Palacios'),
(112,'Emanuel','Aguilar'),
(113,'Dayana','Rojas'),
(114,'Santiago','Torres'),
(115,'Cielo','Salinas'),
(116,'Adrian','Fuentes'),
(117,'Luana','Cordova'),
(118,'Gael','Navarro'),
(119,'Marisol','Reyes'),
(120,'Tomas','Huaman'),
(121,'Estrella','Campos'),
(122,'Cesar','Ortega'),
(123,'Anahi','Bravo'),
(124,'Iker','Santos'),
(125,'Marlene','Cruz'),
(126,'Axel','Carrillo'),
(127,'Samanta','Espinoza'),
(128,'Ruben','Vega'),
(129,'Naomi','Carrasco'),
(130,'Dylan','Herrera')
) AS datos(id, nombre, apellido);
	
	INSERT INTO logeo (id_usuario, usuario, contrasena, estado)
	SELECT u.id_usuario, p.dni, '$2a$10$hnc8l5nHOGIcVux7CT00T.Ws2vDHUZE0HuEdllj3fpCWNf4.qlTSq', TRUE
	FROM usuario u JOIN paciente p ON u.correo = p.correo WHERE u.rol='paciente';
	
	-- 325 citas completadas: cada paciente tiene 2 o 3 completadas y se distribuyen entre 62 médicos
INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico, motivo, created_at)
SELECT CURRENT_DATE - ((g % 120) * INTERVAL '1 day'),
       TIME '08:00' + ((g % 10) * INTERVAL '1 hour'),
       'completada',
       ((g - 1) % 130) + 1,
       ((g - 1) % 62) + 1,
       CASE (g % 10)
         WHEN 0 THEN 'Control médico general'
         WHEN 1 THEN 'Dolor dental'
         WHEN 2 THEN 'Consulta dermatológica'
         WHEN 3 THEN 'Evaluación nutricional'
         WHEN 4 THEN 'Dolor lumbar'
         WHEN 5 THEN 'Control visual'
         WHEN 6 THEN 'Control psicológico'
         WHEN 7 THEN 'Consulta de fisioterapia'
         WHEN 8 THEN 'Chequeo preventivo'
         ELSE 'Seguimiento de tratamiento'
       END,
       CURRENT_TIMESTAMP - ((g % 150) * INTERVAL '1 day')
FROM generate_series(1,325) g;
	
	-- 186 citas futuras: pendientes, programadas y confirmadas del 08 al 31 de julio de 2026
-- Fechas distribuidas entre 2026-07-08 y 2026-07-31 para que salgan en el filtro por fecha.
INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico, motivo, created_at)
SELECT DATE '2026-07-08' + (((g - 1) % 24) * INTERVAL '1 day'),
       TIME '08:00' + ((g % 9) * INTERVAL '1 hour'),
       CASE
         WHEN g % 3 = 0 THEN 'confirmada'
         WHEN g % 3 = 1 THEN 'pendiente'
         ELSE 'programada'
       END,
       ((g - 1) % 130) + 1,
       ((g - 1) % 62) + 1,
       CASE (g % 8)
         WHEN 0 THEN 'Control de seguimiento'
         WHEN 1 THEN 'Consulta pendiente'
         WHEN 2 THEN 'Chequeo preventivo'
         WHEN 3 THEN 'Evaluación médica'
         WHEN 4 THEN 'Control de tratamiento'
         WHEN 5 THEN 'Consulta por dolor'
         WHEN 6 THEN 'Revisión de resultados'
         ELSE 'Atención programada'
       END,
       CURRENT_TIMESTAMP - ((g % 10) * INTERVAL '1 day')
FROM generate_series(1,186) g;

	INSERT INTO cita (fecha, hora, estado, id_paciente, id_medico, motivo, created_at)
SELECT
    f.fecha,
    s.hora,
    CASE
        WHEN s.slot = 1 THEN 'programada'
        WHEN MOD(f.dia_num + m.id_medico, 2) = 0 THEN 'confirmada'
        ELSE 'pendiente'
    END AS estado,
    ((m.id_medico + f.dia_num + s.slot - 1) % 130) + 1 AS id_paciente,
    m.id_medico,
    CASE
        WHEN s.slot = 1 THEN 'Consulta médica programada'
        ELSE 'Control médico de seguimiento'
    END AS motivo,
    CURRENT_TIMESTAMP
	FROM medico m
	CROSS JOIN (
	    SELECT fecha::date AS fecha,
	           ROW_NUMBER() OVER (ORDER BY fecha) AS dia_num
	    FROM generate_series(DATE '2026-07-08', DATE '2026-07-31', INTERVAL '1 day') AS fecha
	) f
	CROSS JOIN (
	    SELECT 1 AS slot, TIME '14:00' AS hora
	    UNION ALL
	    SELECT 2 AS slot, TIME '16:00' AS hora
	) s;
	
	INSERT INTO historial_medico (id_paciente, id_medico, diagnostico, tratamiento, observaciones, fecha_registro)
	SELECT c.id_paciente, c.id_medico,
	CASE (m.id_especialidad % 12) WHEN 0 THEN 'Control médico general' WHEN 1 THEN 'Infección respiratoria leve' WHEN 2 THEN 'Alteración metabólica controlada'
	WHEN 3 THEN 'Maloclusión dental' WHEN 4 THEN 'Gingivitis leve' WHEN 5 THEN 'Control de implante dental' WHEN 6 THEN 'Extracción dental controlada'
	WHEN 7 THEN 'Control odontopediátrico' WHEN 8 THEN 'Caries dental' WHEN 9 THEN 'Rehabilitación oral' WHEN 10 THEN 'Lesión bucal benigna' ELSE 'Dolor musculoesquelético' END,
	'Tratamiento indicado según evaluación médica y control posterior.', 'Paciente atendido correctamente en Clínica Sanicen.', c.fecha + c.hora
	FROM cita c JOIN medico m ON c.id_medico=m.id_medico WHERE c.estado='completada';
	
	INSERT INTO receta (fecha, indicaciones, id_medico, id_paciente)
	SELECT c.fecha + c.hora, 'Cumplir tratamiento indicado y asistir a control si persisten molestias.', c.id_medico, c.id_paciente
	FROM cita c WHERE c.estado='completada';
	
	INSERT INTO detalle_receta (id_receta, medicamento, dosis, frecuencia, duracion, instrucciones)
	SELECT r.id_receta,
	CASE (r.id_receta % 8) WHEN 0 THEN 'Paracetamol 500 mg' WHEN 1 THEN 'Ibuprofeno 400 mg' WHEN 2 THEN 'Loratadina 10 mg' WHEN 3 THEN 'Clorhexidina 0.12%'
	WHEN 4 THEN 'Omeprazol 20 mg' WHEN 5 THEN 'Diclofenaco gel' WHEN 6 THEN 'Cetirizina 10 mg' ELSE 'Amoxicilina 500 mg' END,
	CASE (r.id_receta % 4) WHEN 0 THEN '1 tableta' WHEN 1 THEN '1 cápsula' WHEN 2 THEN 'Aplicación local' ELSE 'Enjuague bucal' END,
	CASE (r.id_receta % 4) WHEN 0 THEN 'Cada 8 horas' WHEN 1 THEN 'Cada 12 horas' WHEN 2 THEN 'Cada 24 horas' ELSE '2 veces al día' END,
	CASE (r.id_receta % 3) WHEN 0 THEN '3 días' WHEN 1 THEN '5 días' ELSE '7 días' END,
	'Usar según indicación médica. No automedicarse.'
	FROM receta r;
	
	INSERT INTO detalle_receta (id_receta, medicamento, dosis, frecuencia, duracion, instrucciones)
	SELECT r.id_receta, 'Paracetamol 500 mg', '1 tableta', 'Cada 8 horas', '3 días', 'Tomar solo si presenta dolor o fiebre.'
	FROM receta r WHERE r.id_receta % 3 = 0;
	
	INSERT INTO boleta_pago (id_cita, id_paciente, fecha_emision, monto, metodo_pago, estado)
	SELECT c.id_cita, c.id_paciente, c.fecha + c.hora, 20.00,
	CASE (c.id_cita % 5) WHEN 0 THEN 'efectivo' WHEN 1 THEN 'tarjeta' WHEN 2 THEN 'yape' WHEN 3 THEN 'plin' ELSE 'transferencia' END, 'pagado'
	FROM cita c WHERE c.estado='completada';
	
	INSERT INTO venta (fecha, monto_total, id_receta, id_usuario)
	SELECT r.fecha, 20.00, r.id_receta, 42 FROM receta r LIMIT 120;
	
	SELECT COUNT(*) AS total_especialidades FROM especialidades;
	SELECT COUNT(*) AS total_medicos FROM medico;
	SELECT COUNT(*) AS total_pacientes FROM paciente;
	SELECT estado, COUNT(*) AS total_citas FROM cita GROUP BY estado ORDER BY estado;
	SELECT COUNT(*) AS total_historiales FROM historial_medico;
	SELECT COUNT(*) AS total_recetas FROM receta;
	SELECT COUNT(*) AS total_boletas FROM boleta_pago;
	SELECT COUNT(*) AS total_usuarios FROM usuario;
	SELECT COUNT(*) AS total_logeo FROM logeo;

SELECT e.id_especialidad, e.nombre, COUNT(m.id_medico) AS medicos_por_especialidad
FROM especialidades e
LEFT JOIN medico m ON e.id_especialidad = m.id_especialidad
GROUP BY e.id_especialidad, e.nombre
ORDER BY e.id_especialidad;

	
	
	-- =========================================================
	-- CREDENCIALES (DOCUMENTACIÓN)
	-- =========================================================
	/*
	SELECT COUNT(*) FROM usuario;
	SELECT COUNT(*) FROM logeo;
	SELECT COUNT(*) FROM medico;
	SELECT COUNT(*) FROM paciente;
	SELECT COUNT(*) FROM cita;
	SELECT COUNT(*) FROM especialidades;
	SELECT COUNT(*) FROM boleta_pago;
	SELECT COUNT(*) FROM receta;
	
	=========================================================
	CREDENCIALES DE ACCESO - SISTEMA CLÍNICA SANICEN
	=========================================================
	
	CONTRASEÑA GENERAL: 123456
	
	ADMINISTRADORES: rol C
	MÉDICOS: rol J
	RECEPCIONISTAS: rol U
	PACIENTES: DNI + 123456
	-------------------------
	ADMINISTRADORES (ROL C)
	-------------------------
	Usuario: C222004 | Clave: 123456 | Carmen Lopez
	Usuario: C212180 | Clave: 123456 | Carlos Mejia
	Usuario: C232178 | Clave: 123456 | Claudia Torres
	Usuario: C222166 | Clave: 123456 | Cristian Ramos
	Usuario: C252001 | Clave: 123456 | Carolina Vargas
	
	-------------------------
	MÉDICOS (ROL J)
	-------------------------
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
	Usuario: J202610 | Clave: 123456 | Hugo Alvarez
	Usuario: J202611 | Clave: 123456 | Natalia Rojas
	Usuario: J202612 | Clave: 123456 | Esteban Morales
	Usuario: J202613 | Clave: 123456 | Camila Salas
	Usuario: J202614 | Clave: 123456 | Victor Peña
	Usuario: J202615 | Clave: 123456 | Adriana Mamani
	Usuario: J202616 | Clave: 123456 | Ricardo Sanchez
	Usuario: J202617 | Clave: 123456 | Gabriel Lozano
	Usuario: J202618 | Clave: 123456 | Daniel Castillo
	Usuario: J202619 | Clave: 123456 | Silvia Campos
	Usuario: J202620 | Clave: 123456 | Mario Huerta
	Usuario: J202621 | Clave: 123456 | Diana Carrillo
	Usuario: J202622 | Clave: 123456 | Mauricio Vega
	Usuario: J202623 | Clave: 123456 | Elisa Paredes
	Usuario: J202624 | Clave: 123456 | Julio Ibarra
	Usuario: J202625 | Clave: 123456 | Renata Cruz
	Usuario: J202626 | Clave: 123456 | Felipe Noriega
	Usuario: J202627 | Clave: 123456 | Monica Caceres
	Usuario: J202628 | Clave: 123456 | Alvaro Renteria
	Usuario: J202629 | Clave: 123456 | Paola Herrera
	Usuario: J202630 | Clave: 123456 | Diego Medina
	Usuario: J202631 | Clave: 123456 | Fiorella Aguilar
	Usuario: J202632 | Clave: 123456 | Javier Romero
	Usuario: J202633 | Clave: 123456 | Karla Espinoza
	Usuario: J202634 | Clave: 123456 | Bruno Acosta
	Usuario: J202635 | Clave: 123456 | Milagros Chavez
	Usuario: J202636 | Clave: 123456 | Gustavo Cabrera
	Usuario: J202637 | Clave: 123456 | Claudia Ortega
	Usuario: J202638 | Clave: 123456 | Sebastian Valverde
	Usuario: J202639 | Clave: 123456 | Andrea Palacios
	Usuario: J202640 | Clave: 123456 | Mateo Soto
	Usuario: J202641 | Clave: 123456 | Jimena Leon
	Usuario: J202642 | Clave: 123456 | Emilio Ponce
	Usuario: J202643 | Clave: 123456 | Sofia Tello
	Usuario: J202644 | Clave: 123456 | Rodrigo Arias
	Usuario: J202645 | Clave: 123456 | Valentina Rivas
	Usuario: J202646 | Clave: 123456 | Alejandro Meza
	Usuario: J202647 | Clave: 123456 | Daniela Pinto
	Usuario: J202648 | Clave: 123456 | Ximena Aguirre
	Usuario: J202649 | Clave: 123456 | Renzo Molina
	Usuario: J202650 | Clave: 123456 | Camilo Herrera
	Usuario: J202651 | Clave: 123456 | Isabella Garcia
	Usuario: J202652 | Clave: 123456 | Thiago Vasquez
	Usuario: J202653 | Clave: 123456 | Antonella Cortez
	Usuario: J202654 | Clave: 123456 | Benjamin Espino
	Usuario: J202655 | Clave: 123456 | Ariana Vera
	Usuario: J202656 | Clave: 123456 | Nicolas Zamora
	
	-------------------------
	RECEPCIONISTAS (ROL U)
	-------------------------
	Usuario: U100001 | Clave: 123456 | Zully Tatiana Tello Ra
	Usuario: U100002 | Clave: 123456 | Ulises Ponce
	Usuario: U100003 | Clave: 123456 | Ubaldo Sanchez
	
	-------------------------
	PACIENTES
	-------------------------
	Usuario = DNI | Clave: 123456
	
	Ejemplo:
	72840001 | 123456
	=========================================================
	*/