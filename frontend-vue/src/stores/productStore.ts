import { defineStore } from 'pinia'
import axios from 'axios'

export interface Producto {
  id?: number
  nombre: string
  precio: number
  stock: number
}

interface ProductState {
  productos: Producto[]
  loading: boolean
  error: string | null
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    productos: [],
    loading: false,
    error: null
  }),

  actions: {
    // 1. OBTENER TODOS LOS PRODUCTOS
    async fetchProductos() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get<Producto[]>('/api/productos')
        this.productos = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al cargar los productos'
      } finally {
        this.loading = false
      }
    },

    // 2. AGREGAR UN NUEVO PRODUCTO
    async addProducto(nuevoProducto: Producto) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post<Producto>('/api/productos', nuevoProducto)
        this.productos.push(response.data)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al guardar el producto'
        throw err
      } finally {
        this.loading = false
      }
    },

    // 3. ELIMINAR UN PRODUCTO
    async deleteProducto(id: number) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/api/productos/${id}`)
        this.productos = this.productos.filter((p) => p.id !== id)
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al eliminar el producto'
      } finally {
        this.loading = false
      }
    }
  }
})
