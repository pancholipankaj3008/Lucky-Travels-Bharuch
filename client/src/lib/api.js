const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}, retry = true) {
  const isForm = options.body instanceof FormData
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...options.headers },
    })
  } catch {
    throw new Error('Server se connect nahi ho pa raha. Please try again.')
  }
  if (response.status === 401 && retry && !['/admin/login', '/admin/refresh', '/admin/logout'].includes(path)) {
    const refreshed = await fetch(`${API_BASE}/admin/refresh`, { method: 'POST', credentials: 'include' })
    if (refreshed.ok) return request(path, options, false)
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.')
    error.status = response.status
    throw error
  }
  return data
}

export const api = {
  getCars: () => request('/cars'),
  getAdminSession: () => request('/admin/me'),
  login: (email, password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/admin/logout', { method: 'POST' }),
  addCar: (body) => request('/cars', { method: 'POST', body }),
  updateCar: (id, body) => request(`/cars/${id}`, { method: 'PUT', body }),
  deleteCar: (id) => request(`/cars/${id}`, { method: 'DELETE' }),
  sendEnquiry: (body) => request('/email/send', { method: 'POST', body: JSON.stringify(body) }),
}
