import { ref, computed } from 'vue';
import { login as loginService, type LoginCredentials } from '../services/authService';

const token = ref<string | null>(localStorage.getItem('token'));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginCredentials) => {
    const data = await loginService(credentials);
    token.value = data.token;
  };

  const logout = () => {
    localStorage.removeItem('token');
    token.value = null;
  };

  return {
    token,
    isAuthenticated,
    login,
    logout
  };
}
