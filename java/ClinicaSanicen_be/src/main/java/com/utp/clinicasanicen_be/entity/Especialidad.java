package com.utp.clinicasanicen_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "especialidades")
public class Especialidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Integer idEspecialidad;
    
    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;
    
    @Column(name = "descripcion", length = 350)
    private String descripcion;
    
    @OneToMany(mappedBy = "especialidad", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Medico> medicos;
    
    public Especialidad() {}
    
    
    public Integer getIdEspecialidad() {
        return idEspecialidad;
    }
    
    public void setIdEspecialidad(Integer idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public List<Medico> getMedicos() {
        return medicos;
    }
    
    public void setMedicos(List<Medico> medicos) {
        this.medicos = medicos;
    }
}

