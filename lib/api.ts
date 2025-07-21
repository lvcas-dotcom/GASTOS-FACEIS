// Endpoints da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    VERIFY: "/api/auth/verify",
    LOGOUT: "/api/auth/logout",
  },
  USER: {
    PROFILE: "/api/user/profile",
    UPDATE: "/api/user/update",
    DELETE: "/api/user/delete",
  },
  GROUPS: {
    LIST: "/api/groups",
    CREATE: "/api/groups",
    UPDATE: "/api/groups",
    DELETE: "/api/groups",
    MEMBERS: "/api/groups/members",
    LEAVE: "/api/groups/leave",
  },
  EXPENSES: {
    LIST: "/api/expenses",
    CREATE: "/api/expenses",
    UPDATE: "/api/expenses",
    DELETE: "/api/expenses",
  },
  INVITES: {
    CREATE: "/api/invites",
    ACCEPT: "/api/invites/accept",
    LIST: "/api/invites",
  },
}

// Função helper para fazer requisições autenticadas
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(endpoint, config)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new Error(error.message || `Erro ${response.status}`)
  }

  return response.json()
}

// Funções específicas para cada endpoint
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  verify: () => apiRequest(API_ENDPOINTS.AUTH.VERIFY),
}

export const groupsAPI = {
  list: () => apiRequest(API_ENDPOINTS.GROUPS.LIST),

  create: (name: string, description?: string) =>
    apiRequest(API_ENDPOINTS.GROUPS.CREATE, {
      method: "POST",
      body: JSON.stringify({ name, description }),
    }),
}

export const expensesAPI = {
  list: () => apiRequest(API_ENDPOINTS.EXPENSES.LIST),

  create: (groupId: string, description: string, amount: number, category: string) =>
    apiRequest(API_ENDPOINTS.EXPENSES.CREATE, {
      method: "POST",
      body: JSON.stringify({
        group_id: groupId,
        description,
        amount,
        category,
      }),
    }),
}
