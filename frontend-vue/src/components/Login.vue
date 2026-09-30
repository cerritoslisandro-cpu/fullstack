<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Usuario:</label>
        <input v-model="username" type="text" required />
      </div>
      <div>
        <label>Contraseña:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    });
    
    // Guardar el token devuelto por Quarkus
    localStorage.setItem('jwt_token', response.data.token);
    
    // Redirigir a la vista protegida de productos
    router.push('/productos');
  } catch (error) {
    alert('Credenciales incorrectas');
  }
};
</script>