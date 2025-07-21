/**
 * Concentra todos os caminhos de API usados
 * pela camada de fetch ou pelos hooks SWR/React-Query.
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    verify: "/api/auth/verify",
  },
  groups: "/api/groups",
  expenses: "/api/expenses",
  invites: "/api/invites",
} as const

/**
 * Ajuda genérica de fetch – pode ser trocada por SWR/React-Query se preferir.
 */
export async function apiFetch<T>(endpoint: keyof typeof API_ENDPOINTS | string, options?: RequestInit): Promise<T> {
  const url = typeof endpoint === "string" ? endpoint : (API_ENDPOINTS as Record<string, string>)[endpoint]

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Erro ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}
