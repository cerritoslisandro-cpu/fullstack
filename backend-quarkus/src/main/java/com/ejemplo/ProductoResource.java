package com.ejemplo;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {

    // 1. OBTENER TODOS (GET)
    @GET
    public List<Producto> obtenerTodos() {
        return Producto.listAll();
    }

    // 2. CREAR PRODUCTO (POST)
    @POST
    @Transactional
    public Response crearProducto(Producto nuevoProducto) {
        if (nuevoProducto.nombre == null || nuevoProducto.nombre.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("El nombre del producto es obligatorio").build();
        }
        nuevoProducto.persist();
        return Response.status(Response.Status.CREATED).entity(nuevoProducto).build();
    }

    // 3. ACTUALIZAR PRODUCTO (PUT)
    @PUT
    @Path("/{id}")
    @Transactional
    public Response actualizarProducto(@PathParam("id") Long id, Producto productoActualizado) {
        Producto p = Producto.findById(id);
        if (p == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        p.nombre = productoActualizado.nombre;
        p.precio = productoActualizado.precio;
        return Response.ok(p).build();
    }

    // 4. ELIMINAR PRODUCTO (DELETE)
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response eliminarProducto(@PathParam("id") Long id) {
        boolean eliminado = Producto.deleteById(id);
        if (eliminado) {
            return Response.noContent().build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }
}