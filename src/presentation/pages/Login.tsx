import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate } from 'react-router-dom'
import { AuthLayout } from '@/presentation/layouts'
import { Button, Input, Label, Card, CardContent } from '@/presentation/components/ui'
import { useAuth } from '@/presentation/hooks'
import { loginSchema, type LoginFormData } from '@/shared/schemas'
import { useAuthStore } from '@/stores'
import { InvalidCredentialsError } from '@/domain/errors'

export function Login() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { login, isLoading, error } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  const credentialsError = error instanceof InvalidCredentialsError

  return (
    <AuthLayout>
      <Card className="shadow-[var(--shadow-lg)] animate-fade-in-up">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-surface-900">
              Bem-vindo de volta
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                state={errors.email ? 'error' : 'default'}
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[13px] text-danger-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button type="button" className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Esqueci minha senha
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                state={errors.password ? 'error' : 'default'}
                {...register('password')}
              />
              {errors.password && (
                <p className="text-[13px] text-danger-500">{errors.password.message}</p>
              )}
            </div>

            {credentialsError && (
              <div className="rounded-lg bg-danger-50 px-4 py-3" role="alert">
                <p className="text-[13px] font-medium text-danger-600">
                  E-mail ou senha inválidos. Verifique e tente novamente.
                </p>
              </div>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
