package com.empresa.sistema_compras.modules.producto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "precio_compra")
    private Double precioCompra;

    @Column(name = "precio_venta")
    private Double precioVenta;

    @Column(name = "cantidad_inventario")
    private Integer cantidadInventario = 0;

    @Column(nullable = false)
    private String estado = "ACTIVO";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecioCompra() { return precioCompra; }
    public void setPrecioCompra(Double precioCompra) { this.precioCompra = precioCompra; }
    public Double getPrecioVenta() { return precioVenta; }
    public void setPrecioVenta(Double precioVenta) { this.precioVenta = precioVenta; }
    public Integer getCantidadInventario() { return cantidadInventario; }
    public void setCantidadInventario(Integer cantidadInventario) { this.cantidadInventario = cantidadInventario; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}