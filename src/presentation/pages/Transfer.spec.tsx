import { describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, screen, userEvent, waitFor } from '@/shared/test/test-utils'
import { Transfer } from './Transfer'
import { useAuthStore, useBalanceStore } from '@/stores'

describe('Transfer Page', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'João Silva', email: 'user@onda.com' },
      token: 'mock-token',
      isAuthenticated: true,
    })
    useBalanceStore.setState({ balanceCents: 500000 })
  })

  it('should render the transfer form with category dropdown', () => {
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    expect(screen.getByLabelText('Selecione a categoria')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar transferência/i })).toBeInTheDocument()
  })

  it('should display current balance', () => {
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    expect(screen.getByText(/5\.000,00/)).toBeInTheDocument()
  })

  it('should show validation error when no category selected', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    const amountInput = screen.getByLabelText('Valor')
    await user.click(amountInput)
    await user.keyboard('10000')

    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    await waitFor(() => {
      expect(screen.getByText(/selecione uma categoria/i)).toBeInTheDocument()
    })
  })

  it('should open dropdown and show category options with icons', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    await user.click(screen.getByLabelText('Selecione a categoria'))

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Aluguel' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Salário' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Educação' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Restaurante' })).toBeInTheDocument()
    })
  })

  it('should select a category from the dropdown', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    await user.click(screen.getByLabelText('Selecione a categoria'))
    await user.click(screen.getByRole('option', { name: 'Aluguel' }))

    expect(screen.getByText('Aluguel')).toBeInTheDocument()
  })

  it('should format currency input like a banking app', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    const amountInput = screen.getByLabelText('Valor')
    await user.click(amountInput)

    await user.keyboard('3')
    expect(amountInput).toHaveValue('0,03')

    await user.keyboard('2')
    expect(amountInput).toHaveValue('0,32')

    await user.keyboard('5')
    expect(amountInput).toHaveValue('3,25')

    await user.keyboard('9')
    expect(amountInput).toHaveValue('32,59')

    await user.keyboard('{Backspace}')
    expect(amountInput).toHaveValue('3,25')
  })

  it('should show receipt after valid transfer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    // Select category
    await user.click(screen.getByLabelText('Selecione a categoria'))
    await user.click(screen.getByRole('option', { name: 'Aluguel' }))

    // Enter amount
    const amountInput = screen.getByLabelText('Valor')
    await user.click(amountInput)
    await user.keyboard('50000')

    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    // Confirmation dialog
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Transferir' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: 'Transferir' }))

    // Receipt shown
    await waitFor(() => {
      expect(screen.getByText(/transferência realizada/i)).toBeInTheDocument()
      expect(screen.getByText('Aluguel')).toBeInTheDocument()
    })
  })

  it('should show error for insufficient balance', async () => {
    useBalanceStore.setState({ balanceCents: 10000 })
    const user = userEvent.setup()
    renderWithProviders(<Transfer />, { initialEntries: ['/transfer'] })

    // Select category
    await user.click(screen.getByLabelText('Selecione a categoria'))
    await user.click(screen.getByRole('option', { name: 'Supermercado' }))

    // Enter amount
    const amountInput = screen.getByLabelText('Valor')
    await user.click(amountInput)
    await user.keyboard('5000000')

    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    // Confirmation dialog
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Transferir' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: 'Transferir' }))

    await waitFor(() => {
      expect(screen.getByText(/saldo insuficiente/i)).toBeInTheDocument()
    })
  })
})
