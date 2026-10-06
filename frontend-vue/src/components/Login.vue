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
      <p v-if="loginError" role="alert">{{ loginError }}</p>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const loginError = ref('');
const router = useRouter();
const { login } = useAuth();

const handleLogin = async () => {
  loginError.value = '';

  try {
    await login({
      username: username.value,
      password: password.value
    });
    router.push('/productos');
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      loginError.value = 'Usuario o contraseña incorrectos.';
    } else if (isAxiosError(error) && error.response) {
      loginError.value = `No se pudo iniciar sesión (HTTP ${error.response.status}). Comprueba la configuración del servidor.`;
    } else {
      loginError.value = 'No se pudo conectar con el servidor. Comprueba que el backend esté disponible.';
    }
  }
};
</script>