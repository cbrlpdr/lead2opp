import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount?: number) => {
    if (!amount) return "Not specified"
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case "new":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        case "contacted":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        case "qualified":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
}

export const getStageColor = (stage: string) => {
    switch (stage) {
        case "Proposal":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        case "Negotiation":
            return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
        case "Closed Won":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}


export function simulateLatency(minDelay: number = 800, maxDelay: number = 4000): number {
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
}
