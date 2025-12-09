import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export function useLogin() {
  const router = useRouter()
  const username = ref('')
  const password = ref('')
  const error = ref('')

  const login = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login/', {
        username: username.value,
        password: password.value,
      })

      localStorage.setItem('token', res.data.access)
      localStorage.setItem('username', username.value)

      router.push('/dashboard')
    } catch {
      error.value = 'Invalid credentials'
    }
  }

  return { username, password, error, login }
}
