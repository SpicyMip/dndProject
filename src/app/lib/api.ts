export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  
  // Obtener el token de Firebase guardado por el AuthContext
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null

  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `API Error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

// Helper para métodos comunes
export const api = {
  get: <T>(e: string) => apiFetch<T>(e, { method: "GET" }),
  post: <T>(e: string, b: any) => apiFetch<T>(e, { method: "POST", body: JSON.stringify(b) }),
  put: <T>(e: string, b: any) => apiFetch<T>(e, { method: "PUT", body: JSON.stringify(b) }),
  patch: <T>(e: string, b: any) => apiFetch<T>(e, { method: "PATCH", body: JSON.stringify(b) }),
  delete: <T>(e: string) => apiFetch<T>(e, { method: "DELETE" }),
}
