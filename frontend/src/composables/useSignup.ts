import { ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"

export function useSignup() {
  const router = useRouter()

  const username = ref("")
  const password = ref("")
  const password2 = ref("")
  const error = ref("")

  const signup = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", {
        username: username.value,
        password: password.value,
        password2: password2.value,
      })

      router.push("/login")
    } catch (err: any) {
      error.value = err.response?.data || "Signup failed"
    }
  }

  return { username, password, password2, error, signup }
}
