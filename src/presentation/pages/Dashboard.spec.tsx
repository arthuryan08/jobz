import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/shared/test/test-utils'
import { Dashboard } from './Dashboard'
import { useAuthStore } from '@/stores'

describe('Dashboard Page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'João Silva', email: 'user@onda.com' },
      token: 'mock-token',
      isAuthenticated: true,
    })
  })

  it('should display the balance', async () => {
    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    await waitFor(() => {
      expect(screen.getByText(/5\.000,00/)).toBeInTheDocument()
    })
  })

  it('should display the transaction list', async () => {
    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    await waitFor(() => {
      expect(screen.getByText('Salário')).toBeInTheDocument()
      expect(screen.getByText('Aluguel')).toBeInTheDocument()
      expect(screen.getByText('Supermercado')).toBeInTheDocument()
      expect(screen.getByText('Freelance')).toBeInTheDocument()
      expect(screen.getByText('Internet')).toBeInTheDocument()
    })
  })

  it('should display a dynamic greeting with user first name', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 3, 1, 10, 0, 0)) // 10am = Bom dia

    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    expect(screen.getByText(/Bom dia, João/)).toBeInTheDocument()

    vi.useRealTimers()
  })

  it('should have a link to create a new transfer', async () => {
    renderWithProviders(<Dashboard />, { initialEntries: ['/dashboard'] })

    await waitFor(() => {
      expect(screen.getByText('Nova Transferência')).toBeInTheDocument()
    })
  })
})
