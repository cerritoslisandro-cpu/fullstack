<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Gestión de Productos</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">
        + Nuevo Producto
      </button>
    </div>

    <!-- Indicador de Carga (Spinner) -->
    <div v-if="productStore.loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando productos...</span>
      </div>
      <p class="mt-2 text-muted">Cargando datos desde Quarkus...</p>
    </div>

    <!-- Mensaje de Error -->
    <div v-if="productStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error:</strong> {{ productStore.error }}
    </div>

    <!-- Tabla Dinámica de Productos -->
    <div v-if="!productStore.loading && productStore.productos.length > 0" class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio ($)</th>
            <th>Stock</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productStore.productos" :key="producto.id">
            <td>{{ producto.id }}</td>
            <td>{{ producto.nombre }}</td>
            <td>${{ producto.precio.toFixed(2) }}</td>
            <td>
              <span 
                class="badge" 
                :class="producto.stock > 5 ? 'bg-success' : 'bg-warning text-dark'"
              >
                {{ producto.stock }} unidades
              </span>
            </td>
            <td class="text-center">
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click="confirmarEliminar(producto.id!)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado Vacío -->
    <div v-if="!productStore.loading && productStore.productos.length === 0" class="text-center my-5 text-muted">
      <p>No hay productos registrados en la base de datos H2.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '../stores/productStore'

// Inicializar el Store de Pinia
const productStore = useProductStore()

// Cargar los productos automáticamente al cargar el componente
onMounted(() => {
  productStore.fetchProductos()
})

// Función para confirmar y eliminar un producto
const confirmarEliminar = (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    productStore.deleteProducto(id)
  }
}

const abrirModalCrear = () => {
  alert('El formulario modal para agregar producto lo conectaremos en el Paso 3.')
}
</script>
