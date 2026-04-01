import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@/shared/test/test-utils'
import { Login } from './Login'
import { useAuthStore } from '@/stores'

describe('Login Page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  it('should render the login form', () => {
    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/e-mail inválido/i)).toBeInTheDocument()
    })
  })

  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    await user.type(screen.getByLabelText('E-mail'), 'wrong@email.com')
    await user.type(screen.getByLabelText('Senha'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/e-mail ou senha inválidos/i)).toBeInTheDocument()
    })
  })

  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Login />, { initialEntries: ['/login'] })

    await user.type(screen.getByLabelText('E-mail'), 'user@onda.com')
    await user.type(screen.getByLabelText('Senha'), '123456')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().user?.email).toBe('user@onda.com')
    })
  })
})
