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
      <button type="button" class="btn-close" @click="productStore.error = null"></button>
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
            <td>${{ producto.precio ? producto.precio.toFixed(2) : '0.00' }}</td>
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

    <!-- Modal Formulario para Crear Producto -->
    <div v-if="mostrarModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Agregar Nuevo Producto</h5>
            <button type="button" class="btn-close btn-close-white" @click="cerrarModal"></button>
          </div>
          <form @submit.prevent="guardarProducto">
            <div class="modal-body">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre del Producto</label>
                <input 
                  type="text" 
                  id="nombre" 
                  v-model="nuevoProducto.nombre" 
                  class="form-control" 
                  placeholder="Ej. Laptop Dell"
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="precio" class="form-label">Precio ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  id="precio" 
                  v-model.number="nuevoProducto.precio" 
                  class="form-control" 
                  placeholder="Ej. 750.50"
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">Stock Inicial</label>
                <input 
                  type="number" 
                  id="stock" 
                  v-model.number="nuevoProducto.stock" 
                  class="form-control" 
                  placeholder="Ej. 10"
                  required 
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                <span v-if="guardando" class="spinner-border spinner-border-sm me-1"></span>
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductStore, type Producto } from '../stores/productStore'

const productStore = useProductStore()

// Estado reactivo del modal y formulario
const mostrarModal = ref(false)
const guardando = ref(false)

const nuevoProducto = ref<Producto>({
  nombre: '',
  precio: 0,
  stock: 0
})

onMounted(() => {
  productStore.fetchProductos()
})

const abrirModalCrear = () => {
  nuevoProducto.value = { nombre: '', precio: 0, stock: 0 }
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarProducto = async () => {
  guardando.value = true
  try {
    await productStore.addProducto({ ...nuevoProducto.value })
    cerrarModal()
  } catch (err) {
    // El error se maneja y muestra automáticamente desde el store
  } finally {
    guardando.value = false
  }
}

const confirmarEliminar = (id: number) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    productStore.deleteProducto(id)
  }
}
</script>
