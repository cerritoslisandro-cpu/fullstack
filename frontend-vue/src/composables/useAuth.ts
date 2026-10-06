import { ref, computed } from 'vue';
import { login as loginService, type LoginCredentials } from '../services/authService';

const token = ref<string | null>(localStorage.getItem('jwt_token'));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (credentials: LoginCredentials) => {
    const data = await loginService(credentials);
    token.value = data.token;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    token.value = null;
  };

  return {
    token,
    isAuthenticated,
    login,
    logout
  };
}
