package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "medico")
public class Medico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medico")
    private Integer idMedico;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", length = 100)
    private String apellido;
    
    @Column(name = "dni", length = 8)
    private String dni;
    
    @Column(name = "telefono", length = 13)
    private String telefono;
    
    @Column(name = "correo", length = 150)
    private String correo;
    
    @Column(name = "direccion", length = 250)
    private String direccion;
    
    @ManyToOne
    @JoinColumn(name = "id_especialidad")
    @JsonIgnoreProperties({"medicos"})
    private Especialidad especialidad;
    
    @Column(name = "activo")
    private Boolean activo = true;
    
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Cita> citas;
    
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HistorialMedico> historialesMedicos;
    
    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Receta> recetas;
    
    public Medico() {}
    
    
    public Integer getIdMedico() {
        return idMedico;
    }
    
    public void setIdMedico(Integer idMedico) {
        this.idMedico = idMedico;
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
    
    public String getDireccion() {
        return direccion;
    }
    
    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
    
    public Especialidad getEspecialidad() {
        return especialidad;
    }
    
    public void setEspecialidad(Especialidad especialidad) {
        this.especialidad = especialidad;
    }
    
    public Boolean getActivo() {
        return activo;
    }
    
    public void setActivo(Boolean activo) {
        this.activo = activo;
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
}

