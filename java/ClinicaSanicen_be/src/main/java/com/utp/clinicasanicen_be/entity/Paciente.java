package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "paciente")
public class Paciente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Integer idPaciente;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", length = 100)
    private String apellido;

    @Column(name = "dni", length = 8)
    private String dni;
    
    @Column(name = "sexo", length = 2)
    private String sexo;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "direccion", length = 250)
    private String direccion;
    
    @Column(name = "telefono", length = 13)
    private String telefono;
    
    @Column(name = "correo", length = 150)
    private String correo;
    
    @Column(name = "nro_historia", length = 6)
    private String nroHistoria;
    
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cita> citas;
    
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HistorialMedico> historialesMedicos;
    
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Receta> recetas;
    
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BoletaPago> boletasPago;
    
    public Paciente() {
    }
    
    public Integer getIdPaciente() {
        return idPaciente;
    }
    
    public void setIdPaciente(Integer idPaciente) {
        this.idPaciente = idPaciente;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getApellido() {
        return apellido;
    }
    
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }
    
    public String getSexo() {
        return sexo;
    }
    
    public void setSexo(String sexo) {
        this.sexo = sexo;
    }
    
    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }
    
    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public String getTelefono() {
        return telefono;
    }
    
    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getNroHistoria() {
        return nroHistoria;
    }
    
    public void setNroHistoria(String nroHistoria) {
        this.nroHistoria = nroHistoria;
    }
    
    public List<Cita> getCitas() {
        return citas;
    }
    
    public void setCitas(List<Cita> citas) {
        this.citas = citas;
    }
    
    public List<HistorialMedico> getHistorialesMedicos() {
        return historialesMedicos;
    }
    
    public void setHistorialesMedicos(List<HistorialMedico> historialesMedicos) {
        this.historialesMedicos = historialesMedicos;
    }
    
    public List<Receta> getRecetas() {
        return recetas;
    }
    
    public void setRecetas(List<Receta> recetas) {
        this.recetas = recetas;
    }
    
    public List<BoletaPago> getBoletasPago() {
        return boletasPago;
    }
    
    public void setBoletasPago(List<BoletaPago> boletasPago) {
        this.boletasPago = boletasPago;
    }
}