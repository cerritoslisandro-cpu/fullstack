<template>
  <div class="container">
    <div class="header">
      <h2>Gestión de Productos (CRUD)</h2>
      <button @click="logout" class="btn-logout">Cerrar Sesión</button>
    </div>

    <!-- Secciones de alertas/notificaciones -->
    <div v-if="mensajeExito" class="alert success">{{ mensajeExito }}</div>
    <div v-if="mensajeError" class="alert error">{{ mensajeError }}</div>

    <!-- Formulario de Crear / Editar -->
    <div class="card-form">
      <h3>{{ editando ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h3>
      <form @submit.prevent="guardarProducto" class="form-grid">
        <div class="form-group">
          <label>Nombre:</label>
          <input 
            v-model="form.nombre" 
            type="text" 
            placeholder="Ej. Teclado Mecánico" 
            required 
          />
        </div>
        <div class="form-group">
          <label>Precio ($):</label>
          <input 
            v-model.number="form.precio" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save">
            {{ editando ? 'Actualizar' : 'Guardar' }}
          </button>
          <button v-if="editando" type="button" @click="cancelarEdicion" class="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Tabla de Productos -->
    <div class="card-table">
      <h3>Lista de Productos</h3>
      <p v-if="cargando">Cargando productos...</p>
      <p v-else-if="productos.length === 0">No hay productos registrados en el sistema.</p>

      <table v-else class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in productos" :key="prod.id">
            <td>{{ prod.id }}</td>
            <td>{{ prod.nombre }}</td>
            <td>${{ prod.precio ? prod.precio.toFixed(2) : '0.00' }}</td>
            <td>
              <button @click="prepararEdicion(prod)" class="btn-edit">Editar</button>
              <button @click="eliminarProducto(prod.id)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const productos = ref([]);
const cargando = ref(true);
const editando = ref(false);
const idEditando = ref(null);

const mensajeExito = ref('');
const mensajeError = ref('');

const form = ref({
  nombre: '',
  precio: null
});

const router = useRouter();

// 1. LEER (GET)
const cargarProductos = async () => {
  cargando.value = true;
  try {
    const response = await api.get('/productos');
    productos.value = response.data;
  } catch (error) {
    mostrarError('Error al cargar la lista de productos.');
  } finally {
    cargando.value = false;
  }
};

// 2. CREAR (POST) / ACTUALIZAR (PUT)
const guardarProducto = async () => {
  // Validación de Formulario en Cliente
  if (!form.value.nombre.trim()) {
    mostrarError('El nombre del producto no puede estar vacío.');
    return;
  }
  if (form.value.precio === null || form.value.precio <= 0) {
    mostrarError('El precio debe ser un número mayor a 0.');
    return;
  }

  try {
    if (editando.value) {
      // Petición PUT
      await api.put(`/productos/${idEditando.value}`, {
        nombre: form.value.nombre,
        precio: form.value.precio
      });
      mostrarExito('Producto actualizado correctamente.');
    } else {
      // Petición POST
      await api.post('/productos', {
        nombre: form.value.nombre,
        precio: form.value.precio
      });
      mostrarExito('Producto creado exitosamente.');
    }
    
    resetFormulario();
    await cargarProductos();
  } catch (error) {
    mostrarError('Ocurrió un error al procesar la solicitud.');
  }
};

// 3. PREPARAR EDICIÓN
const prepararEdicion = (producto) => {
  editando.value = true;
  idEditando.value = producto.id;
  form.value.nombre = producto.nombre;
  form.value.precio = producto.precio;
};

// CANCELAR EDICIÓN
const cancelarEdicion = () => {
  resetFormulario();
};

// 4. ELIMINAR (DELETE)
const eliminarProducto = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

  try {
    await api.delete(`/productos/${id}`);
    mostrarExito('Producto eliminado correctamente.');
    await cargarProductos();
  } catch (error) {
    mostrarError('No se pudo eliminar el producto.');
  }
};

// LIMPIAR FORMULARIO
const resetFormulario = () => {
  editando.value = false;
  idEditando.value = null;
  form.value = { nombre: '', precio: null };
};

// LOGOUT
const logout = () => {
  localStorage.removeItem('jwt_token');
  router.push('/login');
};

// AUXILIARES NOTIFICACIONES
const mostrarExito = (txt) => {
  mensajeExito.value = txt;
  mensajeError.value = '';
  setTimeout(() => { mensajeExito.value = ''; }, 3000);
};

const mostrarError = (txt) => {
  mensajeError.value = txt;
  mensajeExito.value = '';
  setTimeout(() => { mensajeError.value = ''; }, 4000);
};

onMounted(cargarProductos);
</script>

<style scoped>
.container { max-width: 800px; margin: 20px auto; font-family: sans-serif; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-logout { background-color: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; }
.card-form, .card-table { background: #f9f9f9; padding: 15px; border-radius: 6px; border: 1px solid #ddd; margin-bottom: 20px; }
.form-grid { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
.form-group { display: flex; flex-direction: column; }
.form-group input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; }
.form-actions { display: flex; gap: 5px; }
.btn-save { background: #2ecc71; color: white; border: none; padding: 7px 15px; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #95a5a6; color: white; border: none; padding: 7px 12px; border-radius: 4px; cursor: pointer; }
.tabla { width: 100%; border-collapse: collapse; margin-top: 10px; }
.tabla th, .tabla td { border: 1px solid #ccc; padding: 8px; text-align: left; }
.btn-edit { background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 3px; margin-right: 5px; cursor: pointer; }
.btn-delete { background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; }
.alert { padding: 10px; border-radius: 4px; margin-bottom: 15px; }
.alert.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.alert.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
</style>
