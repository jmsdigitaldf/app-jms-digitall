import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    QUOTED: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    WAITING_PART: 'bg-orange-100 text-orange-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    QUOTED: 'Orçado',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
    IN_PROGRESS: 'Em Andamento',
    WAITING_PART: 'Aguardando Peça',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  }
  return labels[status] || status
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

export function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
    URGENT: 'Urgente',
  }
  return labels[priority] || priority
}

export function getProblemTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SCREEN: 'Tela',
    BATTERY: 'Bateria',
    KEYBOARD: 'Teclado',
    SLOW_PERFORMANCE: 'Lentidão',
    VIRUS_MALWARE: 'Vírus',
    HARDWARE: 'Hardware',
    SOFTWARE: 'Software',
    FORMAT_OS: 'Formatação',
    DATA_RECOVERY: 'Dados',
    NETWORK_WIFI: 'Rede/WiFi',
    AUDIO: 'Áudio',
    POWER_JACK: 'Energia',
    MOTHERBOARD: 'Placa-mãe',
    COOLING: 'Refrigeração',
    OTHER: 'Outro',
  }
  return labels[type] || type
}
