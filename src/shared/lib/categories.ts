import {
  Briefcase, Home, ShoppingCart, Laptop, Wifi, CreditCard,
  GraduationCap, Heart, Bus, UtensilsCrossed, Gamepad2, Zap,
  Gift, Smartphone, Droplets,
  type LucideIcon,
} from 'lucide-react'

export interface TransferCategory {
  value: string
  label: string
  icon: LucideIcon
}

export const transferCategories: TransferCategory[] = [
  { value: 'Salário',        label: 'Salário',        icon: Briefcase },
  { value: 'Aluguel',        label: 'Aluguel',        icon: Home },
  { value: 'Supermercado',   label: 'Supermercado',   icon: ShoppingCart },
  { value: 'Freelance',      label: 'Freelance',      icon: Laptop },
  { value: 'Internet',       label: 'Internet',       icon: Wifi },
  { value: 'Educação',       label: 'Educação',       icon: GraduationCap },
  { value: 'Saúde',          label: 'Saúde',          icon: Heart },
  { value: 'Transporte',     label: 'Transporte',     icon: Bus },
  { value: 'Restaurante',    label: 'Restaurante',    icon: UtensilsCrossed },
  { value: 'Lazer',          label: 'Lazer',          icon: Gamepad2 },
  { value: 'Energia',        label: 'Energia',        icon: Zap },
  { value: 'Presente',       label: 'Presente',       icon: Gift },
  { value: 'Celular',        label: 'Celular',        icon: Smartphone },
  { value: 'Água',           label: 'Água',           icon: Droplets },
  { value: 'Outros',         label: 'Outros',         icon: CreditCard },
]

export const categoryIconMap: Record<string, LucideIcon> = Object.fromEntries(
  transferCategories.map((c) => [c.value, c.icon])
)
