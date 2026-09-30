package com.ejemplo;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Producto extends PanacheEntity {
    
    public String nombre;
    public Double precio;

    public Producto() {}

    public Producto(String nombre, Double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}