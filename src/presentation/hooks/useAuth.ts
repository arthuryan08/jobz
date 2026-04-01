import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores'
import { authenticateUseCase } from '@/shared/lib/services'
import type { LoginFormData } from '@/shared/schemas'

export function useAuth() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      authenticateUseCase.execute(data),
    onSuccess: (result) => {
      login(result.user, result.token)
      navigate('/dashboard')
    },
  })

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
