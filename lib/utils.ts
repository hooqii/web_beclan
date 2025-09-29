import { getToken } from '@/app/_actions/auth'
import { clsx, type ClassValue } from 'clsx'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (tanggal: Date) => {
  return format(tanggal, "dd-MM-yyyy")
}

export const formatHours = (tanggal: Date) => {
  return format(tanggal, "HH:mm")
}

export const getRequest = async <T = any>(endpoint: string) => {
  const token = await getToken()
  const response = await fetch(endpoint, {
    headers: {"Authorization": `Bearer ${token}`}
  })
  if (response.status === 401) {
    redirect("/login")
  }
  const json = await response.json()
  const data = json.data as T
  return {
    status: response.status,
    json,
    data
  }
}